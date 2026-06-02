---
name: ghostfolio-domain-analysis
description: Razonar sobre el dominio de Ghostfolio (cuentas, actividades/Order, símbolos, holdings, concentración y anomalías) usando el dataset demo del workshop. Úsala para definir insights descriptivos y contratos funcionales.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Análisis de dominio de Ghostfolio (workshop)

Conocimiento para razonar sobre el portfolio demo **antes** de implementar o planificar una feature de insights.

## Modelo mental (verificado en el repo)

- **Account**: cuenta del usuario (`name`, `currency`, `balance`). El dataset demo tiene 3 cuentas.
- **Order** = actividad/transacción: `type` (`BUY`/`SELL`/`DIVIDEND`/`FEE`/`INTEREST`/`LIABILITY`), `date`, `quantity`,
  `unitPrice`, `fee`, `currency`, `accountId`, `symbolProfileId`.
- **SymbolProfile**: el activo (`symbol`, `name`, `dataSource`, `assetClass`, `assetSubClass`).
- Un **holding** es la posición neta por símbolo en una cuenta: `Σ(BUY.quantity) − Σ(SELL.quantity)`.
- "Coste invertido" aproximado por símbolo: `Σ(BUY.quantity·unitPrice) − Σ(SELL.quantity·unitPrice)` (DIVIDEND no cuenta como compra).

## El dataset demo (fuente de verdad)

`data/workshop/import/ghostfolio-workshop-main.csv` (54 actividades, cabecera
`Date,Code,Name,Action,Currency,Price,Quantity,Fee,DataSource,Account,Comment`):

- **MyInvestor Core ETF** (EUR): VWCE.DE, SXR8.DE, IUSN.DE, EUNA.DE, IS3N.DE, EXSA.DE → diversificado (global, S&P500, small cap, bonos, EM, Europa).
- **Trade Republic Growth** (USD): NVDA, AAPL, MSFT, GOOGL, AMZN, ASML.AS → **concentración tech evidente**.
- **Crypto Exchange** (USD): BTC, ETH → **alta volatilidad**.

Anomalías etiquetadas (en `...-anomalies-do-not-import-main.csv`, NO se importa): `exact-duplicate`, `high-fee`,
`currency-mismatch`, `price-outlier`, `oversell-risk`.

## Cómo obtener los datos (no inventes cifras)

Pídelos al MCP **read-only** `ghostfolio-demo-data`: `list_demo_accounts`, `get_demo_portfolio_summary`,
`get_symbol_exposure`, `get_account_summary`, `list_demo_activities`, `detect_demo_anomalies`.
En el producto real, equivaldría a `GET /api/v1/account` y `GET /api/v1/activities`.

## Qué es un "insight" válido aquí

Observación **descriptiva y medible**, nunca prescriptiva:

- ✅ "La cuenta *Trade Republic Growth* concentra el 67.7% de su coste en 3 símbolos (AAPL 26.2%, MSFT 21.8%, NVDA 19.7%)."
- ✅ "La cuenta *Crypto Exchange* reparte su coste entre BTC (60.8%) y ETH (39.2%)."
- ✅ "El detector marca 5 anomalías en el sandbox: duplicado, comisión alta, divisa, precio atípico y sobreventa."
- ❌ "Deberías reducir NVDA" / "Compra más bonos" / "BTC subirá" (eso es asesoramiento → FAIL de safety).

> Cifras de ejemplo tomadas del MCP (`get_demo_portfolio_summary`). Si cambias el dataset, vuelve a pedirlas: nunca las fijes a mano.

## Cuándo usar esta skill
- FND-02 (contrato funcional), DATA-01/02, `/workshop-analyze-demo-portfolio`, y al diseñar widgets/endpoints de insights.

## Cuándo NO usarla
- Para mecánica de UI o de NestJS (usa `angular-nx-development` / `nestjs-api-development`).
- Para datos reales de usuarios: aquí solo dataset demo.

## Checklist de calidad
- [ ] Toda cifra proviene del MCP/servicios, no inventada.
- [ ] Cada insight es descriptivo, medible y trazable a una métrica.
- [ ] Ningún texto recomienda comprar/vender/mantener ni predice precios.
- [ ] Se distingue "coste invertido" de "valor de mercado" (sin precios actuales, trabaja sobre coste).
- [ ] El contrato de insight es estable (campos claros) para que frontend/backend lo consuman.

## Límites de seguridad
- Datos sintéticos y educativos. No es asesoramiento. Pasa los textos por `financial-safety-review`.
