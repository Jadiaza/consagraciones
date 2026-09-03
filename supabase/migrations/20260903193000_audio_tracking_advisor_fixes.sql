create index if not exists audio_listener_progress_media_asset_id_idx
  on public.audio_listener_progress(media_asset_id);

drop policy if exists "admins read audio progress" on public.audio_listener_progress;
drop policy if exists "users read own audio progress" on public.audio_listener_progress;

create policy "authorized users read audio progress"
on public.audio_listener_progress for select to authenticated
using (
  (select auth.uid()) = user_id
  or (select public.has_role((select auth.uid()), 'admin'))
);
