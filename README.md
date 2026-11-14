# 20 · Gestor de contraseñas — API

> Bóveda local cifrada con biometría, generador de contraseñas y copiado temporal al portapapeles.

API en Next.js (App Router, runtime Node) desplegada en Vercel, con Firebase Authentication y Firestore vía Admin SDK.

## Requisitos

- Node.js 20+
- Variables de entorno configuradas en Vercel (ver `env.example`)

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
```

## Endpoints

- `GET /api/health`
- `POST /api/auth/registro`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/yo`
- `GET /api/respaldo`
- `PUT /api/respaldo`
- `GET /api/filtraciones/[prefijoSha1]`
