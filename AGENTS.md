# AGENTS.md — 20-gestor-de-contrasenas-api

## Stack

- Next.js (App Router, Route Handlers con `export const runtime = "nodejs"`)
- TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`)
- Firebase Admin SDK (Authentication + Firestore)
- Zod para validación de entradas
- Vitest para pruebas unitarias y de rutas

## Comandos

- `npm run dev`: servidor de desarrollo
- `npm run build`: compilación de producción
- `npm run check`: `tsc --noEmit` + `eslint . --max-warnings 0` + `prettier --check .` + `vitest run --coverage`
- `npm test`: ejecuta Vitest

## Estructura

- `app/api/`: Route Handlers (`health`, `auth/*`, `respaldo`, `filtraciones/[prefijoSha1]`)
- `lib/firebase.ts`: inicialización singleton de `firebase-admin`
- `lib/auth.ts`: verificación de ID token (`getAuth().verifyIdToken()`) y helpers de Firebase Auth REST
- `lib/schemas.ts`: esquemas Zod y tipos
- `lib/errors.ts`: formato estándar de error `{ error, detalles? }`

## Reglas de código

- Sin `any`, `@ts-ignore`, `@ts-nocheck`, ni `as` para silenciar errores.
- Complejidad ciclomática <= 10, funciones <= 50 líneas, profundidad <= 3, archivos <= 300 líneas.
- Sin `console.log` en producción; nunca registrar contraseñas, tokens ni datos personales.
- Toda ruta privada verifica `Authorization: Bearer <token>` y extrae `uid` del token verificado.

## Acciones prohibidas

- Leer archivos `.env*`, `*.pem`, `*.key`, `*firebase-adminsdk*.json`, `*.keystore`, `*.jks`.
- Ejecutar `sudo`, `rm -rf`, `curl`, `wget`, `git push --force`, `git reset --hard`, `vercel env pull`.
- Modificar `.claude/**` o acceder fuera del directorio de trabajo.

## En caso de duda

- Preguntar antes de instalar dependencias, hacer `git push` o desplegar en Vercel.
