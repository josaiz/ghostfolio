---
description: Genera/recuerda el runbook para demostrar la happy path del workshop de extremo a extremo (INT-01).
agent: workshop-facilitator-agent
---

Prepara el runbook de demo para: **$ARGUMENTS** (si va vacío, la happy path por defecto "Portfolio Insights Demo").

Runbook de referencia de la solución:
@docs/workshop/solution-runbook.md

Trabaja así:
1. Resume los pasos **exactos y verificables** para demostrar el ciclo completo:
   - Arrancar Ghostfolio (`./scripts/start.sh` / `.\scripts\start.ps1`) y, si hace falta, sembrar datos demo.
   - Arrancar/verificar el MCP demo (`./scripts/check-demo-mcp.sh` / `.\scripts\check-demo-mcp.ps1`).
   - Comprobar que OpenCode ve commands/agents/skills/MCP.
   - Ejecutar `/workshop-analyze-demo-portfolio` y mostrar los insights.
   - Pasar el resultado por `/workshop-review-financial-safety`.
   - (Opcional) mostrar un plan generado por `/workshop-plan-frontend-card FE-01`.
2. Indica el orden, el comando exacto, y qué se debe ver en cada paso (criterio de éxito).
3. Señala los fallbacks si algo no arranca (ver `facilitator-guide.md`).

Salida: un runbook claro en markdown, listo para proyectar. Guárdalo en `docs/workshop/generated/demo-runbook.md` si se pide.
