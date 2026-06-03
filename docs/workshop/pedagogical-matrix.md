# Pedagogical Matrix — Product Task → OpenCode Concept → Component → Learning Outcome

This matrix explains **why** each team does something different and how they all fit into the same epic.
Use it to present the workshop and to justify the card distribution.

`Product Task → OpenCode Concept → Component → Learning Outcome`

| Card | OpenCode Concept | Concrete Component | Learning outcome |
|------|------------------|--------------------|------------------|
| **FND-01** Technical map | Command + Agent | `/workshop-inspect-architecture` + `ghostfolio-architect` | Investigate a real repo agentically and read-only before touching anything. |
| **FND-02** Insights contract | Skill + Agent + MCP | `ghostfolio-domain-analysis` + `portfolio-domain-agent` + MCP | Translate a product problem into a stable data contract. |
| **FE-01** Insights Widget | Command + Agent + Skill | `/workshop-plan-frontend-card` + `frontend-angular-agent` + `angular-nx-development` | Encapsulate a repeatable frontend workflow that respects the repo patterns. |
| **FE-02** Demo Portfolio Health | Command + Agent + Skill | `/workshop-plan-frontend-card` + `frontend-angular-agent` + `angular-nx-development` | Reuse the same command for another card: plan visualization without reinventing. |
| **FE-03** Explain Button | Command + Agent + Safety | `/workshop-plan-frontend-card` + `/workshop-review-financial-safety` | Connect UI with data and pass the text through a safety gate. |
| **BE-01** Mock endpoint | Command + Agent + Skill | `/workshop-plan-backend-card` + `backend-nestjs-agent` + `nestjs-api-development` | Design a small "contract first" endpoint following real conventions. |
| **BE-02** Concentration service | Agent + Skill | `backend-nestjs-agent` + `prisma-readonly-data-access` | Calculate a product data point with secure (read-only) data access. |
| **DATA-01** Concentration rules | Command + Agent + Skill + MCP | `/workshop-analyze-demo-portfolio` + `portfolio-domain-agent` + `ghostfolio-domain-analysis` + MCP | Reason about real MCP data and express descriptive insights. |
| **DATA-02** Anomaly rules | MCP + Skill + Safety | `detect_demo_anomalies` + `prisma-readonly-data-access` + `/workshop-review-financial-safety` | Define deterministic heuristics and document them with criteria. |
| **MCP-01** Local MCP | MCP + Agent + Skill + Config | `mcp-builder-agent` + `mcp-server-authoring` + `opencode.json` | Create an external governed tool reusable by all agents. |
| **MCP-02** Tool summary | MCP tool | `/workshop-plan-mcp-card` + `mcp-builder-agent` | Expose a product capability as a tool with a contract (inputSchema). |
| **MCP-03** Tool anomalies | MCP tool + Safety | `mcp-builder-agent` + `/workshop-review-financial-safety` | Encapsulate detection logic behind a safe read-only tool. |
| **SAFE-01** Limits guide | Agent + Skill | `financial-safety-reviewer` + `financial-safety-review` | Turn a product constraint into reusable knowledge. |
| **SAFE-02** Buy/sell review | Command + Agent + Skill | `/workshop-review-financial-safety` + `financial-safety-reviewer` | Use a repeatable quality/safety gate on other teams' deliverables. |
| **INT-01** Happy path | Command + Skill | `/workshop-implement-small-product-slice` + `product-slice-delivery` | Orchestrate several components into a reproducible and minimal demo. |
| **INT-02** Handoff | Command + Agent | `/workshop-prepare-team-handoff` + `workshop-facilitator-agent` | Make work transferable between teams without losing context. |

## How the outcomes connect

```text
Learn to investigate (FND-01)
  -> to specify (FND-02, DATA-01)
    -> to build reusable pieces (MCP-01/02/03, FE-*, BE-*)
      -> to govern quality (SAFE-01/02)
        -> to integrate and transfer (INT-01/02)
```

The central pedagogical message: **OpenCode components are means to develop real product**.
A team that only "creates an agent" without a functional Ghostfolio objective has not completed their card.

## Three mastery levels (for evaluating teams)

1. **Uses** an existing component (e.g. runs `/workshop-analyze-demo-portfolio`).
2. **Improves/extends** a component (e.g. adds a tool to the MCP or refines a skill).
3. **Creates** a new component connected to a product card and integrates it into the cycle.
