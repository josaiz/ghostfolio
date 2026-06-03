# Artefactos generados por los commands del workshop

Esta carpeta recoge las salidas de los commands `/workshop-*` (mapas de arquitectura, planes de FE/BE/MCP,
insights, reviews de safety y handoffs), con nombres como:

```text
<ID>-architecture-map.md
<ID>-frontend-plan.md
<ID>-backend-plan.md
<ID>-mcp-plan.md
<ID>-portfolio-insights.md
<ID>-safety-review.md
<ID>-slice.md
<ID>-handoff.md
demo-runbook.md
```

Son artefactos de trabajo de cada equipo durante la sesión: puedes vaciarla entre sesiones sin afectar a la solución.

## Ejemplos pre-cargados (muestra para los equipos)

Estos tres ficheros vienen ya generados como **ejemplo** de qué produce cada command. Puedes estudiarlos,
sobrescribirlos o borrarlos:

- `FE-01-frontend-plan.md` — salida de `/workshop-plan-frontend-card FE-01` (plan del widget Portfolio Insights).
- `INT-01-portfolio-insights.md` — salida de `/workshop-analyze-demo-portfolio` (insights con cifras reales del MCP).
- `INT-01-safety-review.md` — salida de `/workshop-review-financial-safety` sobre el insight anterior (veredicto PASS).

Juntos demuestran el ciclo: planificar → analizar datos del MCP → revisar safety.
