# Guide for setting up the board in Microsoft Whiteboard (quick)

Microsoft Whiteboard does not import CSV (1 row → 1 note). The fastest and most reliable approach is to use **note grids**
(one per swimlane), color them by lane, and paste the compact text of each card from the "copy bank"
below. In ~10–15 min you have the board with **moveable** notes so teams can pick cards.

The full detail of each card lives in `whiteboard-backlog.md`; the board notes only carry what is needed to scan at a glance.

## Suggested layout (7 columns, left → right)

```
Foundation | Frontend | Backend | Domain & Data | MCP | Safety & Review | Integration
```

## Color legend by swimlane (use Whiteboard note color)

| Swimlane | Note color | # cards |
|----------|------------|---------|
| Foundation | Grey | 2 |
| Frontend | Blue | 3 |
| Backend | Green | 2 |
| Domain & Data | Purple | 2 |
| MCP | Orange | 3 |
| Safety & Review | Pink/Red | 2 |
| Integration | Yellow | 2 |

## Steps

1. **Title**: `Create (+)` → `Text` at the top of the canvas: "Innovation Night — Portfolio Insights Assistant".
2. **Column headers**: add 7 text labels in a row (the swimlane names). Leave space below each one.
3. **Notes per lane (quick method)**: `Create (+)` → `Note grid`. Drop the grid under a header and use
   **Add note** until you have as many notes as cards in that lane. Select them and assign the lane **color**.
4. **Fill in**: double-click each note and paste the corresponding block from the "copy bank" below.
   (Tip: duplicating an already-formatted note with `Ctrl/Cmd+D` and editing the text is also fast.)
5. **Order**: within each column, sort top to bottom by ID (FND-01, FND-02, …).
6. **Optional — dependencies**: draw arrows with `Create (+)` → line/ink between dependent notes
   (e.g. MCP-02 → DATA-01), or leave the "Dep:" line on each note.
7. **Optional — legend**: add a small grey note with the color code and "Detail: docs/workshop/whiteboard-backlog.md".
8. **Progress lanes** (for the dynamic): add 3 headers to the right "To do / Doing / Done" or use a border color for
   "claimed card". Teams move their note when they pick it.

> Tip: lock the title and headers (selection menu → Lock) so they don't move when dragging notes.

---

## Copy bank (one note per block)

Format of each note: `ID — Title` / `Difficulty · Time · Team` / `OpenCode concept · kickoff`.

### Foundation (grey)

```
FND-01 — Mapa técnico de Ghostfolio
Baja · 20m · Cualquiera
Command+Agent · /workshop-inspect-architecture
```
```
FND-02 — Contrato de Portfolio Insights
Media · 30m · Datos/Dominio
Skill+Agent+MCP · skill ghostfolio-domain-analysis
```

### Frontend (blue)

```
FE-01 — Widget Portfolio Insights
Media · 40m · Frontend
Command+Agent+Skill · /workshop-plan-frontend-card FE-01
```
```
FE-02 — Sección Demo Portfolio Health
Media · 35m · Frontend
Command+Agent+Skill · /workshop-plan-frontend-card FE-02
```
```
FE-03 — Botón "Explain demo portfolio"
Media · 35m · Frontend
Command+Agent+Safety · /workshop-plan-frontend-card FE-03
```

### Backend (green)

```
BE-01 — Endpoint mock de insights
Media · 40m · Backend
Command+Agent+Skill · /workshop-plan-backend-card BE-01
```
```
BE-02 — Servicio de concentración
Alta · 45m · Backend
Agent+Skill · skill prisma-readonly-data-access
```

### Domain & Data (purple)

```
DATA-01 — Reglas de concentración
Media · 35m · Datos/Dominio
Command+Agent+Skill+MCP · /workshop-analyze-demo-portfolio
```
```
DATA-02 — Reglas de anomalías
Media · 35m · Datos/Dominio
MCP+Skill+Safety · tool detect_demo_anomalies
```

### MCP (orange)

```
MCP-01 — MCP local read-only
Media · 40m · MCP/Plataforma
MCP+Agent+Skill+Config · agent mcp-builder-agent
```
```
MCP-02 — Tool get_demo_portfolio_summary
Media · 35m · MCP/Plataforma
MCP tool · /workshop-plan-mcp-card MCP-02
```
```
MCP-03 — Tool detect_demo_anomalies
Alta · 45m · MCP/Plataforma
MCP tool+Safety · agent mcp-builder-agent
```

### Safety & Review (pink/red)

```
SAFE-01 — Guía de límites del assistant
Baja · 25m · Safety
Agent+Skill · skill financial-safety-review
```
```
SAFE-02 — Review comprar/vender
Baja · 20m · Safety
Command+Agent+Skill · /workshop-review-financial-safety
```

### Integration (yellow)

```
INT-01 — Happy path de demo
Media · 40m · Integración
Command+Skill · /workshop-implement-small-product-slice INT-01
```
```
INT-02 — Handoff entre equipos
Baja · 20m · Integración
Command+Agent · /workshop-prepare-team-handoff
```

---

## Plan B if you want something even faster

- **Background image**: I can generate a PNG/PDF of the board for `Insert > Image` (static, but instant). Just ask.
- **Paste from Excel**: open `whiteboard-cards.csv` in Excel, copy the `Title` column of a lane and paste it on the canvas;
  depending on the Whiteboard version it may create one note (or several). It is inconsistent, but try it: if it creates a single
  note with everything, discard it and use the note grid.
```
