<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Identidad compartida con LVJPRAYER

- Consagraciones y LVJPRAYER comparten el mismo proyecto Supabase Auth (`zcfnquusvkrkqjeusmly`).
- `auth.users.id` es la identidad canónica de los usuarios de Consagraciones; las tablas `profiles`, `user_consecrations` y `user_day_progress` conservan esa misma referencia.
- No crear una segunda tabla de usuarios ni duplicar cuentas Supabase para integrar Consagraciones con LVJPRAYER.
- La integración con LVJPRAYER es de identidad: al existir una sesión válida, Consagraciones puede sincronizar el bearer token con `https://lavozdejesus.co/api/acceso.php`, que resuelve la identidad en `lvj_com_usuarios`.
- La sincronización es best-effort y nunca debe bloquear el acceso a Consagraciones ni alterar inscripciones, progreso, diario, intenciones u otros datos propios de esta aplicación.
- El progreso de los usuarios permanece exclusivamente en las tablas de Consagraciones y se relaciona mediante el mismo UUID de Supabase.
