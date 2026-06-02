# Guía del facilitador — Innovation Night (Ghostfolio + OpenCode)

Cómo preparar y dirigir la sesión para que los equipos hagan **desarrollo de producto real** y no se queden en
tareas "meta" (crear componentes OpenCode porque sí).

## 1. Preparar la sesión (antes)

1. Verifica que el repo arranca: `./scripts/start.sh` → `http://localhost:3333` y `./scripts/check.sh` OK.
2. Crea el usuario admin desde la UI y guarda el security token. Siembra datos: `./scripts/seed-workshop-data.sh`.
3. Verifica el MCP: `./scripts/check-demo-mcp.sh` → 7 comprobaciones en verde.
4. Comprueba que OpenCode detecta `opencode.json`, `.opencode/commands`, `.opencode/agents`, `.opencode/skills`.
5. Copia el backlog a Microsoft Whiteboard: importa `docs/workshop/whiteboard-cards.csv` o crea 7 swimlanes a mano
   desde `docs/workshop/whiteboard-backlog.md`.
6. Decide la rama de partida de los equipos (ver punto 3).

## 2. Dividir equipos

Sugerencia: 6 equipos pequeños alineados con los swimlanes.
- **Frontend** (FE-01/02/03), **Backend** (BE-01/02), **Datos/Dominio** (FND-02, DATA-01/02),
  **MCP/Plataforma** (MCP-01/02/03), **Safety** (SAFE-01/02, además revisa a los demás),
  **Integración/Facilitación** (INT-01/02).
- Todos empiezan por **FND-01** (mapa) para coger contexto. El equipo Safety puede arrancar SAFE-01 en paralelo.

## 3. Rama base vs rama de soluciones

- **Rama base**: Ghostfolio + datos demo + scripts, **sin** `.opencode/` ni MCP. Los equipos **construyen** los
  componentes desde cero (más reto, más aprendizaje). Usa esto si el grupo es avanzado.
- **Rama de soluciones (`workshop/solutions`)**: ya trae todos los componentes y el MCP. Los equipos **usan y
  extienden** (más rápido, foco en producto). Usa esto si el tiempo es corto.
- Opción mixta recomendada: equipos parten de la base, y la rama de soluciones está disponible como **referencia**
  a la que recurrir si se atascan.

## 4. Timing sugerido (sesión de ~3 h)

| Bloque | Tiempo | Qué |
|--------|--------|-----|
| Intro + epic + reglas | 20 min | Presenta el epic y la `pedagogical-matrix.md`. Insiste: producto, no "meta". |
| Setup + FND-01 | 25 min | Arrancar, verificar MCP, mapa de arquitectura por equipo. |
| Sprint 1 (planificar) | 45 min | Cada equipo usa su command de planificación; entrega un plan. |
| Checkpoint 1 | 15 min | Cada equipo enseña su plan en 2 min. Safety revisa textos. |
| Sprint 2 (construir/usar) | 45 min | Implementar slice mínimo o extender un componente (MCP/skill). |
| Checkpoint 2 | 15 min | Demo parcial. `git diff` por equipo. |
| Integración + demo | 20 min | INT-01 happy path en directo. Gate de safety. |
| Handoffs + cierre | 15 min | INT-02 handoffs; retro. |

## 5. Checkpoints (qué pedir)

- **CP1**: "Enséñame el plan y el command que lo generó." Debe haber un objetivo funcional claro.
- **CP2**: "Ejecuta tu cambio o tu tool. ¿Qué se ve? ¿Pasa safety?" Pide `git status`/`git diff`.
- **Final**: la happy path (`/workshop-analyze-demo-portfolio` + safety) corre de principio a fin.

## 6. Cómo evitar que se queden en tareas "meta"

- Pregunta siempre: **"¿Qué gana el producto Ghostfolio con esto?"** Si la respuesta es "tengo un agente nuevo",
  reconduce: "¿qué tarjeta de producto resuelve y cómo se ve el resultado?".
- Recuerda la regla: toda tarjeta tiene objetivo funcional **y** entregable agentic. Un componente sin objetivo de
  producto está incompleto.
- Usa la skill `workshop-task-design` para reescribir en directo una tarjeta mal planteada.

## 7. Preguntas para guiar equipos

- "¿Qué componente existente se parece a lo que quieres? ¿Lo has leído?" (evita inventar).
- "¿De dónde salen tus cifras? ¿Del MCP?" (evita datos inventados).
- "¿Tu texto recomienda algo? Pásalo por `/workshop-review-financial-safety`." 
- "¿Cuál es el cambio más pequeño que demuestra el valor?"

## 8. Fallbacks si algo falla

- **Ghostfolio no arranca**: la demo de insights por MCP **no lo necesita** (lee CSV). Sigue con OpenCode + MCP.
- **MCP no aparece en OpenCode**: ejecuta `./scripts/check-demo-mcp.sh`. Revisa `opencode.json` y que `node` exista.
  Reinicia OpenCode tras cambios de config.
- **OpenCode no ve commands/agents/skills**: confirma que estás en la raíz del repo y que existen `.opencode/commands`,
  `.opencode/agents`, `.opencode/skills` (plural). Reinicia OpenCode.
- **Datos demo ausentes**: `./scripts/seed-workshop-data.sh`. Para insights por MCP basta con los CSV en
  `data/workshop/import/`.
- **Un equipo bloqueado**: que use la rama de soluciones como referencia o el `workshop-facilitator-agent`.
- **Algo se rompió en el repo**: `git status`/`git diff`; revertir con `git checkout -- <fichero>`. No `git push`.

## 9. Criterios para "cerrar" la sesión

- Al menos una happy path demostrada en directo (INT-01) que pasa safety.
- Cada equipo con un entregable de producto (plan o slice) y un handoff (INT-02).
- Mensaje final: los componentes OpenCode sirvieron para desarrollar producto real, de forma gobernada y repetible.
