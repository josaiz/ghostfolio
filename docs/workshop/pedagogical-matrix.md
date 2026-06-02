# Matriz didáctica — Product Task → OpenCode Concept → Component → Learning Outcome

Esta matriz explica **por qué** cada equipo hace una cosa distinta y cómo todas encajan en el mismo epic.
Úsala para presentar el workshop y para justificar el reparto de tarjetas.

`Product Task → OpenCode Concept → Component → Learning Outcome`

| Tarjeta | Concepto OpenCode | Componente concreto | Learning outcome |
|---------|-------------------|---------------------|------------------|
| **FND-01** Mapa técnico | Command + Agent | `/workshop-inspect-architecture` + `ghostfolio-architect` | Investigar un repo real de forma agéntica y read-only antes de tocar nada. |
| **FND-02** Contrato de insights | Skill + Agent + MCP | `ghostfolio-domain-analysis` + `portfolio-domain-agent` + MCP | Traducir un problema de producto a un contrato de datos estable. |
| **FE-01** Widget Insights | Command + Agent + Skill | `/workshop-plan-frontend-card` + `frontend-angular-agent` + `angular-nx-development` | Encapsular un workflow frontend repetible que respeta los patrones del repo. |
| **FE-02** Demo Portfolio Health | Command + Agent + Skill | `/workshop-plan-frontend-card` + `frontend-angular-agent` + `angular-nx-development` | Reusar el mismo command para otra tarjeta: planificar visualización sin reinventar. |
| **FE-03** Botón Explain | Command + Agent + Safety | `/workshop-plan-frontend-card` + `/workshop-review-financial-safety` | Conectar UI con datos y pasar el texto por un gate de safety. |
| **BE-01** Endpoint mock | Command + Agent + Skill | `/workshop-plan-backend-card` + `backend-nestjs-agent` + `nestjs-api-development` | Diseñar un endpoint pequeño "contrato primero" siguiendo convenciones reales. |
| **BE-02** Servicio concentración | Agent + Skill | `backend-nestjs-agent` + `prisma-readonly-data-access` | Calcular un dato de producto con acceso a datos seguro (read-only). |
| **DATA-01** Reglas concentración | Command + Agent + Skill + MCP | `/workshop-analyze-demo-portfolio` + `portfolio-domain-agent` + `ghostfolio-domain-analysis` + MCP | Razonar sobre datos reales del MCP y expresar insights descriptivos. |
| **DATA-02** Reglas anomalías | MCP + Skill + Safety | `detect_demo_anomalies` + `prisma-readonly-data-access` + `/workshop-review-financial-safety` | Definir heurísticas deterministas y documentarlas con criterio. |
| **MCP-01** MCP local | MCP + Agent + Skill + Config | `mcp-builder-agent` + `mcp-server-authoring` + `opencode.json` | Crear una herramienta externa gobernada y reutilizable por todos los agentes. |
| **MCP-02** Tool summary | MCP tool | `/workshop-plan-mcp-card` + `mcp-builder-agent` | Exponer una capacidad de producto como tool con contrato (inputSchema). |
| **MCP-03** Tool anomalies | MCP tool + Safety | `mcp-builder-agent` + `/workshop-review-financial-safety` | Encapsular lógica de detección detrás de una tool read-only segura. |
| **SAFE-01** Guía límites | Agent + Skill | `financial-safety-reviewer` + `financial-safety-review` | Convertir una restricción de producto en conocimiento reutilizable. |
| **SAFE-02** Review compra/venta | Command + Agent + Skill | `/workshop-review-financial-safety` + `financial-safety-reviewer` | Usar un gate repetible de calidad/seguridad sobre entregables ajenos. |
| **INT-01** Happy path | Command + Skill | `/workshop-implement-small-product-slice` + `product-slice-delivery` | Orquestar varios componentes en una demo reproducible y mínima. |
| **INT-02** Handoff | Command + Agent | `/workshop-prepare-team-handoff` + `workshop-facilitator-agent` | Hacer el trabajo transferible entre equipos sin perder contexto. |

## Cómo se conectan los outcomes

```text
Aprender a investigar (FND-01)
  -> a especificar (FND-02, DATA-01)
    -> a construir piezas reutilizables (MCP-01/02/03, FE-*, BE-*)
      -> a gobernar la calidad (SAFE-01/02)
        -> a integrar y transferir (INT-01/02)
```

El mensaje pedagógico central: **los componentes OpenCode son medios para desarrollar producto real**.
Un equipo que solo "crea un agente" sin un objetivo funcional de Ghostfolio no ha completado su tarjeta.

## Tres niveles de dominio (para evaluar a los equipos)

1. **Usa** un componente existente (p. ej. ejecuta `/workshop-analyze-demo-portfolio`).
2. **Mejora/extiende** un componente (p. ej. añade una tool al MCP o afina una skill).
3. **Crea** un componente nuevo conectado a una tarjeta de producto y lo integra en el ciclo.
