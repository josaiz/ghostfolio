---
description: Investiga la arquitectura real de Ghostfolio para una tarjeta o tema y produce un mapa técnico accionable (FND-01).
agent: ghostfolio-architect
subtask: true
---

Investiga la arquitectura de Ghostfolio relevante para: **$ARGUMENTS**

Backlog de referencia (busca la tarjeta si se te pasa un ID como `FE-01`):
@docs/workshop/whiteboard-backlog.md

Trabaja así:
1. Carga la skill `ghostfolio-domain-analysis` si el tema toca portfolio/cuentas/actividades/insights.
2. Confirma rutas reales con `grep`/`glob`/`read`. No inventes ficheros: si no lo has visto, búscalo.
3. Entrega un **mapa técnico** con esta estructura:
   - **Objetivo funcional** (en una frase)
   - **Ficheros reales implicados** (rutas verificadas)
   - **Contratos de datos** (interfaces/DTO/endpoints)
   - **Patrón análogo a seguir** (módulo/componente existente que copiar)
   - **Riesgos y zonas a no tocar**
   - **Command siguiente recomendado** (`/workshop-plan-frontend-card`, `-backend-card` o `-mcp-card`)

Salida esperada: un mapa en markdown. Si te dan un ID de tarjeta, guárdalo en
`docs/workshop/generated/<ID>-architecture-map.md`. No edites código funcional. Read-only.
