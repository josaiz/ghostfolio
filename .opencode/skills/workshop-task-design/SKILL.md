---
name: workshop-task-design
description: Design and refine workshop backlog cards so they are real PRODUCT tasks for Ghostfolio and also require creating/improving/using an OpenCode component. Use it when creating or adjusting whiteboard cards.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Workshop Card Design

Ensure every card is **product development** (not "create an agent for its own sake") and that the OpenCode component
is the **means** to achieve it.

## Golden Rule
A good card has both:
- a real **functional objective** in Ghostfolio (something a user or the product gains), and
- an **agentic deliverable**: which command/agent/skill/MCP must be created, improved, or used.

If a card only says "create a skill", it is poorly designed. Rewrite it around product value.

## Card Template (fields)
`ID, Title, Swimlane, Suggested Team, Functional Objective, Product Deliverable, Agentic Deliverable,
OpenCode Concept Practiced, Dependencies, Acceptance Criterion, Hints, Difficulty, Estimated Time.`

## Swimlanes
`Foundation, Frontend Product Tasks, Backend Product Tasks, Domain & Data Product Tasks, MCP Product Tasks,
Safety & Review, Integration.`

## Card Quality Test
- [ ] Is the product value understandable without mentioning OpenCode?
- [ ] Does it require creating/improving/using at least one command/agent/skill/MCP?
- [ ] Is the acceptance criterion observable (something visible or executable)?
- [ ] Is it achievable within the estimated time by a small team?
- [ ] Does it respect the safety rules (read-only, no touching `.env`/schema, no financial advice)?
- [ ] Are dependencies on other cards declared?

## When to Use / Not Use
- Use it for FND/INT and when editing `whiteboard-backlog.md`.
- Do not use it for implementation (that belongs to the specialist agents).

## Limit
- Keep the backlog between 14 and 18 cards, balanced across swimlanes; do not inflate it with "meta" tasks.
