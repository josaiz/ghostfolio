# Implementación de referencia — Portfolio Insights Demo

Qué se implementó de verdad en la rama de soluciones, qué se dejó fuera a propósito, y cómo probarlo.

## Opción elegida y por qué

Entre las tres opciones planteadas (backend-only, backend+frontend, MCP-only), la rama de soluciones implementa la
**Opción 3: MCP-only + command + documentación**, como happy path funcional de referencia.

**Por qué es la más robusta y menos invasiva:**
- **No toca código funcional de Ghostfolio** (`apps/api`, `apps/client`, `prisma/`), así que **no puede romper** el
  build ni el arranque local con Docker.
- Es **read-only** sobre datos demo en CSV → reproducible y estable en Mac/Windows.
- Aun así demuestra el ciclo agéntico completo de extremo a extremo, porque el MCP **es** tooling de producto real
  (datos del portfolio expuestos a los agentes de forma gobernada).

Las tarjetas de **frontend (FE-*)** y **backend (BE-*)** se entregan como **planes técnicos** generados por los
commands de planificación (`/workshop-plan-frontend-card`, `/workshop-plan-backend-card`). Esto es coherente con la
filosofía del workshop ("investigación y planificación primero") y mantiene el build intacto. Un equipo que quiera
puede implementar su plan como cambio mínimo, delegando en el agente especialista y tras revisión humana.

## Qué se implementó

1. **MCP local read-only `ghostfolio-demo-data`** (`tools/mcp/ghostfolio-demo-data-mcp/`):
   - Servidor stdio JSON-RPC 2.0 **sin dependencias** (`src/index.mjs`).
   - Capa de datos read-only (`src/data.mjs`) que **reutiliza** el parser CSV de `tools/workshop/lib/workshop-data.mjs`.
   - 7 tools: `list_demo_accounts`, `get_demo_portfolio_summary`, `list_demo_activities`, `detect_demo_anomalies`,
     `get_account_summary`, `get_symbol_exposure`, `get_recent_activities`.
   - Smoke test (`src/smoke-test.mjs`) que valida el handshake y los datos.
2. **Registro en `opencode.json`** del MCP como servidor local.
3. **Command `/workshop-analyze-demo-portfolio`** + agente `portfolio-domain-agent` que consumen el MCP para producir
   insights descriptivos.
4. **Gate de safety**: command `/workshop-review-financial-safety` + agente `financial-safety-reviewer` + skill.
5. **Scripts** `scripts/start-demo-mcp.*` y `scripts/check-demo-mcp.*` (Mac/Windows).
6. Toda la **documentación** del workshop en `docs/workshop/`.

### Insights deterministas que produce el MCP (cifras reales del dataset)

- **Concentración por cuenta** (cuota de coste nominal por símbolo dentro de la cuenta):
  - *Trade Republic Growth*: AAPL 26.2%, MSFT 21.8%, NVDA 19.7%, ASML.AS 14.8%, GOOGL 12.4%, AMZN 5.1% (top-3 = 67.7%).
  - *Crypto Exchange*: BTC 60.8%, ETH 39.2%.
  - *MyInvestor Core ETF*: VWCE.DE 39.5% y una distribución más diversificada (S&P500, EM, bonos, Europa, small cap).
- **Anomalías** (sobre el CSV de anomalías, detección determinista, no usa las etiquetas): 5 hallazgos →
  `exact-duplicate`, `high-fee`, `currency-mismatch`, `price-outlier`, `oversell-risk`. Sobre el dataset limpio: ~0.

## Qué se dejó fuera (a propósito)

- **Ningún LLM real**: los insights son cálculos deterministas. El epic se llama "Assistant" pero en esta fase no hay
  generación con modelo. (Ghostfolio ya trae un `endpoints/ai/` propio; no lo tocamos.)
- **Sin cambios en `apps/`**: no se añadió endpoint ni componente real (se entregan como planes).
- **Sin acceso a PostgreSQL** desde el MCP: la fuente es CSV (más reproducible). Documentado como limitación.
- **Sin conversión de divisas ni precios de mercado actuales**: trabajamos con "coste invertido nominal".

## Cómo probarlo

### 1. MCP aislado (no requiere Ghostfolio arrancado)

```bash
# Mac/Linux
./scripts/check-demo-mcp.sh
# Windows
.\scripts\check-demo-mcp.ps1
```
Esperado: 7 comprobaciones en verde y `✅ MCP ghostfolio-demo-data OK`.

Llamada manual a una tool:
```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"cli","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"detect_demo_anomalies","arguments":{"source":"anomalies"}}}' \
  | node tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs 2>/dev/null
```

### 2. Ciclo completo en OpenCode (happy path)

1. (Opcional) Arranca Ghostfolio y siembra datos: `./scripts/start.sh` + `./scripts/seed-workshop-data.sh`.
   *Nota:* el MCP lee CSV, así que la demo de insights funciona aunque Ghostfolio no esté levantado.
2. Abre OpenCode en la raíz del repo. Debe detectar el MCP `ghostfolio-demo-data` y los commands `/workshop-*`.
3. Ejecuta `/workshop-analyze-demo-portfolio` → resumen con las cifras de arriba.
4. Ejecuta `/workshop-review-financial-safety docs/workshop/generated/INT-01-portfolio-insights.md`
   (o pega el texto) → veredicto PASS.

Ver pasos detallados en `solution-runbook.md`.

## Mapa de ficheros de la implementación

```text
opencode.json                                   # registra el MCP + instructions
tools/mcp/ghostfolio-demo-data-mcp/
  package.json                                  # zero dependencies
  README.md
  src/index.mjs                                 # servidor stdio JSON-RPC
  src/data.mjs                                  # capa de datos read-only (reusa workshop-data.mjs)
  src/smoke-test.mjs                            # verificación end-to-end
scripts/start-demo-mcp.sh|.ps1
scripts/check-demo-mcp.sh|.ps1
.opencode/commands/workshop-analyze-demo-portfolio.md
.opencode/commands/workshop-review-financial-safety.md
.opencode/agents/portfolio-domain-agent.md
.opencode/agents/financial-safety-reviewer.md
.opencode/skills/ghostfolio-domain-analysis/SKILL.md
.opencode/skills/financial-safety-review/SKILL.md
```

## Seguridad

No se modificó `.env`, `prisma/schema.prisma`, `docker/` ni `nx.json`. No se tocaron datos reales. El MCP es
estrictamente read-only. Ningún output recomienda comprar/vender ni predice precios.
