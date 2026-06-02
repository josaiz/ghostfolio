---
name: angular-nx-development
description: Cómo aplicar Angular 21 + Nx EN ESTE repo (Ghostfolio) sin romper nada. Localizar componentes análogos, respetar la estructura Nx, hacer cambios pequeños y validarlos. Para mecánica pura de Angular, apóyate en la skill angular-developer.
license: MIT
metadata:
  workshop: innovation-night-ghostfolio
---

# Desarrollo frontend Angular/Nx en Ghostfolio (workshop)

No es una guía genérica de Angular. Es **cómo trabajar el frontend de este repo** con cambios mínimos y seguros.
Para sintaxis/feature de Angular (signals, forms, etc.) carga además la skill genérica `angular-developer`.

## Mapa del frontend (verificado)
- App cliente: `apps/client/` (Angular 21 + Angular Material + Bootstrap utilities).
- Componentes de página: `apps/client/src/app/components/<component>/` (p. ej. `home-overview/`, `home-holdings/`,
  `home-summary/`, `portfolio-summary/`).
- Páginas: `apps/client/src/app/pages/<page>/` (`home/`, `portfolio/`, `demo/`).
- Componentes UI reutilizables: `libs/ui/src/lib/<component>/` (incluye `chart/`, `activities-table/`, `assistant/`).
- Servicios cliente: `apps/client/src/app/services/`.

## Método (copia un patrón, no inventes)
1. **Encuentra el análogo**: ¿qué componente existente se parece a lo que pides? Para un widget de resumen,
   estudia `home-overview` o `portfolio-summary`. Léelo entero antes de escribir.
2. **Replica su estructura**: mismo estilo de `@Component`, mismos imports, misma forma de recibir datos (inputs/servicios),
   mismos patrones de i18n y de estilos (`.scss` del componente). No introduzcas librerías nuevas.
3. **Datos**: consume un contrato determinista (mock o endpoint). En el workshop, **sin LLM real**.
4. **Monta el componente** donde corresponda (página `home`/`portfolio`) siguiendo cómo se montan los vecinos.
5. **Valida**: `npm run lint` y build del cliente. Revisa que no rompes módulos compartidos.

## Generar con Nx (si procede)
- Usa la CLI de Nx/Angular en vez de crear ficheros a mano cuando sea posible (respeta `nx.json` generators).
- No cambies configuración global de Nx, routing global ni theming global.

## Cuándo usar esta skill
- FE-01 (widget Portfolio Insights), FE-02 (vista Demo Portfolio Health), FE-03 (botón "Explain demo portfolio").

## Cuándo NO usarla
- Para lógica de negocio/cálculo (backend o dominio). Para el MCP (otra skill).

## Checklist de calidad
- [ ] Existe un componente análogo identificado y seguido.
- [ ] Cambios mínimos: pocos ficheros, ningún refactor transversal.
- [ ] Sin dependencias nuevas; estilos e i18n al estilo del repo.
- [ ] `npm run lint` y build del cliente pasan.
- [ ] Textos de UI revisados por `financial-safety-review` (nada de consejo personalizado).
- [ ] `git status` antes / `git diff` después; sin commit/push.

## Límites de seguridad
- No toques `.env`, `nx.json`, `tsconfig.base.json`, routing/theming globales. Pide revisión humana si el cambio crece.
