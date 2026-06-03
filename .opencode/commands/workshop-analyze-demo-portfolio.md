---
description: Analiza el portfolio demo usando el MCP read-only y produce insights descriptivos (concentración, diversificación, anomalías). No da consejo financiero.
agent: portfolio-domain-agent
subtask: true
---

Analiza el portfolio demo y genera insights descriptivos. Foco (opcional): **$ARGUMENTS**

Trabaja así:
1. Carga la skill `ghostfolio-domain-analysis`.
2. Obtén los datos **solo desde el MCP** `ghostfolio-demo-data`:
   - `list_demo_accounts` para ver las cuentas.
   - `get_demo_portfolio_summary` para totales y exposición por cuenta/símbolo.
   - `detect_demo_anomalies` para anomalías del dataset de anomalías.
   No inventes cifras: todas deben venir del MCP.
3. Produce insights **descriptivos y medibles**, por ejemplo:
   - "La cuenta *Trade Republic Growth* concentra el N% en tecnología (NVDA/AAPL/MSFT/GOOGL/AMZN)."
   - "La cuenta *Crypto Exchange* representa el M% del total invertido."
   - "Se detectan K anomalías de tipo …"
4. **Prohibido** recomendar comprar/vender/mantener o predecir precios. Solo observación educativa.

Salida esperada: un resumen en markdown con las cifras del MCP. Si se indica un ID (p. ej. `INT-01`), guárdalo en
`docs/workshop/generated/<ID>-portfolio-insights.md`. Antes de mostrarlo, recuerda pasar el texto por
`/workshop-review-financial-safety`.
