#!/usr/bin/env node
// Ghostfolio demo-data MCP server (zero-dependency, stdio JSON-RPC 2.0).
//
// Read-only access to the workshop demo dataset for OpenCode agents.
// Protocol: Model Context Protocol over stdio.
//   - Messages are newline-delimited JSON, no embedded newlines, UTF-8.
//   - stdout carries ONLY valid MCP messages. Logs go to stderr.
// See docs/workshop/reference-implementation.md and skill mcp-server-authoring.

import {
  DISCLAIMER,
  detectAnomalies,
  getAccountSummary,
  getPortfolioSummary,
  getRecentActivities,
  getSymbolExposure,
  listAccounts,
  listActivities
} from './data.mjs';

const SERVER_INFO = { name: 'ghostfolio-demo-data', version: '1.0.0' };
const DEFAULT_PROTOCOL_VERSION = '2025-06-18';

// ---------------------------------------------------------------------------
// Tool catalogue (name + description + JSON Schema inputSchema)
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    name: 'list_demo_accounts',
    description:
      'Lista las cuentas del portfolio demo con sus divisas, nº de símbolos y nº de actividades. Read-only.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    handler: () => listAccounts()
  },
  {
    name: 'get_demo_portfolio_summary',
    description:
      'Resumen determinista del portfolio demo: totales, holdings por cuenta, coste invertido y concentración (cuota de coste por símbolo dentro de cada cuenta). Read-only, sin asesoramiento.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    handler: () => getPortfolioSummary()
  },
  {
    name: 'list_demo_activities',
    description:
      'Lista actividades del dataset demo, opcionalmente filtradas por cuenta, símbolo o tipo (BUY/SELL/DIVIDEND/...). Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        account: { type: 'string', description: 'Nombre de cuenta (exacto).' },
        symbol: { type: 'string', description: 'Símbolo, p. ej. NVDA o VWCE.DE.' },
        type: { type: 'string', description: 'Tipo de actividad: BUY, SELL, DIVIDEND, FEE, ...' },
        limit: { type: 'integer', minimum: 1, description: 'Máximo de filas a devolver.' }
      },
      additionalProperties: false
    },
    handler: (args) => listActivities(args || {})
  },
  {
    name: 'detect_demo_anomalies',
    description:
      'Detecta anomalías simples (duplicados, comisión alta, divisa inesperada, precio atípico, sobreventa) de forma determinista. Por defecto analiza el CSV de anomalías. Read-only.',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          enum: ['anomalies', 'main', 'both'],
          description: 'Fuente a analizar. Por defecto "anomalies".'
        }
      },
      additionalProperties: false
    },
    handler: (args) => detectAnomalies((args && args.source) || 'anomalies')
  },
  {
    name: 'get_account_summary',
    description: 'Resumen de una sola cuenta demo por nombre (holdings, coste y concentración). Read-only.',
    inputSchema: {
      type: 'object',
      properties: { account: { type: 'string', description: 'Nombre de la cuenta.' } },
      required: ['account'],
      additionalProperties: false
    },
    handler: (args) => getAccountSummary(args && args.account)
  },
  {
    name: 'get_symbol_exposure',
    description:
      'Exposición por símbolo en todo el portfolio demo (coste nominal y cuentas que lo contienen). Opcionalmente para un símbolo concreto. Read-only.',
    inputSchema: {
      type: 'object',
      properties: { symbol: { type: 'string', description: 'Símbolo opcional para filtrar.' } },
      additionalProperties: false
    },
    handler: (args) => getSymbolExposure(args && args.symbol)
  },
  {
    name: 'get_recent_activities',
    description: 'Devuelve las N actividades demo más recientes por fecha. Read-only.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, description: 'Cuántas devolver (def. 10).' } },
      additionalProperties: false
    },
    handler: (args) => getRecentActivities((args && args.limit) || 10)
  }
];

const TOOLS_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

const PUBLIC_TOOLS = TOOLS.map(({ name, description, inputSchema }) => ({
  name,
  description,
  inputSchema
}));

// ---------------------------------------------------------------------------
// JSON-RPC plumbing
// ---------------------------------------------------------------------------
function log(...args) {
  // stderr only — never pollute stdout (it is reserved for MCP messages).
  process.stderr.write(`[ghostfolio-demo-data] ${args.join(' ')}\n`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function sendError(id, code, message, data) {
  send({ jsonrpc: '2.0', id, error: data === undefined ? { code, message } : { code, message, data } });
}

function handleToolCall(id, params) {
  const name = params && params.name;
  const tool = TOOLS_BY_NAME.get(name);

  if (!tool) {
    sendError(id, -32602, `Unknown tool: ${name}`);
    return;
  }

  try {
    const result = tool.handler(params.arguments || {});
    sendResult(id, {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    });
  } catch (error) {
    // Tool execution error reported in-band (isError), per MCP spec.
    sendResult(id, {
      content: [{ type: 'text', text: `Error en ${name}: ${error.message}` }],
      isError: true
    });
    log('tool error', name, error.message);
  }
}

function handleMessage(message) {
  // Notifications have no id and never get a response.
  const isRequest = Object.prototype.hasOwnProperty.call(message, 'id') && message.id !== null;
  const { id, method, params } = message;

  switch (method) {
    case 'initialize': {
      const requested = params && params.protocolVersion;
      sendResult(id, {
        protocolVersion: typeof requested === 'string' ? requested : DEFAULT_PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions:
          'Datos demo de Ghostfolio en modo solo lectura. Las cifras son descriptivas y educativas; ' +
          'no constituyen asesoramiento financiero. ' +
          DISCLAIMER
      });
      return;
    }

    case 'notifications/initialized':
    case 'initialized':
      // Client signalled readiness. Nothing to answer.
      return;

    case 'ping':
      if (isRequest) sendResult(id, {});
      return;

    case 'tools/list':
      if (isRequest) sendResult(id, { tools: PUBLIC_TOOLS });
      return;

    case 'tools/call':
      if (isRequest) handleToolCall(id, params || {});
      return;

    default:
      if (isRequest) {
        sendError(id, -32601, `Method not found: ${method}`);
      } else {
        log('ignoring notification', method);
      }
  }
}

// ---------------------------------------------------------------------------
// stdin reader: newline-delimited JSON messages
// ---------------------------------------------------------------------------
let buffer = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  buffer += chunk;

  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;

    let message;
    try {
      message = JSON.parse(line);
    } catch {
      sendError(null, -32700, 'Parse error');
      continue;
    }

    const messages = Array.isArray(message) ? message : [message];
    for (const item of messages) {
      try {
        handleMessage(item);
      } catch (error) {
        log('handler crash', error.message);
        if (item && item.id !== undefined && item.id !== null) {
          sendError(item.id, -32603, `Internal error: ${error.message}`);
        }
      }
    }
  }
});

process.stdin.on('end', () => process.exit(0));

log(`ready — ${TOOLS.length} read-only tools (${PUBLIC_TOOLS.map((t) => t.name).join(', ')})`);
