---
name: workshop-task-design
description: Diseñar y afinar tarjetas del backlog del workshop para que sean tareas de PRODUCTO reales sobre Ghostfolio y, además, requieran crear/mejorar/usar un componente OpenCode. Úsala al crear o ajustar tarjetas del whiteboard.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Diseño de tarjetas del workshop

Garantiza que cada tarjeta sea **desarrollo de producto** (no "crear un agente porque sí") y que el componente
OpenCode sea el **medio** para lograrlo.

## Regla de oro
Una buena tarjeta tiene a la vez:
- un **objetivo funcional** real en Ghostfolio (algo que un usuario o el producto gana), y
- un **entregable agentic**: qué command/agent/skill/MCP hay que crear, mejorar o usar.

Si una tarjeta solo dice "crea una skill" → está mal diseñada. Reescríbela alrededor del valor de producto.

## Plantilla de tarjeta (campos)
`ID, Título, Swimlane, Equipo sugerido, Objetivo funcional, Entregable de producto, Entregable agentic,
Concepto OpenCode trabajado, Dependencias, Criterio de aceptación, Pistas, Dificultad, Tiempo estimado.`

## Swimlanes
`Foundation, Frontend Product Tasks, Backend Product Tasks, Domain & Data Product Tasks, MCP Product Tasks,
Safety & Review, Integration.`

## Test de calidad de una tarjeta
- [ ] ¿Se entiende el valor de producto sin mencionar OpenCode?
- [ ] ¿Exige crear/mejorar/usar al menos un command/agent/skill/MCP?
- [ ] ¿El criterio de aceptación es observable (algo que se ve o se ejecuta)?
- [ ] ¿Es alcanzable en el tiempo estimado por un equipo pequeño?
- [ ] ¿Respeta las reglas de seguridad (read-only, sin tocar `.env`/schema, sin consejo financiero)?
- [ ] ¿Las dependencias con otras tarjetas están declaradas?

## Cuándo usar / no usar
- Úsala para FND/INT y al editar `whiteboard-backlog.md` y `whiteboard-cards.csv`.
- No la uses para implementar (eso es de los agentes especialistas).

## Límite
- Mantén el backlog entre 14 y 18 tarjetas, equilibrado entre swimlanes; no infles con tareas "meta".
