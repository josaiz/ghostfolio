---
description: Revisa un texto, prompt, endpoint o respuesta para evitar asesoramiento financiero personalizado. Devuelve PASS/FAIL. P. ej. /workshop-review-financial-safety SAFE-02
agent: financial-safety-reviewer
subtask: true
---

Revisa la seguridad financiera de: **$ARGUMENTS**

El contenido a revisar puede ser:
- un texto pegado directamente como argumento,
- una ruta de fichero (entonces léela), p. ej. `docs/workshop/generated/INT-01-portfolio-insights.md`,
- o el output de un command anterior que se te indique.

Trabaja así:
1. Carga la skill `financial-safety-review`.
2. Aplica el checklist: recomendación comprar/vender/mantener, "deberías", promesas de rentabilidad,
   predicción de precios, simulación de asesor, personalización a un individuo.
3. Devuelve exactamente:
   - **Veredicto**: PASS o FAIL.
   - **Hallazgos**: lista con cita exacta + motivo (vacía si PASS).
   - **Reescritura segura**: versión descriptiva/educativa equivalente.
   - **Checklist** marcado punto por punto.

No edites el contenido original; solo informa. Si te pasan un ID de tarjeta, guarda el informe en
`docs/workshop/generated/<ID>-safety-review.md`.
