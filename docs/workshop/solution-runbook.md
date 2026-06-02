# Solution runbook — cómo ejecutar y enseñar la solución

Pasos exactos para arrancar, probar la happy path y demostrar la solución de referencia.

## 0. Requisitos

- Node.js ≥ 22.18.0 (`node -v`).
- Docker Desktop (solo si quieres levantar Ghostfolio; la demo por MCP no lo necesita).
- OpenCode instalado y abierto en la **raíz** del repo.

## 1. Comprobar que OpenCode detecta los componentes

Con OpenCode abierto en la raíz:
- **Commands**: escribe `/workshop-` y deben aparecer los 9 commands.
- **Agents**: deben listarse los 8 agentes (`ghostfolio-architect`, `frontend-angular-agent`, ...).
- **Skills**: disponibles las 8 skills de `.opencode/skills/` (+ las genéricas `angular-developer`, `nestjs-best-practices`).
- **MCP**: el servidor `ghostfolio-demo-data` debe aparecer conectado con sus 7 tools.

Si algo no aparece: confirma que estás en la raíz, que existen las carpetas plural (`agents/`, `commands/`, `skills/`)
y reinicia OpenCode tras cambios en `opencode.json`.

## 2. Verificar el MCP (sin Ghostfolio)

```bash
# Mac/Linux
./scripts/check-demo-mcp.sh
# Windows
.\scripts\check-demo-mcp.ps1
```
Esperado: 7 comprobaciones en verde, `✅ MCP ghostfolio-demo-data OK`.

## 3. (Opcional) Arrancar Ghostfolio y datos demo

```bash
./scripts/start.sh                 # http://localhost:3333   (Windows: .\scripts\start.ps1)
./scripts/check.sh
# crear admin desde la UI, copiar su security token, y luego:
./scripts/seed-workshop-data.sh    # Windows: .\scripts\seed-workshop-data.ps1
```

## 4. Ejecutar los commands principales

```text
/workshop-inspect-architecture portfolio insights
/workshop-analyze-demo-portfolio
/workshop-review-financial-safety docs/workshop/generated/INT-01-portfolio-insights.md
/workshop-plan-frontend-card FE-01
/workshop-plan-backend-card BE-01
/workshop-plan-mcp-card MCP-02
/workshop-prepare-team-handoff INT-01
/workshop-demo-runbook
```
Las salidas que generes se guardan en `docs/workshop/generated/`.

## 5. Happy path de demo (Portfolio Insights Demo)

1. `./scripts/check-demo-mcp.sh` → verde.
2. En OpenCode: `/workshop-analyze-demo-portfolio`.
   - Debe mostrar 3 cuentas, 54 actividades y la concentración por cuenta con cifras del MCP, p. ej.:
     - *Trade Republic Growth*: AAPL 26.2%, MSFT 21.8%, NVDA 19.7% (top-3 67.7%).
     - *Crypto Exchange*: BTC 60.8%, ETH 39.2%.
   - Y anomalías: 5 tipos en el sandbox (`exact-duplicate`, `high-fee`, `currency-mismatch`, `price-outlier`, `oversell-risk`).
3. `/workshop-review-financial-safety` sobre ese resultado → **PASS** (texto descriptivo, sin consejo).
4. (Opcional) `/workshop-plan-frontend-card FE-01` para enseñar cómo se planificaría el widget.

Criterio de éxito de la demo: el ciclo **datos demo → MCP → análisis → insights → safety** corre de principio a fin,
es reproducible y no recomienda comprar/vender.

## 6. Llamada directa al MCP (para enseñar el protocolo)

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"cli","version":"1.0.0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_account_summary","arguments":{"account":"Trade Republic Growth"}}}' \
  | node tools/mcp/ghostfolio-demo-data-mcp/src/index.mjs 2>/dev/null
```

## 7. Enseñar la solución final

- Recorre la `agentic-solution-architecture.md` (diagrama tarea→componentes).
- Muestra cómo una tarjeta (p. ej. FE-01) baja por command → agent → skill → (MCP) → plan → safety → handoff.
- Cierra con la `pedagogical-matrix.md`: por qué cada equipo hizo algo distinto y todo encaja en el mismo epic.

## 8. Reset / limpieza

- Datos demo: `./scripts/reset-workshop-data.sh` (solo borra actividades marcadas `WORKSHOP_DEMO_DATA`).
- Entorno Docker: `./scripts/reset.sh` (borra contenedores/volúmenes locales). **No** ejecutes en medio de la sesión.
- Artefactos generados: puedes vaciar `docs/workshop/generated/` (no afecta a la solución).
