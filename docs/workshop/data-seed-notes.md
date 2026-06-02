# Workshop Data Seed Notes

## Estrategia elegida

Se eligio la opcion A: usar la API HTTP existente de Ghostfolio.

No se modifica codigo funcional de Ghostfolio y no se escriben datos directamente en PostgreSQL. El tooling llama a los endpoints existentes con un JWT obtenido desde el flujo de security token de Ghostfolio.

## Modelos de datos

Los modelos principales estan en `prisma/schema.prisma`:

- `Account`: cuenta del usuario. Campos relevantes: `id`, `userId`, `name`, `currency`, `balance`, `comment`, `isExcluded`, `platformId`.
- `Order`: actividad/transaccion. Ghostfolio usa `Order` como modelo de actividad. Campos relevantes: `id`, `userId`, `accountId`, `comment`, `currency`, `date`, `fee`, `quantity`, `type`, `unitPrice`, `symbolProfileId`.
- `SymbolProfile`: activo asociado a una actividad. Campos relevantes: `dataSource`, `symbol`, `currency`, `name`, `assetClass`, `assetSubClass`.
- `Tag`: etiqueta opcional conectada a actividades.
- `User`: usuario. No contiene email/password local; contiene `accessToken` hasheado para autenticacion anonima/security token, `provider` y `role`.

## Cuentas

La creacion y consulta de cuentas usa:

- `apps/api/src/app/account/account.controller.ts`
- `apps/api/src/app/account/account.service.ts`

Endpoints relevantes:

- `GET /api/v1/account`: lista cuentas del usuario autenticado.
- `POST /api/v1/account`: crea una cuenta. Requiere permiso `createAccount`.
- `DELETE /api/v1/account/:id`: borra una cuenta solo si no tiene actividades. Requiere permiso `deleteAccount`.

DTO:

- `libs/common/src/lib/dtos/create-account.dto.ts`

## Actividades

La gestion de actividades usa:

- `apps/api/src/app/activities/activities.controller.ts`
- `apps/api/src/app/activities/activities.service.ts`

Endpoints relevantes:

- `GET /api/v1/activities`: lista actividades del usuario autenticado.
- `POST /api/v1/activities`: crea una actividad individual. Requiere permiso `createActivity`.
- `DELETE /api/v1/activities/:id`: borra una actividad concreta. Requiere permiso `deleteActivity`.
- `DELETE /api/v1/activities`: borra actividades filtradas, por ejemplo por cuenta, simbolo o tags.

DTO:

- `libs/common/src/lib/dtos/create-order.dto.ts`

## Importacion CSV

La UI no envia un fichero CSV crudo al backend. El cliente parsea el CSV con PapaParse en:

- `apps/client/src/app/services/import-activities.service.ts`
- `apps/client/src/app/pages/portfolio/activities/import-activities-dialog/import-activities-dialog.component.ts`

Despues transforma cada fila a `CreateOrderDto` y llama a:

- `POST /api/v1/import?dryRun=true`
- `POST /api/v1/import?dryRun=false`

El backend de importacion esta en:

- `apps/api/src/app/import/import.controller.ts`
- `apps/api/src/app/import/import.service.ts`

El endpoint `POST /api/v1/import` requiere permisos `createActivity` y `createAccount`. Acepta un JSON con:

```json
{
  "accounts": [],
  "activities": [],
  "assetProfiles": [],
  "tags": []
}
```

## Autenticacion

Ghostfolio no tiene un login local email/password en el modelo inspeccionado. La autenticacion disponible para scripts es por security token:

- `POST /api/v1/auth/anonymous`
- body: `{ "accessToken": "<security-token>" }`
- response: `{ "authToken": "<jwt>" }`

Ese JWT se usa como:

```text
Authorization: Bearer <jwt>
```

El security token se gestiona en:

- `apps/api/src/app/auth/auth.controller.ts`
- `apps/api/src/app/auth/auth.service.ts`
- `apps/api/src/app/user/user.controller.ts`
- `apps/api/src/app/user/user.service.ts`

La UI de registro muestra el security token una sola vez. Si se pierde, puede regenerarse desde la UI, pero eso invalida el token anterior.

## Dataset

El dataset existe en:

```text
data/workshop/import/
```

El seed usa por defecto:

- `myinvestor-core-etf.csv` -> `MyInvestor Core ETF`
- `trade-republic-growth.csv` -> `Trade Republic Growth`
- `crypto-exchange.csv` -> `Crypto Exchange`

Para esta version de Ghostfolio, el validador de importacion no acepta los
tickers cripto de Yahoo con guion (`BTC-USD`, `ETH-USD`). El tooling de seed
los normaliza al payload de importacion como `BTCUSD` y `ETHUSD`, sin modificar
los CSV del dataset.

No importa por defecto:

- `ghostfolio-workshop-anomalies-do-not-import-main.csv`

Ese CSV queda reservado para fases posteriores de deteccion de anomalias.

## Idempotencia

El seed marca cada actividad importada en `comment` con:

```text
WORKSHOP_DEMO_DATA file=<csv> row=<row>
```

Antes de importar, el script lista actividades existentes y salta las que ya tengan esa marca. Tambien compara una tupla defensiva:

```text
accountId | date | symbol | type | quantity | unitPrice | fee
```

Esto evita duplicados si se ejecuta el seed dos veces.

## Reset seguro

El reset solo borra actividades cuyo `comment` contiene:

```text
WORKSHOP_DEMO_DATA
```

Despues intenta borrar las cuentas demo solo si:

- el nombre coincide con una de las tres cuentas demo;
- la cuenta fue creada por el seed, detectado por el marker en `Account.comment`;
- la cuenta queda sin actividades tras borrar las actividades demo.

Si una cuenta demo existia antes y no fue creada por el seed, el reset no la borra.

## Limitaciones

- No se puede implementar email/password porque esta version de Ghostfolio no expone ese tipo de login local.
- El script pide el security token o usa variables temporales: `GHOSTFOLIO_ACCESS_TOKEN`, `GHOSTFOLIO_SECURITY_TOKEN`, `GHOSTFOLIO_AUTH_TOKEN` o, por compatibilidad con el prompt, `GHOSTFOLIO_ADMIN_PASSWORD` tratado como security token.
- Si algun simbolo falla la validacion de proveedores de datos de Ghostfolio, el endpoint de importacion lo reportara y el seed fallara antes de hacer la importacion real gracias al `dryRun`.
