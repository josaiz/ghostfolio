import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';

export const DEMO_MARKER = 'WORKSHOP_DEMO_DATA';
export const DEFAULT_BASE_URL = 'http://localhost:3333';

export const DATASET_FILES = [
  {
    fileName: 'myinvestor-core-etf.csv',
    accountName: 'MyInvestor Core ETF',
    currency: 'EUR'
  },
  {
    fileName: 'trade-republic-growth.csv',
    accountName: 'Trade Republic Growth',
    currency: 'USD'
  },
  {
    fileName: 'crypto-exchange.csv',
    accountName: 'Crypto Exchange',
    currency: 'USD'
  }
];

const YAHOO_CRYPTO_SYMBOLS = new Map([
  ['BTC-USD', 'BTCUSD'],
  ['ETH-USD', 'ETHUSD']
]);

export function getRepoRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
}

export function getBaseUrl() {
  return (process.env.GHOSTFOLIO_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

export function printStep(message) {
  console.log(`\n==> ${message}`);
}

export async function ensureGhostfolioIsUp(baseUrl = getBaseUrl()) {
  try {
    const response = await fetch(`${baseUrl}/api/v1/health`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`health endpoint returned ${response.status}`);
    }
  } catch (error) {
    throw new Error(
      `Ghostfolio is not responding at ${baseUrl}. Start it first with ./scripts/start.sh. (${error.message})`
    );
  }
}

export function ensureDataset() {
  const repoRoot = getRepoRoot();
  const importDir = path.join(repoRoot, 'data', 'workshop', 'import');
  const zipPath = path.join(
    repoRoot,
    'data',
    'workshop',
    'ghostfolio-workshop-dataset.zip'
  );

  const missingFiles = DATASET_FILES.filter(
    ({ fileName }) => !fs.existsSync(path.join(importDir, fileName))
  );

  if (missingFiles.length === 0) {
    return { importDir };
  }

  if (fs.existsSync(zipPath)) {
    extractDatasetZip({ zipPath, destination: path.join(repoRoot, 'data', 'workshop') });

    const missingAfterExtract = DATASET_FILES.filter(
      ({ fileName }) => !fs.existsSync(path.join(importDir, fileName))
    );

    if (missingAfterExtract.length === 0) {
      return { importDir };
    }
  }

  throw new Error(
    'Workshop dataset not found. Please place ghostfolio-workshop-dataset.zip in data/workshop/ or extract the CSV files into data/workshop/import/.'
  );
}

function extractDatasetZip({ zipPath, destination }) {
  printStep('Extracting workshop dataset zip');

  let result;

  if (process.platform === 'win32') {
    const command = [
      'Expand-Archive',
      '-LiteralPath',
      powershellQuote(zipPath),
      '-DestinationPath',
      powershellQuote(destination),
      '-Force'
    ].join(' ');

    result = spawnSync(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command],
      { stdio: 'inherit' }
    );
  } else {
    result = spawnSync('unzip', ['-q', '-o', zipPath, '-d', destination], {
      stdio: 'inherit'
    });
  }

  if (result.error) {
    throw new Error(
      `Could not extract dataset zip. Install unzip on Mac/Linux or use PowerShell Expand-Archive on Windows. (${result.error.message})`
    );
  }

  if (result.status !== 0) {
    throw new Error('Could not extract dataset zip.');
  }
}

function powershellQuote(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

export async function getAuthToken({ baseUrl = getBaseUrl() } = {}) {
  if (process.env.GHOSTFOLIO_AUTH_TOKEN) {
    return process.env.GHOSTFOLIO_AUTH_TOKEN;
  }

  const accessToken =
    process.env.GHOSTFOLIO_ACCESS_TOKEN ||
    process.env.GHOSTFOLIO_SECURITY_TOKEN ||
    process.env.GHOSTFOLIO_ADMIN_PASSWORD;

  if (process.env.GHOSTFOLIO_ADMIN_PASSWORD) {
    console.warn(
      'Note: this Ghostfolio version has no local email/password login. Treating GHOSTFOLIO_ADMIN_PASSWORD as the local security token and ignoring GHOSTFOLIO_ADMIN_EMAIL.'
    );
  }

  const securityToken =
    accessToken || (await promptHidden('Ghostfolio security token: '));

  const response = await fetch(`${baseUrl}/api/v1/auth/anonymous`, {
    body: JSON.stringify({ accessToken: securityToken }),
    headers: { 'content-type': 'application/json' },
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(
      `Could not authenticate with the provided security token (${response.status}).`
    );
  }

  const body = await response.json();

  if (!body.authToken) {
    throw new Error('Authentication response did not include authToken.');
  }

  return body.authToken;
}

async function promptHidden(query) {
  if (!process.stdin.isTTY) {
    throw new Error(
      'No interactive terminal is available. Set GHOSTFOLIO_ACCESS_TOKEN or GHOSTFOLIO_AUTH_TOKEN temporarily and try again.'
    );
  }

  const mutableStdout = new Writable({
    write(chunk, encoding, callback) {
      if (!this.muted) {
        process.stdout.write(chunk, encoding);
      }
      callback();
    }
  });

  mutableStdout.muted = false;

  const rl = readline.createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true
  });

  return await new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer.trim());
    });
    mutableStdout.muted = true;
  });
}

export async function apiRequest({
  authToken,
  baseUrl = getBaseUrl(),
  body,
  method = 'GET',
  path: apiPath
}) {
  const headers = {
    accept: 'application/json',
    authorization: `Bearer ${authToken}`
  };

  if (body !== undefined) {
    headers['content-type'] = 'application/json';
  }

  const response = await fetch(`${baseUrl}${apiPath}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
    method
  });

  const text = await response.text();
  let data;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.message
      ? Array.isArray(data.message)
        ? data.message.join('; ')
        : data.message
      : typeof data === 'string'
        ? data
        : response.statusText;

    throw new Error(`${method} ${apiPath} failed (${response.status}): ${message}`);
  }

  return data;
}

export async function getCurrentUser({ authToken, baseUrl = getBaseUrl() }) {
  return apiRequest({ authToken, baseUrl, path: '/api/v1/user' });
}

export async function getAccounts({ authToken, baseUrl = getBaseUrl() }) {
  const response = await apiRequest({ authToken, baseUrl, path: '/api/v1/account' });

  if (Array.isArray(response)) {
    return response;
  }

  return response?.accounts ?? [];
}

export async function getActivities({ authToken, baseUrl = getBaseUrl() }) {
  const allActivities = [];
  const take = 500;
  let skip = 0;
  let count = Number.POSITIVE_INFINITY;

  while (skip < count) {
    const response = await apiRequest({
      authToken,
      baseUrl,
      path: `/api/v1/activities?take=${take}&skip=${skip}&sortColumn=date&sortDirection=asc`
    });

    const activities = response?.activities ?? [];
    count = Number.isFinite(response?.count) ? response.count : activities.length;
    allActivities.push(...activities);

    if (activities.length === 0) {
      break;
    }

    skip += activities.length;
  }

  return allActivities;
}

export function parseCsvFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(text);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim());

  return rows.slice(1).map((row, index) => {
    const item = {};

    headers.forEach((header, headerIndex) => {
      item[header] = row[headerIndex] ?? '';
    });

    return {
      item,
      rowNumber: index + 2
    };
  });
}

function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((value) => value.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  currentRow.push(currentValue);
  if (currentRow.some((value) => value.length > 0)) {
    rows.push(currentRow);
  }

  return rows;
}

export function csvRowToActivity({ accountId, fileName, rowNumber, item }) {
  const comment = getField(item, ['Comment', 'Note']);
  const dataSource = normalizeDataSource(getField(item, ['DataSource']));
  const marker = `${DEMO_MARKER} file=${fileName} row=${rowNumber}`;
  const symbol = normalizeSymbolForGhostfolio({
    dataSource,
    symbol: getRequiredField(item, ['Code', 'Symbol', 'Ticker'])
  });

  return {
    accountId,
    comment: comment ? `${marker}; ${comment}` : marker,
    currency: getRequiredField(item, ['Currency', 'CCY', 'CurrencyPrimary']),
    dataSource,
    date: parseDate(getRequiredField(item, ['Date', 'TradeDate'])),
    fee: Math.abs(parseNumber(getRequiredField(item, ['Fee', 'Commission', 'IBCommission']))),
    quantity: Math.abs(parseNumber(getRequiredField(item, ['Quantity', 'Qty', 'Shares', 'Units']))),
    symbol,
    type: parseActivityType(getRequiredField(item, ['Action', 'Buy/Sell', 'Type'])),
    unitPrice: Math.abs(parseNumber(getRequiredField(item, ['Price', 'TradePrice', 'UnitPrice', 'Value']))),
    updateAccountBalance: false
  };
}

function getField(item, keys) {
  const normalized = Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key.toLowerCase(), value])
  );

  for (const key of keys) {
    const value = normalized[key.toLowerCase()];
    if (value !== undefined && value !== null && value.toString().trim() !== '') {
      return value.toString().trim();
    }
  }

  return undefined;
}

function getRequiredField(item, keys) {
  const value = getField(item, keys);

  if (value === undefined) {
    throw new Error(`Missing required CSV field: ${keys.join(' / ')}`);
  }

  return value;
}

function normalizeDataSource(value) {
  return value ? value.toUpperCase() : undefined;
}

function normalizeSymbolForGhostfolio({ dataSource, symbol }) {
  const normalizedSymbol = symbol.toUpperCase();

  if (dataSource === 'YAHOO' && YAHOO_CRYPTO_SYMBOLS.has(normalizedSymbol)) {
    return YAHOO_CRYPTO_SYMBOLS.get(normalizedSymbol);
  }

  return symbol;
}

function parseActivityType(value) {
  switch (value.toString().trim().toLowerCase()) {
    case 'buy':
      return 'BUY';
    case 'dividend':
      return 'DIVIDEND';
    case 'fee':
      return 'FEE';
    case 'interest':
      return 'INTEREST';
    case 'liability':
      return 'LIABILITY';
    case 'sell':
      return 'SELL';
    default:
      throw new Error(`Unsupported activity type: ${value}`);
  }
}

function parseDate(value) {
  const text = value.toString().trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return `${text}T00:00:00.000Z`;
  }

  if (/^\d{8}$/.test(text)) {
    return `${text.slice(0, 4)}-${text.slice(4, 6)}-${text.slice(6, 8)}T00:00:00.000Z`;
  }

  const slashMatch = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`;
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date.toISOString();
}

function parseNumber(value) {
  const number = Number(value.toString().replace(',', '.'));

  if (!Number.isFinite(number)) {
    throw new Error(`Invalid number: ${value}`);
  }

  return number;
}

export function activityRowKey({ fileName, rowNumber }) {
  return `${fileName}#${rowNumber}`;
}

export function extractActivityRowKey(activity) {
  const comment = activity.comment ?? '';
  const match = comment.match(/WORKSHOP_DEMO_DATA file=([^ ]+) row=(\d+)/);

  return match ? `${match[1]}#${match[2]}` : undefined;
}

export function activityTupleKey(activity) {
  const symbol =
    activity.symbol ??
    activity.SymbolProfile?.symbol ??
    activity.symbolProfile?.symbol ??
    '';
  const date = new Date(activity.date).toISOString().slice(0, 10);

  return [
    activity.accountId ?? '',
    date,
    symbol,
    activity.type,
    Number(activity.quantity),
    Number(activity.unitPrice),
    Number(activity.fee)
  ].join('|');
}
