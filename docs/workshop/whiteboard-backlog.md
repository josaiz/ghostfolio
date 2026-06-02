# Backlog de producto — Innovation Night (para Microsoft Whiteboard)

Epic común: **Portfolio Insights Assistant** — una mejora de producto sobre Ghostfolio que resume el portfolio demo,
detecta concentración y anomalías simples, y lo hace de forma **descriptiva** (sin asesoramiento financiero) y
**gobernada** (con un sistema de desarrollo agéntico en OpenCode).

> Cada tarjeta es una **tarea de producto real**. El componente OpenCode (command/agent/skill/MCP) es el **medio**
> para resolverla, no el fin. Copia este backlog a Microsoft Whiteboard en 7 swimlanes (una columna por swimlane).
> La versión CSV equivalente está en `whiteboard-cards.csv`.

Swimlanes: **Foundation · Frontend · Backend · Domain & Data · MCP · Safety & Review · Integration**

Leyenda de estado en la rama de soluciones:
- 🟢 **Resuelto**: el componente ya existe y funciona en esta rama (úsalo / estúdialo).
- 🟡 **Tooling listo**: el command/agente/skill existe; el equipo produce el entregable de producto (plan o código).

---

## Swimlane: Foundation

### FND-01 — Mapa técnico de Ghostfolio para la feature
- **Swimlane**: Foundation
- **Equipo sugerido**: cualquiera (ideal para empezar)
- **Objetivo funcional**: entender dónde vive cada cosa para no romper nada al construir insights.
- **Entregable de producto**: mapa técnico (ficheros, contratos, endpoints, riesgos) de la zona de portfolio/insights.
- **Entregable agentic**: ejecutar `/workshop-inspect-architecture` con el agente `ghostfolio-architect`.
- **Concepto OpenCode trabajado**: Command + Agent (investigación read-only).
- **Dependencias**: ninguna.
- **Criterio de aceptación**: documento con rutas reales verificadas y el command de planificación recomendado.
- **Pistas**: parte de `docs/workshop/architecture-notes.md`; pide al agente que confirme rutas con grep.
- **Dificultad**: Baja · **Tiempo**: 20 min · **Estado**: 🟢

### FND-02 — Contrato funcional del Portfolio Insights Assistant
- **Swimlane**: Foundation
- **Equipo sugerido**: Datos/Dominio
- **Objetivo funcional**: definir qué insights ofrece la feature y con qué forma de datos, para que FE/BE/MCP encajen.
- **Entregable de producto**: contrato de datos de insights (campos, tipos, ejemplos) que consumirán frontend y backend.
- **Entregable agentic**: skill `ghostfolio-domain-analysis` + agente `portfolio-domain-agent`; datos vía MCP.
- **Concepto OpenCode trabajado**: Skill + Agent (+ MCP como fuente de datos).
- **Dependencias**: FND-01.
- **Criterio de aceptación**: contrato con 3–5 insights descriptivos, cada uno trazable a una métrica del MCP.
- **Pistas**: usa `get_demo_portfolio_summary`; nada de "comprar/vender".
- **Dificultad**: Media · **Tiempo**: 30 min · **Estado**: 🟡

---

## Swimlane: Frontend Product Tasks

### FE-01 — Widget "Portfolio Insights" en la UI
- **Swimlane**: Frontend
- **Equipo sugerido**: Frontend
- **Objetivo funcional**: que un usuario vea un panel con los insights del portfolio demo.
- **Entregable de producto**: plan (o componente) de un widget visible que muestra concentración/anomalías.
- **Entregable agentic**: `/workshop-plan-frontend-card FE-01` → agente `frontend-angular-agent` + skill `angular-nx-development`.
- **Concepto OpenCode trabajado**: Command + Agent + Skill.
- **Dependencias**: FND-02 (contrato). Consume MCP/BE-01.
- **Criterio de aceptación**: plan con ruta real del componente (p. ej. `apps/client/src/app/components/portfolio-insights/`),
  componente análogo a seguir (`home-overview`), inputs/contrato y pasos de validación (`npm run lint`).
- **Pistas**: copia el patrón de `home-overview`/`portfolio-summary`; no añadas librerías.
- **Dificultad**: Media · **Tiempo**: 40 min · **Estado**: 🟡

### FE-02 — Sección "Demo Portfolio Health"
- **Swimlane**: Frontend
- **Equipo sugerido**: Frontend
- **Objetivo funcional**: una vista que resuma la "salud" descriptiva del portfolio demo (diversificación, nº anomalías).
- **Entregable de producto**: plan (o vista) con visualización simple de health/insights.
- **Entregable agentic**: `/workshop-plan-frontend-card FE-02` → `frontend-angular-agent` + `angular-nx-development`.
- **Concepto OpenCode trabajado**: Command + Agent + Skill.
- **Dependencias**: FE-01 o FND-02.
- **Criterio de aceptación**: plan con dónde se monta la vista, qué métricas muestra y de dónde vienen.
- **Pistas**: salud = métricas descriptivas, no un score que parezca recomendación.
- **Dificultad**: Media · **Tiempo**: 35 min · **Estado**: 🟡

### FE-03 — Botón "Explain demo portfolio"
- **Swimlane**: Frontend
- **Equipo sugerido**: Frontend
- **Objetivo funcional**: una interacción que pida y muestre el resumen del portfolio demo.
- **Entregable de producto**: plan (o implementación) de un botón que consume el endpoint/MCP y muestra el resumen.
- **Entregable agentic**: `/workshop-plan-frontend-card FE-03` + `/workshop-review-financial-safety` para el texto.
- **Concepto OpenCode trabajado**: Command + Agent + Safety review.
- **Dependencias**: FE-01, BE-01 o MCP-02.
- **Criterio de aceptación**: el texto mostrado pasa el review de safety (PASS) y es descriptivo.
- **Pistas**: el "explain" describe; no aconseja.
- **Dificultad**: Media · **Tiempo**: 35 min · **Estado**: 🟡

---

## Swimlane: Backend Product Tasks

### BE-01 — Endpoint mockeado de portfolio insights
- **Swimlane**: Backend
- **Equipo sugerido**: Backend
- **Objetivo funcional**: exponer un resumen demo determinista para que el frontend lo consuma.
- **Entregable de producto**: plan técnico del endpoint (module/controller/service + DTO) que devuelve insights demo.
- **Entregable agentic**: `/workshop-plan-backend-card BE-01` → `backend-nestjs-agent` + skill `nestjs-api-development`.
- **Concepto OpenCode trabajado**: Command + Agent + Skill.
- **Dependencias**: FND-02.
- **Criterio de aceptación**: plan con contrato en `libs/common`, ruta `/api/v1/...`, módulo análogo a copiar y validación con `npm run test:api`. Sin LLM real.
- **Pistas**: sigue la convención `apps/api/src/app/endpoints/<feature>/`.
- **Dificultad**: Media · **Tiempo**: 40 min · **Estado**: 🟡

### BE-02 — Servicio de concentración por cuenta/símbolo
- **Swimlane**: Backend
- **Equipo sugerido**: Backend
- **Objetivo funcional**: calcular la exposición/concentración de cada cuenta como dato de producto reutilizable.
- **Entregable de producto**: servicio backend (o plan) que calcula coste por símbolo y cuota por cuenta.
- **Entregable agentic**: `backend-nestjs-agent` + skill `prisma-readonly-data-access` (lectura segura).
- **Concepto OpenCode trabajado**: Agent + Skill (read-only data).
- **Dependencias**: FND-02; alineado con DATA-01.
- **Criterio de aceptación**: lógica read-only documentada que reproduce las cifras del MCP (`get_symbol_exposure`).
- **Pistas**: compara tu cálculo con `get_demo_portfolio_summary` para validar.
- **Dificultad**: Alta · **Tiempo**: 45 min · **Estado**: 🟡

---

## Swimlane: Domain & Data Product Tasks

### DATA-01 — Reglas de concentración/exposición del portfolio demo
- **Swimlane**: Domain & Data
- **Equipo sugerido**: Datos/Dominio
- **Objetivo funcional**: definir cómo se mide la concentración (umbrales, qué se considera "alta concentración" de forma descriptiva).
- **Entregable de producto**: documento de reglas de exposición con cifras reales del dataset demo.
- **Entregable agentic**: `/workshop-analyze-demo-portfolio` → `portfolio-domain-agent` + skill `ghostfolio-domain-analysis` + MCP.
- **Concepto OpenCode trabajado**: Command + Agent + Skill + MCP (tool de datos).
- **Dependencias**: MCP-02.
- **Criterio de aceptación**: reglas con cifras del MCP (p. ej. "Trade Republic Growth: AAPL 26.2%, top-3 67.7%") y caveat de divisa/coste.
- **Pistas**: todo dato viene del MCP; describe, no recomiendes.
- **Dificultad**: Media · **Tiempo**: 35 min · **Estado**: 🟡

### DATA-02 — Reglas de anomalías sobre datos importados
- **Swimlane**: Domain & Data
- **Equipo sugerido**: Datos/Dominio
- **Objetivo funcional**: definir qué cuenta como anomalía en datos importados (duplicado, comisión alta, divisa, precio, sobreventa).
- **Entregable de producto**: catálogo de anomalías con su definición y severidad, validado contra el dataset de anomalías.
- **Entregable agentic**: MCP `detect_demo_anomalies` + skill `prisma-readonly-data-access` + `/workshop-review-financial-safety`.
- **Concepto OpenCode trabajado**: MCP (tool) + Skill + Safety review.
- **Dependencias**: MCP-03.
- **Criterio de aceptación**: catálogo que explica los 5 tipos y por qué cada uno se marca; coincide con la salida del MCP.
- **Pistas**: el detector NO usa las etiquetas del CSV; explica la heurística.
- **Dificultad**: Media · **Tiempo**: 35 min · **Estado**: 🟡

---

## Swimlane: MCP Product Tasks

### MCP-01 — MCP local read-only para datos demo
- **Swimlane**: MCP
- **Equipo sugerido**: MCP/Plataforma
- **Objetivo funcional**: dar a OpenCode una herramienta estable para consultar datos demo sin prompts sueltos ni acceso destructivo.
- **Entregable de producto**: servidor MCP local registrado en `opencode.json` con `list_demo_accounts`.
- **Entregable agentic**: agente `mcp-builder-agent` + skill `mcp-server-authoring`; config en `opencode.json`.
- **Concepto OpenCode trabajado**: MCP + Agent + Skill + Config.
- **Dependencias**: ninguna.
- **Criterio de aceptación**: `./scripts/check-demo-mcp.sh` (o `.ps1`) en verde; OpenCode lista las tools del servidor.
- **Pistas**: ya implementado en `tools/mcp/ghostfolio-demo-data-mcp/`; estúdialo y extiéndelo.
- **Dificultad**: Media · **Tiempo**: 40 min · **Estado**: 🟢

### MCP-02 — Tool `get_demo_portfolio_summary`
- **Swimlane**: MCP
- **Equipo sugerido**: MCP/Plataforma
- **Objetivo funcional**: que cualquier agente obtenga un resumen determinista de la cartera demo.
- **Entregable de producto**: tool MCP que devuelve totales, holdings y concentración por cuenta.
- **Entregable agentic**: `/workshop-plan-mcp-card MCP-02` → `mcp-builder-agent` + `mcp-server-authoring`.
- **Concepto OpenCode trabajado**: MCP tool.
- **Dependencias**: MCP-01.
- **Criterio de aceptación**: la tool devuelve 3 cuentas, 54 actividades y cuotas por símbolo; smoke test verde.
- **Pistas**: reutiliza `src/data.mjs`; no dupliques el parser de CSV.
- **Dificultad**: Media · **Tiempo**: 35 min · **Estado**: 🟢

### MCP-03 — Tool `detect_demo_anomalies`
- **Swimlane**: MCP
- **Equipo sugerido**: MCP/Plataforma
- **Objetivo funcional**: detectar de forma determinista anomalías simples en datos importados.
- **Entregable de producto**: tool MCP que reporta duplicados, comisión alta, divisa inesperada, precio atípico y sobreventa.
- **Entregable agentic**: `mcp-builder-agent` + `mcp-server-authoring` + `/workshop-review-financial-safety` para los textos.
- **Concepto OpenCode trabajado**: MCP tool + Safety review.
- **Dependencias**: MCP-01.
- **Criterio de aceptación**: detecta los 5 tipos en el CSV de anomalías y ~0 en el dataset limpio.
- **Pistas**: deriva umbrales del dataset limpio; no leas las etiquetas `ANOMALY=`.
- **Dificultad**: Alta · **Tiempo**: 45 min · **Estado**: 🟢

---

## Swimlane: Safety & Review

### SAFE-01 — Guía de límites del assistant
- **Swimlane**: Safety & Review
- **Equipo sugerido**: Safety
- **Objetivo funcional**: dejar claro qué puede y qué no puede decir la feature (informa, no aconseja).
- **Entregable de producto**: guía de límites + checklist de aceptación de safety.
- **Entregable agentic**: agente `financial-safety-reviewer` + skill `financial-safety-review`.
- **Concepto OpenCode trabajado**: Agent + Skill.
- **Dependencias**: ninguna.
- **Criterio de aceptación**: checklist de 7 puntos y ejemplos PASS/FAIL aplicables a FE/MCP/INT.
- **Pistas**: ya hay base en la skill `financial-safety-review`; conviértela en guía para tu equipo.
- **Dificultad**: Baja · **Tiempo**: 25 min · **Estado**: 🟢

### SAFE-02 — Revisar que una respuesta no recomiende comprar/vender
- **Swimlane**: Safety & Review
- **Equipo sugerido**: Safety (revisa entregables de otros equipos)
- **Objetivo funcional**: garantizar que ningún texto visible recomiende acciones financieras personalizadas.
- **Entregable de producto**: informe PASS/FAIL con hallazgos y reescritura segura.
- **Entregable agentic**: `/workshop-review-financial-safety <texto|ruta>` → `financial-safety-reviewer`.
- **Concepto OpenCode trabajado**: Command + Agent + Skill.
- **Dependencias**: algo que revisar (FE-03, DATA-01, INT-01...).
- **Criterio de aceptación**: informe con veredicto y, si FAIL, reescritura que mantiene la información quitando el consejo.
- **Pistas**: úsalo como **gate** antes de cualquier demo.
- **Dificultad**: Baja · **Tiempo**: 20 min · **Estado**: 🟢

---

## Swimlane: Integration

### INT-01 — Happy path de demo de extremo a extremo
- **Swimlane**: Integration
- **Equipo sugerido**: Integración
- **Objetivo funcional**: demostrar el ciclo completo: datos demo → MCP → análisis → insights → review de safety.
- **Entregable de producto**: camino demostrable y reproducible (Portfolio Insights Demo).
- **Entregable agentic**: `/workshop-implement-small-product-slice INT-01` + `/workshop-demo-runbook` + skill `product-slice-delivery`.
- **Concepto OpenCode trabajado**: Command + Skill (orquestación de varios componentes).
- **Dependencias**: MCP-02, MCP-03, SAFE-02.
- **Criterio de aceptación**: se ejecuta `/workshop-analyze-demo-portfolio`, sale un resumen con cifras del MCP y pasa safety; pasos repetibles.
- **Pistas**: la happy path de referencia es read-only por MCP y no toca `apps/`.
- **Dificultad**: Media · **Tiempo**: 40 min · **Estado**: 🟢

### INT-02 — Handoff entre equipos
- **Swimlane**: Integration
- **Equipo sugerido**: Integración/Facilitación
- **Objetivo funcional**: que un equipo pueda continuar el trabajo de otro sin perder contexto.
- **Entregable de producto**: documento de handoff por tarjeta (qué se hizo, qué falta).
- **Entregable agentic**: `/workshop-prepare-team-handoff <ID>` → `workshop-facilitator-agent` + plantilla `team-handoff-template.md`.
- **Concepto OpenCode trabajado**: Command + Agent + plantilla reutilizable.
- **Dependencias**: cualquier tarjeta en curso.
- **Criterio de aceptación**: handoff con componentes usados, ficheros tocados (`git status`), pruebas y siguiente paso.
- **Pistas**: no inventes; lo que no conste, "pendiente".
- **Dificultad**: Baja · **Tiempo**: 20 min · **Estado**: 🟢

---

## Resumen rápido

| ID | Swimlane | Título | Componente OpenCode | Dif. | Min |
|----|----------|--------|---------------------|------|-----|
| FND-01 | Foundation | Mapa técnico | Command+Agent | Baja | 20 |
| FND-02 | Foundation | Contrato de insights | Skill+Agent+MCP | Media | 30 |
| FE-01 | Frontend | Widget Portfolio Insights | Command+Agent+Skill | Media | 40 |
| FE-02 | Frontend | Sección Demo Portfolio Health | Command+Agent+Skill | Media | 35 |
| FE-03 | Frontend | Botón Explain demo portfolio | Command+Agent+Safety | Media | 35 |
| BE-01 | Backend | Endpoint mock de insights | Command+Agent+Skill | Media | 40 |
| BE-02 | Backend | Servicio de concentración | Agent+Skill | Alta | 45 |
| DATA-01 | Domain & Data | Reglas de concentración | Command+Agent+Skill+MCP | Media | 35 |
| DATA-02 | Domain & Data | Reglas de anomalías | MCP+Skill+Safety | Media | 35 |
| MCP-01 | MCP | MCP local read-only | MCP+Agent+Skill+Config | Media | 40 |
| MCP-02 | MCP | Tool portfolio summary | MCP tool | Media | 35 |
| MCP-03 | MCP | Tool detect anomalies | MCP tool+Safety | Alta | 45 |
| SAFE-01 | Safety & Review | Guía de límites | Agent+Skill | Baja | 25 |
| SAFE-02 | Safety & Review | Review comprar/vender | Command+Agent+Skill | Baja | 20 |
| INT-01 | Integration | Happy path demo | Command+Skill | Media | 40 |
| INT-02 | Integration | Handoff entre equipos | Command+Agent | Baja | 20 |
