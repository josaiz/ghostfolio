# Innovation Night Ghostfolio Agentic Workshop

## Objetivo

Este repositorio es un fork local de Ghostfolio preparado para usarlo como producto base en un workshop de programacion agentica con OpenCode/OpenAgents Control.

La preparacion busca que el proyecto arranque en local con Docker Desktop construyendo la imagen desde el codigo del fork. Asi, cualquier cambio posterior en el codigo se podra revisar con Git, reconstruir y levantar de nuevo para verlo funcionando.

## Que es Ghostfolio

Ghostfolio es una aplicacion open source de wealth management y portfolio tracking. Permite gestionar inversiones, consultar datos de mercado y seguir el rendimiento de una cartera.

## Ficheros inspeccionados

Todos los ficheros solicitados estaban presentes:

```text
README.md
DEVELOPMENT.md
.env.example
docker/docker-compose.yml
docker/docker-compose.build.yml
```

Tambien se revisaron `Dockerfile`, `docker/entrypoint.sh`, `package.json`, `nx.json` y la estructura de carpetas para confirmar el stack y el comportamiento de arranque.

## Stack tecnico detectado

Segun `README.md`, `DEVELOPMENT.md`, `package.json` y `nx.json`, el proyecto usa:

- TypeScript
- Nx workspace
- NestJS para el backend
- Angular para el frontend
- Angular Material
- Bootstrap utility classes
- PostgreSQL
- Prisma
- Redis
- Docker Compose
- Node.js `>=22.18.0` para desarrollo local sin Docker

## Imagen oficial vs build local

Ghostfolio documenta dos formas de arrancar con Docker Compose:

- `docker/docker-compose.yml` arranca la imagen oficial publicada en Docker Hub: `docker.io/ghostfolio/ghostfolio:latest`.
- `docker/docker-compose.build.yml` construye la imagen desde el codigo local con `build: ../` y la etiqueta como `ghostfolio/ghostfolio:local`.

Para este workshop usamos como modo principal:

```bash
docker compose --env-file .env -f docker/docker-compose.build.yml build
docker compose --env-file .env -f docker/docker-compose.build.yml up -d
```

El flag `--env-file .env` no rompe el compose actual. El fichero `docker/docker-compose.yml` ya declara `env_file: ../.env`, y `--env-file .env` ayuda a que Docker Compose tenga disponibles las variables para interpolacion y mantiene explicito el fichero de entorno que usamos en el workshop.

Los scripts ajustan `COMPOSE_PROJECT_NAME` a `ghostfolio_build` cuando el `.env.example` trae el valor por defecto `ghostfolio`. Esto evita reutilizar por accidente volumenes de un arranque anterior con la imagen oficial.

## Servicios Docker Compose

`docker/docker-compose.yml` levanta:

- `ghostfolio`: aplicacion web/API con imagen oficial `docker.io/ghostfolio/ghostfolio:latest`, puerto `3333:3333`, healthcheck en `/api/v1/health`.
- `postgres`: PostgreSQL `15-alpine`, volumen `postgres`.
- `redis`: Redis Alpine protegido con `REDIS_PASSWORD`.

`docker/docker-compose.build.yml` levanta los mismos servicios, pero cambia `ghostfolio` para construir desde el codigo local:

- `ghostfolio`: `build: ../`, imagen local `ghostfolio/ghostfolio:local`.
- `postgres`: extiende el servicio base y usa el contenedor `gf-postgres-build`.
- `redis`: extiende el servicio base y usa el contenedor `gf-redis-build`.

## Puerto y URL local

La aplicacion expone el puerto `3333`.

```text
http://localhost:3333
```

## Variables de entorno

`README.md` marca como necesarias estas variables principales:

- `ACCESS_TOKEN_SALT`
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `POSTGRES_DB`
- `POSTGRES_PASSWORD`
- `POSTGRES_USER`
- `REDIS_HOST`
- `REDIS_PASSWORD`
- `REDIS_PORT`

Tambien documenta variables opcionales utiles como `DIRECT_URL`, `PORT`, `REDIS_DB` y `ROOT_URL`.

El `.env.example` actual contiene estos placeholders:

```text
<INSERT_REDIS_PASSWORD>
<INSERT_POSTGRES_PASSWORD>
<INSERT_RANDOM_STRING>
<INSERT_RANDOM_STRING>
```

El fichero `.env` local se crea copiando `.env.example` y sustituyendo esos placeholders con secretos aleatorios. No se imprimen secretos completos en este README.

`.env` ya estaba incluido en `.gitignore`, asi que no aparece como fichero para commitear.

## Migraciones y setup

Para el modo Docker, no hace falta lanzar un comando manual de setup despues de arrancar. `docker/entrypoint.sh` ejecuta:

```bash
npx prisma migrate deploy
npx prisma db seed
exec node main
```

`README.md` tambien indica que el contenedor aplica automaticamente las migraciones de base de datos durante el arranque.

En modo desarrollo sin Docker completo, `DEVELOPMENT.md` usa otro flujo: `docker/docker-compose.dev.yml`, `npm run database:setup`, servidor y cliente por separado. Ese no es el flujo principal de este workshop.

## Primer usuario administrador

`README.md` y `DEVELOPMENT.md` indican que, al abrir la UI y crear un usuario con _Get Started_, ese primer usuario recibe el rol `ADMIN`.

## Estructura del proyecto

Todo vive en un unico repositorio Git:

```text
innovation-night-ghostfolio-agentic-workshop/
  .git/
  apps/
  docker/
  libs/
  prisma/
  scripts/
  test/
  tools/
  README-workshop.md
```

## Requisitos Mac/Linux

- Git
- Docker Desktop
- Docker Compose
- curl
- bash

## Requisitos Windows

- Git for Windows
- Docker Desktop
- WSL2 recomendado
- PowerShell 7 recomendado
- Navegador web

## Arranque rapido en Mac/Linux

```bash
./scripts/start.sh
```

## Arranque rapido en Windows PowerShell

```powershell
.\scripts\start.ps1
```

## URL local

```text
http://localhost:3333
```

## Comprobar estado en Mac/Linux

```bash
./scripts/check.sh
```

## Comprobar estado en Windows

```powershell
.\scripts\check.ps1
```

## Logs en Mac/Linux

```bash
./scripts/logs.sh
```

## Logs en Windows

```powershell
.\scripts\logs.ps1
```

## Parar en Mac/Linux

```bash
./scripts/stop.sh
```

## Parar en Windows

```powershell
.\scripts\stop.ps1
```

## Reset completo en Mac/Linux

Esto borra los contenedores, redes y volumenes locales. Tambien borra la base de datos local de Ghostfolio.

```bash
./scripts/reset.sh
```

Sin confirmacion interactiva:

```bash
./scripts/reset.sh --force
```

## Reset completo en Windows

Esto borra los contenedores, redes y volumenes locales. Tambien borra la base de datos local de Ghostfolio.

```powershell
.\scripts\reset.ps1
```

Sin confirmacion interactiva:

```powershell
.\scripts\reset.ps1 -Force
```

## Rebuild despues de cambiar codigo

Esta parte es clave para el workshop: si modificamos codigo local de Ghostfolio, hay que reconstruir la imagen para que Docker ejecute una version nueva.

Mac/Linux:

```bash
./scripts/rebuild.sh
```

Windows:

```powershell
.\scripts\rebuild.ps1
```

`rebuild` usa `docker/docker-compose.build.yml`, reconstruye sin cache y vuelve a levantar el entorno.

## Git basico para revisar cambios

Ver que ficheros han cambiado:

```bash
git status
```

Ver el contenido exacto de los cambios:

```bash
git diff
```

Guardar los cambios en un commit local:

```bash
git add .
git commit -m "Prepare local workshop setup"
```

Subir la rama al fork:

```bash
git push origin workshop/local-docker-build-setup
```

No ejecutes `git push` salvo que se pida explicitamente.

## Troubleshooting

### Puerto 3333 ocupado

Cierra el proceso que este usando el puerto o cambia `PORT` en `.env`. Si cambias el puerto, revisa tambien el mapeo `3333:3333` del compose antes de usarlo como configuracion definitiva.

### Docker no esta arrancado

Abre Docker Desktop y espera a que indique que Docker esta listo. Despues ejecuta de nuevo `./scripts/start.sh` o `.\scripts\start.ps1`.

### Error de conexion a PostgreSQL

Ejecuta el check y revisa logs:

```bash
./scripts/check.sh
./scripts/logs.sh
```

El servicio `postgres` usa las variables `POSTGRES_DB`, `POSTGRES_USER` y `POSTGRES_PASSWORD` de `.env`.

### Error de conexion a Redis

Redis arranca con password obligatoria. Si falla, comprueba que `.env` no tenga placeholders y mira los logs:

```bash
./scripts/logs.sh
```

### `.env` no existe

Ejecuta:

```bash
./scripts/start.sh
```

El script crea `.env` desde `.env.example` y genera secretos locales.

### `.env` tiene placeholders sin reemplazar

Busca placeholders:

```bash
grep '<INSERT_' .env
```

Si aparecen, vuelve a ejecutar `./scripts/start.sh` o reemplazalos manualmente con valores seguros.

### Contenedor de Ghostfolio reiniciandose

Ejecuta:

```bash
./scripts/check.sh
./scripts/logs.sh
```

Las causas habituales son `.env` incompleto, PostgreSQL no saludable o Redis sin password correcta.

### Build lento la primera vez

Es normal. La primera build instala dependencias, genera Prisma y construye backend/frontend. Las builds posteriores deberian reutilizar capas salvo que uses `rebuild`, que fuerza `--no-cache`.

### Diferencias Mac/Windows

En Mac/Linux usa scripts `.sh`. En Windows usa scripts `.ps1` desde PowerShell. Docker Desktop debe estar arrancado en ambos casos. WSL2 esta recomendado en Windows.

### Resetear la instalacion local

Mac/Linux:

```bash
./scripts/reset.sh
```

Windows:

```powershell
.\scripts\reset.ps1
```

Esto borra la base de datos local.

### Ver logs

Mac/Linux:

```bash
./scripts/logs.sh
```

Windows:

```powershell
.\scripts\logs.ps1
```

## Nota para siguientes fases

Esta fase solo deja Ghostfolio funcionando localmente con build desde codigo. En una fase posterior se podran anadir:

```text
.opencode/
  context/
  agent/
  command/
  skills/
```

Tambien se podra crear un backlog para implementar funcionalidades AI-assisted tipo `Portfolio AI Assistant`.
