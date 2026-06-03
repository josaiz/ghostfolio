#!/usr/bin/env node
// Cross-platform smoke test for the Ghostfolio demo-data MCP server.
//
// Spawns the server, runs a full MCP handshake (initialize -> initialized ->
// tools/list -> tools/call) over stdio, and asserts the responses.
// Exit code 0 = PASS, 1 = FAIL. Used by scripts/check-demo-mcp.sh|.ps1.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(HERE, 'index.mjs');

const REQUESTS = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke-test', version: '1.0.0' } } },
  { jsonrpc: '2.0', method: 'notifications/initialized' },
  { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_demo_portfolio_summary', arguments: {} } },
  { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'detect_demo_anomalies', arguments: { source: 'anomalies' } } },
  { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'list_demo_accounts', arguments: {} } }
];

const REQUIRED_TOOLS = [
  'list_demo_accounts',
  'get_demo_portfolio_summary',
  'list_demo_activities',
  'detect_demo_anomalies'
];

const checks = [];
function check(label, condition, detail = '') {
  checks.push({ label, ok: !!condition, detail });
}

function parseToolJson(response) {
  return JSON.parse(response.result.content[0].text);
}

function run() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SERVER], { stdio: ['pipe', 'pipe', 'inherit'] });
    const responses = new Map();
    let buffer = '';

    const timer = setTimeout(() => {
      child.kill();
      resolve(responses);
    }, 10000);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      let index;
      while ((index = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, index).trim();
        buffer = buffer.slice(index + 1);
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id !== undefined && msg.id !== null) responses.set(msg.id, msg);
        } catch {
          /* ignore non-JSON */
        }
        if (responses.size >= 5) {
          clearTimeout(timer);
          child.stdin.end();
          child.kill();
          resolve(responses);
        }
      }
    });

    child.on('error', () => {
      clearTimeout(timer);
      resolve(responses);
    });

    for (const request of REQUESTS) {
      child.stdin.write(`${JSON.stringify(request)}\n`);
    }
  });
}

const responses = await run();

// initialize
const init = responses.get(1);
check('initialize responde con serverInfo', init?.result?.serverInfo?.name === 'ghostfolio-demo-data',
  init ? JSON.stringify(init.result?.serverInfo) : 'sin respuesta');

// tools/list
const toolsList = responses.get(2);
const toolNames = (toolsList?.result?.tools || []).map((t) => t.name);
check('tools/list devuelve las tools requeridas',
  REQUIRED_TOOLS.every((name) => toolNames.includes(name)),
  `tools: ${toolNames.join(', ')}`);

// portfolio summary
let summary;
try {
  summary = parseToolJson(responses.get(3));
} catch {
  summary = null;
}
check('get_demo_portfolio_summary: 3 cuentas', summary?.totals?.accounts === 3,
  summary ? `accounts=${summary.totals?.accounts}` : 'sin respuesta');
check('get_demo_portfolio_summary: 54 actividades', summary?.totals?.activities === 54,
  summary ? `activities=${summary.totals?.activities}` : '');
check('get_demo_portfolio_summary: incluye Trade Republic Growth',
  !!summary?.accounts?.some((a) => a.name === 'Trade Republic Growth'));

// anomalies
let anomalies;
try {
  anomalies = parseToolJson(responses.get(4));
} catch {
  anomalies = null;
}
const expectedTypes = ['exact-duplicate', 'high-fee', 'currency-mismatch', 'price-outlier', 'oversell-risk'];
check('detect_demo_anomalies: detecta los 5 tipos esperados',
  anomalies && expectedTypes.every((t) => (anomalies.byType || {})[t] >= 1),
  anomalies ? JSON.stringify(anomalies.byType) : 'sin respuesta');

// accounts
let accounts;
try {
  accounts = parseToolJson(responses.get(5));
} catch {
  accounts = null;
}
check('list_demo_accounts: 3 cuentas', accounts?.accountCount === 3,
  accounts ? `accountCount=${accounts.accountCount}` : 'sin respuesta');

// Report
let failed = 0;
for (const c of checks) {
  const mark = c.ok ? 'PASS' : 'FAIL';
  if (!c.ok) failed += 1;
  process.stdout.write(`[${mark}] ${c.label}${c.detail ? ` — ${c.detail}` : ''}\n`);
}

if (failed === 0) {
  process.stdout.write(`\n✅ MCP ghostfolio-demo-data OK (${checks.length} comprobaciones).\n`);
  process.exit(0);
} else {
  process.stdout.write(`\n❌ ${failed}/${checks.length} comprobaciones fallaron.\n`);
  process.exit(1);
}
