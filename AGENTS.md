# AGENTS.md — Reglas del proyecto (Innovation Night Ghostfolio Agentic Workshop)

Estas reglas aplican a **cualquier agente** que trabaje en este repo (OpenCode, Claude Code u otro).
Son cortas a propósito. La arquitectura detallada está en `docs/workshop/architecture-notes.md`
(se carga automáticamente vía `opencode.json`).

## Seguridad y datos

- **No** modifiques `.env`, `.env.dev` ni `.env.example`. No imprimas ni guardes secretos.
- **No** toques datos reales de usuarios. Solo el dataset demo en `data/workshop/import/`.
- Trata los datos demo como **read-only**, salvo el seed oficial (`scripts/seed-workshop-data.*`).
- Para consultar datos demo, usa el MCP `ghostfolio-demo-data` (read-only). No leas/escribas PostgreSQL directamente.
- **No** des asesoramiento financiero personalizado. Insights = observaciones descriptivas y educativas, nunca
  "compra/vende X". Ver skill `financial-safety-review`.

## Cambios de código

- Prefiere **cambios pequeños y localizados**. Antes de implementar, **investiga y planifica**.
- Respeta los patrones existentes: busca un módulo/componente análogo y síguelo (Nx, NestJS, Angular).
- **No** cambies `prisma/schema.prisma`, `prisma/migrations/`, `docker/`, `Dockerfile`, `nx.json` ni
  `tsconfig.base.json` sin acuerdo explícito: rompen el arranque/seed local.
- Nada de refactors masivos, subidas de versión de dependencias ni cambios transversales.
- No metas un LLM real en la feature de insights del workshop (es una demo determinista).

## Flujo de trabajo

- Ejecuta `git status` y revisa `git diff` **antes y después** de tocar nada.
- **No** hagas `git commit` ni `git push` salvo que se pida explícitamente.
- Si modificas código funcional de Ghostfolio, documenta **qué y por qué** en `docs/workshop/`.
- Coloca tooling del workshop en `tools/workshop/` o `tools/mcp/`. Documentación en `docs/workshop/`.
- Separa las fases: **investigación → planificación → implementación → revisión**. Cada fase tiene su command.
- Pide revisión humana antes de cualquier cambio grande o irreversible.

## Cómo está organizada la solución agentic

- Commands repetibles: `.opencode/commands/` (se invocan con `/workshop-...`).
- Agentes especialistas: `.opencode/agents/`.
- Skills reutilizables: `.opencode/skills/` (más las genéricas en `.agents/skills/`).
- MCP local read-only: `tools/mcp/ghostfolio-demo-data-mcp/` (registrado en `opencode.json`).
- Guías y backlog: `docs/workshop/`.
