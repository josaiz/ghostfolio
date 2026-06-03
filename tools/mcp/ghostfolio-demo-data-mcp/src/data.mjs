// Read-only data layer for the Ghostfolio demo-data MCP.
//
// Source of truth: the workshop CSV dataset in data/workshop/import/.
// We REUSE the existing, battle-tested CSV parser from tools/workshop/lib/workshop-data.mjs
// instead of duplicating it (see skill: mcp-server-authoring).
//
// Everything here is strictly read-only: no writes, no deletes, no DB access.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseCsvFile } from '../../../workshop/lib/workshop-data.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../../..');
const IMPORT_DIR = path.join(REPO_ROOT, 'data', 'workshop', 'import');

const MAIN_FILE = 'ghostfolio-workshop-main.csv';
const ANOMALIES_FILE = 'ghostfolio-workshop-anomalies-do-not-import-main.csv';

export const DISCLAIMER =
  'Synthetic workshop data. Descriptive and educational information, not financial advice.';

// ---------------------------------------------------------------------------
// Small numeric helpers
// ---------------------------------------------------------------------------
const round1 = (n) => Math.round(n * 10) / 10;
const round2 = (n) => Math.round(n * 100) / 100;
const round4 = (n) => Math.round(n * 10000) / 10000;

function toNumber(value) {
  const n = Number(String(value ?? '').trim().replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function countBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const key = keyFn(item);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

// ---------------------------------------------------------------------------
// CSV loading (cached, read-only)
// ---------------------------------------------------------------------------
const cache = new Map();

function normalizeRow({ item, rowNumber }) {
  return {
    rowNumber,
    date: String(item.Date ?? '').trim(),
    symbol: String(item.Code ?? '').trim().toUpperCase(),
    name: String(item.Name ?? '').trim(),
    type: String(item.Action ?? '').trim().toUpperCase(),
    currency: String(item.Currency ?? '').trim().toUpperCase(),
    unitPrice: toNumber(item.Price),
    quantity: toNumber(item.Quantity),
    fee: toNumber(item.Fee),
    dataSource: String(item.DataSource ?? '').trim().toUpperCase(),
    account: String(item.Account ?? '').trim(),
    comment: String(item.Comment ?? '').trim()
  };
}

function loadCsv(fileName) {
  if (cache.has(fileName)) {
    return cache.get(fileName);
  }

  const filePath = path.join(IMPORT_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Demo dataset not found: ${path.relative(REPO_ROOT, filePath)}. ` +
        'Make sure data/workshop/import/ contains the workshop CSV files.'
    );
  }

  const rows = parseCsvFile(filePath).map(normalizeRow);
  cache.set(fileName, rows);
  return rows;
}

export function loadActivities() {
  return loadCsv(MAIN_FILE);
}

export function loadAnomalyActivities() {
  return loadCsv(ANOMALIES_FILE);
}

// ---------------------------------------------------------------------------
// Derived views (all read-only / pure)
// ---------------------------------------------------------------------------

// Net holding per account + symbol, plus nominal invested cost.
// investedCost = Σ(BUY qty·price) − Σ(SELL qty·price). DIVIDEND/FEE/etc. ignored for cost.
function buildHoldings(activities) {
  const map = new Map();

  for (const a of activities) {
    const key = `${a.account}|${a.symbol}`;

    if (!map.has(key)) {
      map.set(key, {
        account: a.account,
        symbol: a.symbol,
        name: a.name,
        currency: a.currency,
        netQuantity: 0,
        investedCost: 0
      });
    }

    const h = map.get(key);

    if (a.type === 'BUY') {
      h.netQuantity += a.quantity;
      h.investedCost += a.quantity * a.unitPrice;
    } else if (a.type === 'SELL') {
      h.netQuantity -= a.quantity;
      h.investedCost -= a.quantity * a.unitPrice;
    }
  }

  return [...map.values()];
}

export function listAccounts() {
  const activities = loadActivities();
  const byAccount = new Map();

  for (const a of activities) {
    if (!byAccount.has(a.account)) {
      byAccount.set(a.account, {
        name: a.account,
        currencies: new Set(),
        symbols: new Set(),
        activityCount: 0,
        firstActivity: a.date,
        lastActivity: a.date
      });
    }

    const acc = byAccount.get(a.account);
    acc.currencies.add(a.currency);
    acc.symbols.add(a.symbol);
    acc.activityCount += 1;
    if (a.date && a.date < acc.firstActivity) acc.firstActivity = a.date;
    if (a.date && a.date > acc.lastActivity) acc.lastActivity = a.date;
  }

  const accounts = [...byAccount.values()].map((acc) => ({
    name: acc.name,
    currencies: [...acc.currencies].sort(),
    symbolCount: acc.symbols.size,
    activityCount: acc.activityCount,
    firstActivity: acc.firstActivity,
    lastActivity: acc.lastActivity
  }));

  return { disclaimer: DISCLAIMER, accountCount: accounts.length, accounts };
}

export function getPortfolioSummary() {
  const activities = loadActivities();
  const holdings = buildHoldings(activities);
  const { accounts } = listAccounts();

  const holdingsByAccount = new Map();
  for (const h of holdings) {
    if (!holdingsByAccount.has(h.account)) holdingsByAccount.set(h.account, []);
    holdingsByAccount.get(h.account).push(h);
  }

  const accountSummaries = accounts.map((acc) => {
    const hs = (holdingsByAccount.get(acc.name) || []).filter(
      (h) => Math.abs(h.investedCost) > 0.009
    );
    const totalCost = hs.reduce((sum, h) => sum + Math.max(h.investedCost, 0), 0);

    const holdingsView = hs
      .map((h) => ({
        symbol: h.symbol,
        name: h.name,
        currency: h.currency,
        netQuantity: round4(h.netQuantity),
        investedCostNominal: round2(h.investedCost),
        costSharePct: totalCost > 0 ? round1((Math.max(h.investedCost, 0) / totalCost) * 100) : 0
      }))
      .sort((a, b) => b.investedCostNominal - a.investedCostNominal);

    const investedByCurrency = {};
    for (const h of hs) {
      investedByCurrency[h.currency] = round2(
        (investedByCurrency[h.currency] || 0) + Math.max(h.investedCost, 0)
      );
    }

    const top = holdingsView[0] || null;

    return {
      name: acc.name,
      currencies: acc.currencies,
      activityCount: acc.activityCount,
      symbolCount: holdingsView.length,
      totalInvestedCostNominal: round2(totalCost),
      investedByCurrency,
      topConcentration: top ? { symbol: top.symbol, costSharePct: top.costSharePct } : null,
      holdings: holdingsView
    };
  });

  return {
    generatedFrom: `data/workshop/import/${MAIN_FILE}`,
    disclaimer: DISCLAIMER,
    concentrationNote:
      'Nominal cost share within each account; no currency conversion or current market value.',
    totals: {
      accounts: accounts.length,
      activities: activities.length,
      symbols: new Set(holdings.map((h) => h.symbol)).size
    },
    accounts: accountSummaries
  };
}

export function getAccountSummary(accountName) {
  const summary = getPortfolioSummary();
  const found = summary.accounts.find(
    (a) => a.name.toLowerCase() === String(accountName ?? '').toLowerCase()
  );

  if (!found) {
    return {
      error: `Account not found: ${accountName}`,
      availableAccounts: summary.accounts.map((a) => a.name)
    };
  }

  return { disclaimer: DISCLAIMER, concentrationNote: summary.concentrationNote, account: found };
}

export function getSymbolExposure(symbol) {
  const holdings = buildHoldings(loadActivities());
  const bySymbol = new Map();

  for (const h of holdings) {
    if (!bySymbol.has(h.symbol)) {
      bySymbol.set(h.symbol, {
        symbol: h.symbol,
        name: h.name,
        currency: h.currency,
        investedCostNominal: 0,
        netQuantity: 0,
        accounts: new Set()
      });
    }

    const s = bySymbol.get(h.symbol);
    s.investedCostNominal += Math.max(h.investedCost, 0);
    s.netQuantity += h.netQuantity;
    s.accounts.add(h.account);
  }

  let symbols = [...bySymbol.values()].map((s) => ({
    symbol: s.symbol,
    name: s.name,
    currency: s.currency,
    investedCostNominal: round2(s.investedCostNominal),
    netQuantity: round4(s.netQuantity),
    accounts: [...s.accounts]
  }));

  if (symbol) {
    const wanted = String(symbol).toUpperCase();
    symbols = symbols.filter((s) => s.symbol === wanted);
  }

  symbols.sort((a, b) => b.investedCostNominal - a.investedCostNominal);

  return {
    disclaimer: DISCLAIMER,
    note: 'Nominal cost without currency conversion.',
    symbolCount: symbols.length,
    symbols
  };
}

export function listActivities({ account, symbol, type, limit } = {}) {
  let activities = loadActivities();

  if (account) {
    const wanted = String(account).toLowerCase();
    activities = activities.filter((a) => a.account.toLowerCase() === wanted);
  }
  if (symbol) {
    const wanted = String(symbol).toUpperCase();
    activities = activities.filter((a) => a.symbol === wanted);
  }
  if (type) {
    const wanted = String(type).toUpperCase();
    activities = activities.filter((a) => a.type === wanted);
  }

  activities = activities
    .slice()
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.rowNumber - b.rowNumber));

  const total = activities.length;
  const lim = Number.isFinite(+limit) && +limit > 0 ? Math.floor(+limit) : total;

  return {
    disclaimer: DISCLAIMER,
    total,
    returned: Math.min(lim, total),
    filters: { account: account ?? null, symbol: symbol ?? null, type: type ?? null },
    activities: activities.slice(0, lim)
  };
}

export function getRecentActivities(limit = 10) {
  const activities = loadActivities()
    .slice()
    .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : b.rowNumber - a.rowNumber));

  const lim = Number.isFinite(+limit) && +limit > 0 ? Math.floor(+limit) : 10;

  return {
    disclaimer: DISCLAIMER,
    total: activities.length,
    returned: Math.min(lim, activities.length),
    activities: activities.slice(0, lim)
  };
}

// ---------------------------------------------------------------------------
// Anomaly detection
//
// Reference stats are derived from the CLEAN main dataset, then applied to the
// target source. The detectors do NOT rely on the ANOMALY= labels in the CSV;
// they re-derive each finding, so scanning the clean dataset yields ~0 findings.
// ---------------------------------------------------------------------------
function buildReference() {
  const reference = new Map();

  for (const a of loadActivities()) {
    if (a.type !== 'BUY' && a.type !== 'SELL') continue;

    if (!reference.has(a.symbol)) {
      reference.set(a.symbol, { currencies: new Map(), prices: [] });
    }

    const r = reference.get(a.symbol);
    r.currencies.set(a.currency, (r.currencies.get(a.currency) || 0) + 1);
    if (a.unitPrice > 0) r.prices.push(a.unitPrice);
  }

  const out = new Map();
  for (const [symbol, r] of reference) {
    let modalCurrency = null;
    let best = -1;
    for (const [currency, c] of r.currencies) {
      if (c > best) {
        best = c;
        modalCurrency = currency;
      }
    }

    out.set(symbol, {
      modalCurrency,
      minPrice: r.prices.length ? Math.min(...r.prices) : null,
      maxPrice: r.prices.length ? Math.max(...r.prices) : null,
      priceCount: r.prices.length
    });
  }

  return out;
}

export function detectAnomalies(source = 'anomalies') {
  const normalizedSource = ['anomalies', 'main', 'both'].includes(source) ? source : 'anomalies';
  const reference = buildReference();

  const targets = [];
  if (normalizedSource === 'main' || normalizedSource === 'both') {
    targets.push(...loadActivities().map((a) => ({ ...a, file: MAIN_FILE })));
  }
  if (normalizedSource === 'anomalies' || normalizedSource === 'both') {
    targets.push(...loadAnomalyActivities().map((a) => ({ ...a, file: ANOMALIES_FILE })));
  }

  const findings = [];

  // 1) Exact duplicates (same file, account, date, symbol, type, quantity, price)
  const groups = new Map();
  for (const a of targets) {
    const key = [a.file, a.account, a.date, a.symbol, a.type, a.quantity, a.unitPrice].join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  }
  for (const group of groups.values()) {
    if (group.length > 1) {
      findings.push({
        type: 'exact-duplicate',
        severity: 'medium',
        account: group[0].account,
        symbol: group[0].symbol,
        date: group[0].date,
        detail: `${group.length} identical activities (same symbol, date, type, quantity, and price).`,
        rows: group.map((g) => g.rowNumber)
      });
    }
  }

  // 2) Per-row detectors: high fee, currency mismatch, price outlier
  for (const a of targets) {
    const ref = reference.get(a.symbol);
    const notional = Math.abs(a.quantity * a.unitPrice);

    if ((a.type === 'BUY' || a.type === 'SELL') && notional > 0) {
      const feePct = a.fee / notional;
      if (feePct > 0.05) {
        findings.push({
          type: 'high-fee',
          severity: 'low',
          account: a.account,
          symbol: a.symbol,
          date: a.date,
          detail: `Fee ${a.fee} = ${round1(feePct * 100)}% of the notional amount (${round2(notional)} ${a.currency}).`,
          rows: [a.rowNumber]
        });
      }
    }

    if (ref && ref.modalCurrency && a.currency && a.currency !== ref.modalCurrency) {
      findings.push({
        type: 'currency-mismatch',
        severity: 'medium',
        account: a.account,
        symbol: a.symbol,
        date: a.date,
        detail: `Currency ${a.currency} differs from the usual ${ref.modalCurrency} for ${a.symbol}.`,
        rows: [a.rowNumber]
      });
    }

    if (
      ref &&
      ref.priceCount >= 2 &&
      (a.type === 'BUY' || a.type === 'SELL') &&
      a.unitPrice > 0 &&
      (a.unitPrice < ref.minPrice * 0.9 || a.unitPrice > ref.maxPrice * 1.1)
    ) {
      findings.push({
        type: 'price-outlier',
        severity: 'medium',
        account: a.account,
        symbol: a.symbol,
        date: a.date,
        detail: `Price ${a.unitPrice} ${a.currency} is outside the reference range [${round2(ref.minPrice)}, ${round2(ref.maxPrice)}] for ${a.symbol}.`,
        rows: [a.rowNumber]
      });
    }
  }

  // 3) Oversell: cumulative sells exceed cumulative buys for an account+symbol
  const byAccountSymbol = new Map();
  for (const a of targets) {
    const key = `${a.file}|${a.account}|${a.symbol}`;
    if (!byAccountSymbol.has(key)) byAccountSymbol.set(key, []);
    byAccountSymbol.get(key).push(a);
  }
  for (const list of byAccountSymbol.values()) {
    list.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.rowNumber - b.rowNumber));
    let net = 0;
    for (const a of list) {
      if (a.type === 'BUY') {
        net += a.quantity;
      } else if (a.type === 'SELL') {
        net -= a.quantity;
        if (net < -1e-9) {
          findings.push({
            type: 'oversell-risk',
            severity: 'high',
            account: a.account,
            symbol: a.symbol,
            date: a.date,
            detail: `Sale of ${a.quantity} leaves a negative net position (${round4(net)}) for ${a.symbol} in this source.`,
            rows: [a.rowNumber]
          });
        }
      }
    }
  }

  const severityRank = { high: 0, medium: 1, low: 2 };
  findings.sort(
    (p, q) => severityRank[p.severity] - severityRank[q.severity] || (p.date < q.date ? -1 : 1)
  );

  return {
    source: normalizedSource,
    disclaimer: DISCLAIMER,
    note: 'Deterministic detection based on statistics from the clean dataset. Does not use the ANOMALY= labels in the CSV.',
    scannedActivities: targets.length,
    findingCount: findings.length,
    byType: countBy(findings, (f) => f.type),
    findings
  };
}
