# Consagraciones

PWA católica para el itinerario de Consagración de 33 días a los Santos Arcángeles.

## Arquitectura

- React, TypeScript y TanStack Start.
- Supabase para autenticación, PostgreSQL y RLS.
- Nitro con preset de Vercel para SSR y despliegue.
- Cloudflare R2 preparado como proveedor de multimedia.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone https://github.com/Jadiaza/consagraciones.git
cd consagraciones
npm install
npm run dev
```

Variables públicas requeridas:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Las credenciales privilegiadas de Supabase nunca deben exponerse con el prefijo `VITE_`.
