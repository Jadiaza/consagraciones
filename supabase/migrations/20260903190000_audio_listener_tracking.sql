create table if not exists public.audio_access_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_consecration_id uuid not null references public.user_consecrations(id) on delete cascade,
  code_hash text not null unique,
  code_hint text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_used_at timestamptz,
  unique (user_consecration_id)
);

create table if not exists public.audio_access_sessions (
  id uuid primary key default gen_random_uuid(),
  access_code_id uuid not null references public.audio_access_codes(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.audio_listener_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_consecration_id uuid not null references public.user_consecrations(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 33),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  listened_seconds integer not null default 0 check (listened_seconds >= 0),
  listened_percent numeric(5,2) not null default 0 check (listened_percent between 0 and 100),
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  status text not null default 'started' check (status in ('started', 'in_progress', 'completed')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_consecration_id, media_asset_id)
);

create table if not exists public.audio_listened_segments (
  progress_id uuid not null references public.audio_listener_progress(id) on delete cascade,
  segment_index integer not null check (segment_index >= 0),
  created_at timestamptz not null default now(),
  primary key (progress_id, segment_index)
);

create table if not exists public.audio_identification_attempts (
  fingerprint_hash text primary key,
  attempt_count integer not null default 1 check (attempt_count > 0),
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists audio_access_codes_user_id_idx
  on public.audio_access_codes(user_id);
create index if not exists audio_access_sessions_code_expiry_idx
  on public.audio_access_sessions(access_code_id, expires_at desc);
create index if not exists audio_listener_progress_user_updated_idx
  on public.audio_listener_progress(user_id, updated_at desc);
create index if not exists audio_listener_progress_enrollment_day_idx
  on public.audio_listener_progress(user_consecration_id, day_number);

alter table public.audio_access_codes enable row level security;
alter table public.audio_access_sessions enable row level security;
alter table public.audio_listener_progress enable row level security;
alter table public.audio_listened_segments enable row level security;
alter table public.audio_identification_attempts enable row level security;

revoke all on public.audio_access_codes, public.audio_access_sessions,
  public.audio_listener_progress, public.audio_listened_segments,
  public.audio_identification_attempts from public, anon, authenticated;

grant all on public.audio_access_codes, public.audio_access_sessions,
  public.audio_listener_progress, public.audio_listened_segments,
  public.audio_identification_attempts to service_role;
grant select on public.audio_listener_progress to authenticated;

drop policy if exists "admins read audio progress" on public.audio_listener_progress;
create policy "admins read audio progress"
on public.audio_listener_progress for select to authenticated
using ((select public.has_role((select auth.uid()), 'admin')));

drop policy if exists "users read own audio progress" on public.audio_listener_progress;
create policy "users read own audio progress"
on public.audio_listener_progress for select to authenticated
using ((select auth.uid()) = user_id);

comment on table public.audio_listener_progress is
  'Avance independiente de la modalidad de audio; no equivale al recorrido completo de la aplicación.';
