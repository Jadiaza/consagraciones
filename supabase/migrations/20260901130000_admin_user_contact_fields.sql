alter table public.profiles
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists parish text;

comment on column public.profiles.phone is 'Número de contacto administrado por el usuario o el superadministrador.';
comment on column public.profiles.city is 'Ciudad de residencia del usuario.';
comment on column public.profiles.country is 'País de residencia del usuario.';
comment on column public.profiles.parish is 'Parroquia o comunidad eclesial del usuario.';
