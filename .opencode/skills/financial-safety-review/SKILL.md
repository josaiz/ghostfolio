---
name: financial-safety-review
description: Revisar textos, prompts, endpoints y respuestas de la feature de insights para que NO contengan asesoramiento financiero personalizado. Aporta el checklist, ejemplos y el formato de veredicto PASS/FAIL.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Revisión de seguridad financiera (workshop)

El límite del producto: **describe e informa; nunca aconseja a una persona qué hacer con su dinero.**
Los datos son sintéticos y educativos.

## Checklist (un FAIL en cualquier punto = FAIL global)
1. **Recomendación de acción**: ¿dice o insinúa comprar/vender/mantener/rebalancear? → FAIL.
2. **Personalización**: ¿se dirige a "tú/usted" diciendo qué hacer con *su* cartera? → FAIL.
3. **Predicción**: ¿predice precios, rentabilidades o "subirá/bajará"? → FAIL.
4. **Promesa**: ¿promete ganancias, "óptimo", "mejor inversión"? → FAIL.
5. **Simulación de asesor**: ¿se presenta como asesor financiero o da un "consejo"? → FAIL.
6. **Idoneidad**: ¿juzga si un activo es "bueno/malo" para alguien? → FAIL.
7. **Disclaimer**: para outputs visibles, ¿deja claro que es informativo y no asesoramiento? (recomendado).

Permitido (PASS): observaciones **descriptivas y medibles** sobre el dataset.

## Ejemplos
- ❌ "Tu cartera está muy concentrada en tech, deberías diversificar." → FAIL (recomendación + personalización).
- ✅ "La cuenta *Trade Republic Growth* tiene su mayor posición en AAPL (26.2% del coste); le siguen MSFT (21.8%) y NVDA (19.7%)."
- ❌ "BTC seguramente subirá, buen momento para comprar." → FAIL (predicción + recomendación).
- ✅ "La cuenta *Crypto Exchange* muestra alta variación de precio de entrada entre 2024 y 2026 (43.5k → 108k USD en BTC)."

## Formato de salida (siempre el mismo)
```
Veredicto: PASS | FAIL
Hallazgos:
  - "<cita exacta>" → <qué punto del checklist viola y por qué>
Reescritura segura:
  <versión descriptiva equivalente>
Checklist:
  1..7 → OK/observación
```

## Cuándo usar esta skill
- SAFE-01 (guía de límites), SAFE-02 (revisar una respuesta), y como **gate** antes de cualquier salida visible (FE/MCP/INT).

## Cuándo NO usarla
- Para revisar bugs/correctitud técnica (eso es code review).

## Límites de seguridad
- No suavices un FAIL real. La reescritura debe mantener la información pero quitar la acción/predicción/personalización.
