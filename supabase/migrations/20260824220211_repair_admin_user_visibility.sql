-- Backfill the public records expected by the administration screens for
-- accounts that existed before the auth trigger was installed.
insert into public.profiles (id, full_name, display_name)
select
  users.id,
  coalesce(users.raw_user_meta_data ->> 'full_name', ''),
  coalesce(
    nullif(users.raw_user_meta_data ->> 'full_name', ''),
    split_part(coalesce(users.email, ''), '@', 1),
    'Usuario'
  )
from auth.users as users
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select users.id, 'user'::public.app_role
from auth.users as users
on conflict (user_id, role) do nothing;

-- A super-administrator marker must also carry the admin role because the
-- administration RLS policies authorize through has_role(..., 'admin').
insert into public.user_roles (user_id, role)
select super_admins.user_id, 'admin'::public.app_role
from public.super_admins as super_admins
on conflict (user_id, role) do nothing;

-- Recreate the global read policies idempotently so environments that applied
-- only part of the original administration migration are repaired as well.
drop policy if exists "admins read profiles" on public.profiles;
create policy "admins read profiles"
on public.profiles for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin')));

drop policy if exists "admins read enrollments" on public.user_consecrations;
create policy "admins read enrollments"
on public.user_consecrations for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin')));

drop policy if exists "admins read progress" on public.user_day_progress;
create policy "admins read progress"
on public.user_day_progress for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin')));

drop policy if exists "admins read roles" on public.user_roles;
create policy "admins read roles"
on public.user_roles for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin')));
