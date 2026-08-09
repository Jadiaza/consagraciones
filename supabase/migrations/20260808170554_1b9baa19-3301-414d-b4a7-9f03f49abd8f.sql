
-- ============ ROLES ============
create type public.app_role as enum ('user','companion','editor','admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  display_name text,
  avatar_url text,
  community text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles own select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles own insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles own update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ============ CONTENT (public, published) ============
create table public.consecrations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  motto text,
  description text,
  duration_days integer not null default 33,
  theme_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.consecration_stages (
  id uuid primary key default gen_random_uuid(),
  consecration_id uuid not null references public.consecrations(id) on delete cascade,
  stage_number integer not null,
  title text not null,
  motto text,
  description text,
  start_day integer not null,
  end_day integer not null,
  accent_color text,
  hero_image text,
  unique (consecration_id, stage_number)
);

create table public.consecration_days (
  id uuid primary key default gen_random_uuid(),
  consecration_id uuid not null references public.consecrations(id) on delete cascade,
  stage_id uuid references public.consecration_stages(id) on delete set null,
  day_number integer not null,
  title text not null,
  subtitle text,
  objective text,
  motto text,
  hero_image text,
  introduction text,
  teaching text,
  church_teaching text,
  meditation text,
  purpose text,
  prayer text,
  progressive_consecration text,
  estimated_minutes integer not null default 25,
  status text not null default 'draft',
  published_at timestamptz,
  unique (consecration_id, day_number)
);

create table public.consecration_day_sections (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.consecration_days(id) on delete cascade,
  section_type text not null,
  title text,
  body text,
  sort_order integer not null default 0
);

create table public.scripture_references (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.consecration_days(id) on delete cascade,
  citation text not null,
  passage text,
  commentary text,
  sort_order integer not null default 0
);

create table public.doctrinal_references (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.consecration_days(id) on delete cascade,
  reference_type text not null,
  author text,
  work text,
  reference text,
  excerpt text,
  commentary text,
  source_url text,
  sort_order integer not null default 0
);

create table public.examination_questions (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.consecration_days(id) on delete cascade,
  question text not null,
  sort_order integer not null default 0
);

create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  consecration_id uuid references public.consecrations(id) on delete cascade,
  slug text not null,
  kind text not null default 'prayer',
  title text not null,
  body text not null,
  response text,
  sort_order integer not null default 0,
  unique (consecration_id, slug)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  consecration_id uuid references public.consecrations(id) on delete cascade,
  day_id uuid references public.consecration_days(id) on delete cascade,
  asset_type text not null,
  provider text not null default 'cloudflare_r2',
  storage_key text not null,
  public_url text,
  mime_type text,
  file_size bigint,
  duration_seconds integer,
  width integer,
  height integer,
  alt_text text,
  is_downloadable boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  consecration_id uuid references public.consecrations(id) on delete cascade,
  category text not null,
  title text not null,
  summary text,
  body text,
  external_url text,
  media_id uuid references public.media_assets(id) on delete set null,
  sort_order integer not null default 0,
  status text not null default 'published'
);

grant select on public.consecrations, public.consecration_stages, public.consecration_days,
  public.consecration_day_sections, public.scripture_references, public.doctrinal_references,
  public.examination_questions, public.prayers, public.media_assets, public.resources to anon, authenticated;
grant all on public.consecrations, public.consecration_stages, public.consecration_days,
  public.consecration_day_sections, public.scripture_references, public.doctrinal_references,
  public.examination_questions, public.prayers, public.media_assets, public.resources to service_role;

alter table public.consecrations enable row level security;
alter table public.consecration_stages enable row level security;
alter table public.consecration_days enable row level security;
alter table public.consecration_day_sections enable row level security;
alter table public.scripture_references enable row level security;
alter table public.doctrinal_references enable row level security;
alter table public.examination_questions enable row level security;
alter table public.prayers enable row level security;
alter table public.media_assets enable row level security;
alter table public.resources enable row level security;

create policy "published consecrations readable" on public.consecrations for select to anon, authenticated using (status = 'published');
create policy "stages readable" on public.consecration_stages for select to anon, authenticated using (exists (select 1 from public.consecrations c where c.id = consecration_id and c.status = 'published'));
create policy "days readable" on public.consecration_days for select to anon, authenticated using (status = 'published' and exists (select 1 from public.consecrations c where c.id = consecration_id and c.status = 'published'));
create policy "sections readable" on public.consecration_day_sections for select to anon, authenticated using (exists (select 1 from public.consecration_days d where d.id = day_id and d.status = 'published'));
create policy "scripture readable" on public.scripture_references for select to anon, authenticated using (exists (select 1 from public.consecration_days d where d.id = day_id and d.status = 'published'));
create policy "doctrine readable" on public.doctrinal_references for select to anon, authenticated using (exists (select 1 from public.consecration_days d where d.id = day_id and d.status = 'published'));
create policy "questions readable" on public.examination_questions for select to anon, authenticated using (exists (select 1 from public.consecration_days d where d.id = day_id and d.status = 'published'));
create policy "prayers readable" on public.prayers for select to anon, authenticated using (true);
create policy "media readable" on public.media_assets for select to anon, authenticated using (true);
create policy "resources readable" on public.resources for select to anon, authenticated using (status = 'published');

create policy "editors manage consecrations" on public.consecrations for all to authenticated using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor')) with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'));
create policy "editors manage days" on public.consecration_days for all to authenticated using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor')) with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'editor'));

-- ============ USER DATA ============
create table public.user_consecrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consecration_id uuid not null references public.consecrations(id) on delete cascade,
  start_date date not null default current_date,
  expected_end_date date,
  completed_at timestamptz,
  current_day integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, consecration_id, start_date)
);

create table public.user_day_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_consecration_id uuid not null references public.user_consecrations(id) on delete cascade,
  day_number integer not null,
  completed boolean not null default false,
  completed_at timestamptz,
  purpose_accepted boolean not null default false,
  purpose_outcome text,
  audio_position_seconds integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_consecration_id, day_number)
);

create table public.user_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_consecration_id uuid references public.user_consecrations(id) on delete cascade,
  day_number integer,
  prompt text,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_consecration_id uuid references public.user_consecrations(id) on delete cascade,
  content text not null,
  visibility text not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_petitions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  visibility text not null default 'private',
  answered boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_prayer_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consecration_id uuid references public.consecrations(id) on delete cascade,
  prayer_slug text not null default 'coronilla-san-miguel',
  current_group integer not null default 1,
  current_bead integer not null default 0,
  completed_count integer not null default 0,
  last_prayed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, prayer_slug)
);

create table public.spiritual_companions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  community text,
  avatar_url text,
  message text,
  created_at timestamptz not null default now()
);

create table public.companion_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  companion_id uuid not null references public.spiritual_companions(id) on delete cascade,
  share_journal boolean not null default false,
  share_intentions boolean not null default false,
  share_petitions boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, companion_id)
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consecration_id uuid not null references public.consecrations(id) on delete cascade,
  full_name text not null,
  started_on date,
  issued_at timestamptz not null default now(),
  storage_key text,
  verification_code text not null default encode(gen_random_bytes(8),'hex')
);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  daily_reminder boolean not null default true,
  reminder_time time not null default '07:00',
  coronilla_reminder boolean not null default false,
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.user_consecrations, public.user_day_progress,
  public.user_journal_entries, public.user_intentions, public.user_petitions, public.user_prayer_progress,
  public.spiritual_companions, public.companion_assignments, public.certificates, public.notification_preferences to authenticated;
grant all on public.user_consecrations, public.user_day_progress, public.user_journal_entries,
  public.user_intentions, public.user_petitions, public.user_prayer_progress, public.spiritual_companions,
  public.companion_assignments, public.certificates, public.notification_preferences to service_role;

alter table public.user_consecrations enable row level security;
alter table public.user_day_progress enable row level security;
alter table public.user_journal_entries enable row level security;
alter table public.user_intentions enable row level security;
alter table public.user_petitions enable row level security;
alter table public.user_prayer_progress enable row level security;
alter table public.spiritual_companions enable row level security;
alter table public.companion_assignments enable row level security;
alter table public.certificates enable row level security;
alter table public.notification_preferences enable row level security;

create policy "own user_consecrations" on public.user_consecrations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own day progress" on public.user_day_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own journal" on public.user_journal_entries for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own intentions" on public.user_intentions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own petitions" on public.user_petitions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own prayer progress" on public.user_prayer_progress for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own companions" on public.spiritual_companions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own companion assignments" on public.companion_assignments for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own certificates select" on public.certificates for select to authenticated using (auth.uid() = user_id);
create policy "own certificates insert" on public.certificates for insert to authenticated with check (auth.uid() = user_id);
create policy "own notification prefs" on public.notification_preferences for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger uc_updated before update on public.user_consecrations for each row execute function public.set_updated_at();
create trigger udp_updated before update on public.user_day_progress for each row execute function public.set_updated_at();
create trigger uje_updated before update on public.user_journal_entries for each row execute function public.set_updated_at();
create trigger ui_updated before update on public.user_intentions for each row execute function public.set_updated_at();
create trigger up_updated before update on public.user_petitions for each row execute function public.set_updated_at();
create trigger upp_updated before update on public.user_prayer_progress for each row execute function public.set_updated_at();

-- ============ SEED ============
insert into public.consecrations (slug, title, subtitle, motto, description, duration_days, status, published_at, theme_config)
values ('santos-arcangeles-33-dias',
  'Consagración de 33 días a los Santos Arcángeles',
  'San Miguel · San Gabriel · San Rafael',
  '¿Quién como Dios? ¡Nadie como Dios!',
  'Un camino de fe, conversión, combate espiritual, santidad y misión, con San Miguel como guía, acompañados por San Gabriel y San Rafael, hacia una vida más profundamente entregada a Jesucristo.',
  33, 'published', now(),
  '{"primary":"azul-noche","accent":"dorado-liturgico"}'::jsonb);

insert into public.consecration_stages (consecration_id, stage_number, title, motto, start_day, end_day, accent_color)
select c.id, v.n, v.t, v.m, v.s, v.e, v.col from public.consecrations c,
(values
 (1,'Conocer a Dios y el mundo angélico','Todo comienza en Dios',1,7,'stage-1'),
 (2,'Conversión y purificación','Un corazón nuevo',8,14,'stage-2'),
 (3,'El combate espiritual','Revestíos de la armadura de Dios',15,21,'stage-3'),
 (4,'Vida de santidad','Vivir para la gloria de Dios',22,28,'stage-4'),
 (5,'Consagración y misión','Enviados a servir',29,33,'stage-5')
) v(n,t,m,s,e,col) where c.slug='santos-arcangeles-33-dias';

insert into public.consecration_days (consecration_id, stage_id, day_number, title, status, published_at)
select c.id, s.id, v.n, v.t, 'published', now()
from public.consecrations c
join public.consecration_stages s on s.consecration_id = c.id
join (values
 (1,'¿Quiénes son los ángeles?'),
 (2,'San Miguel en la Biblia'),
 (3,'Su misión y su amor'),
 (4,'La gloria de Dios'),
 (5,'La adoración y el servicio de los ángeles'),
 (6,'Vivir para la mayor gloria de Dios'),
 (7,'Mi Ángel de la Guarda'),
 (8,'Renunciar al pecado'),
 (9,'Romper cadenas espirituales'),
 (10,'Vencer el orgullo'),
 (11,'Combatir la mentira'),
 (12,'Pureza de corazón'),
 (13,'Obediencia y humildad'),
 (14,'La confesión como arma espiritual'),
 (15,'La guerra espiritual'),
 (16,'La armadura de Dios'),
 (17,'La victoria de San Miguel sobre el dragón'),
 (18,'Discernir tentaciones y engaños'),
 (19,'La autoridad del Nombre de Jesús'),
 (20,'La Sangre de Cristo'),
 (21,'La victoria definitiva'),
 (22,'Oración constante'),
 (23,'Adoración eucarística'),
 (24,'María, Reina de los Ángeles'),
 (25,'La caridad que transforma'),
 (26,'Servicio humilde'),
 (27,'Custodiar la familia'),
 (28,'Vivir como ciudadano del Cielo'),
 (29,'San Miguel, protector de la Iglesia'),
 (30,'Defender la fe en el mundo actual'),
 (31,'Vivir bajo el señorío de Jesucristo'),
 (32,'Prepararse para el encuentro con Dios'),
 (33,'Solemne Consagración a los Tres Arcángeles')
) v(n,t) on v.n between s.start_day and s.end_day
where c.slug='santos-arcangeles-33-dias';

update public.consecration_days d set
  subtitle = 'Etapa I · Conocer a Dios y el mundo angélico',
  objective = 'Comprender, a la luz de la fe de la Iglesia, quiénes son los ángeles y por qué su existencia nos conduce siempre a Dios.',
  motto = '¿Quién como Dios?',
  introduction = 'Antes de comenzar, haz silencio. Ponte en la presencia de Dios, haz la señal de la cruz y pide al Espíritu Santo que ilumine tu corazón. Hoy no comenzamos hablando de los ángeles, sino de Dios: los ángeles existen porque Dios los ha creado, y toda su vida consiste en adorarlo y servirlo.',
  teaching = 'Los ángeles son criaturas espirituales, sin cuerpo, dotadas de inteligencia y voluntad, creadas por Dios y enteramente orientadas hacia Él. No son fuerzas impersonales, ni energías, ni almas de difuntos, ni seres autónomos: son servidores y mensajeros de Dios. San Agustín lo resume con claridad: "ángel" designa la función, no la naturaleza; se pregunta qué es y se responde: espíritu; se pregunta qué hace y se responde: ángel, es decir, mensajero.

Por eso la devoción a los Santos Arcángeles nunca puede convertirse en un fin en sí misma. San Miguel, San Gabriel y San Rafael nos acompañan e interceden, pero el centro es Cristo. Toda la vida angélica es un "¿Quién como Dios?": el reconocimiento gozoso de que solo Dios es Dios.',
  church_teaching = 'La Iglesia enseña la existencia de los ángeles como verdad de fe (Catecismo de la Iglesia Católica, 328). Son servidores y mensajeros de Dios (CIC 329), criaturas personales e inmortales (CIC 330), que pertenecen a Cristo porque han sido creados por Él y para Él (CIC 331), y que desde la creación acompañan toda la historia de la salvación (CIC 332).',
  meditation = 'Permanece unos minutos en silencio ante esta verdad: existe un mundo invisible que adora a Dios sin cesar. Deja que esa adoración despierte en ti el deseo de adorar también. Pregúntate serenamente: ¿mi vida está orientada a Dios como lo está la de los ángeles?',
  purpose = 'Hoy haré un acto consciente de adoración: me detendré un momento, en silencio, para reconocer que solo Dios es Dios, y diré desde el corazón: "¿Quién como Dios? ¡Nadie como Dios!"',
  prayer = 'Señor Dios, Creador de todo lo visible y lo invisible: te alabo porque solo Tú eres Dios. Gracias por los santos ángeles, que te sirven y te adoran sin cesar. Que su ejemplo despierte en mí un corazón adorador. Por intercesión de San Miguel, San Gabriel y San Rafael, condúceme más profundamente a Jesucristo, tu Hijo, que vive y reina por los siglos de los siglos. Amén.',
  progressive_consecration = 'Señor Jesús, en este primer día pongo en tus manos mi deseo de conocerte más. Que estos 33 días no me lleven a los ángeles como fin, sino a Ti por medio de ellos. Comienzo este camino contigo.',
  estimated_minutes = 28
from public.consecrations c where d.consecration_id = c.id and c.slug='santos-arcangeles-33-dias' and d.day_number = 1;

insert into public.scripture_references (day_id, citation, passage, commentary, sort_order)
select d.id, v.c, v.p, v.k, v.o from public.consecration_days d join public.consecrations c on c.id=d.consecration_id,
(values
 ('Salmo 103 (102), 20','Bendecid al Señor, ángeles suyos, poderosos ejecutores de sus órdenes, prontos a la voz de su palabra.','Los ángeles bendicen a Dios y cumplen su palabra: su gloria es obedecer.',1),
 ('Hebreos 1, 14','¿No son todos ellos espíritus servidores con la misión de asistir a los que han de heredar la salvación?',NULL,2),
 ('Colosenses 1, 16','Porque en él fueron creadas todas las cosas, en los cielos y en la tierra, las visibles y las invisibles.','Todo, también el mundo angélico, ha sido creado por Cristo y para Cristo.',3)
) v(c,p,k,o) where c.slug='santos-arcangeles-33-dias' and d.day_number=1;

insert into public.doctrinal_references (day_id, reference_type, author, work, reference, excerpt, sort_order)
select d.id, v.t, v.a, v.w, v.r, v.e, v.o from public.consecration_days d join public.consecrations c on c.id=d.consecration_id,
(values
 ('catechism',NULL,'Catecismo de la Iglesia Católica','CIC 328','La existencia de los seres espirituales, no corporales, que la Sagrada Escritura llama habitualmente ángeles, es una verdad de fe.',1),
 ('church_father','San Agustín','Enarrationes in Psalmos','citado en CIC 329','"Ángel" designa la función, no la naturaleza. ¿Preguntas cómo se llama esa naturaleza? Espíritu. ¿Preguntas por su función? Ángel: por lo que es, espíritu; por lo que hace, ángel.',2),
 ('catechism',NULL,'Catecismo de la Iglesia Católica','CIC 331','Cristo es el centro del mundo angélico. Son sus ángeles: han sido creados por Él y para Él.',3)
) v(t,a,w,r,e,o) where c.slug='santos-arcangeles-33-dias' and d.day_number=1;

insert into public.examination_questions (day_id, question, sort_order)
select d.id, v.q, v.o from public.consecration_days d join public.consecrations c on c.id=d.consecration_id,
(values
 ('¿Quién ocupa realmente el primer lugar en mi corazón?',1),
 ('¿Reconozco a Dios como Señor de mi vida en mis decisiones diarias?',2),
 ('¿Busco protección y seguridad en Dios o en cosas que no pueden dármela?',3),
 ('¿Doy tiempo cada día a la adoración y al silencio?',4)
) v(q,o) where c.slug='santos-arcangeles-33-dias' and d.day_number=1;

insert into public.prayers (consecration_id, slug, kind, title, body, response, sort_order)
select c.id, v.s, v.k, v.t, v.b, v.r, v.o from public.consecrations c,
(values
 ('senal-de-la-cruz','opening','Señal de la Cruz','En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',NULL,1),
 ('acto-de-contricion','opening','Acto de Contrición','Jesús, mi Señor y Redentor, yo me arrepiento de todos los pecados que he cometido hasta hoy, y me pesa de todo corazón, porque con ellos ofendí a un Dios tan bueno. Propongo firmemente no volver a pecar y confío en que, por tu infinita misericordia, me concederás el perdón de mis culpas y me llevarás a la vida eterna. Amén.',NULL,2),
 ('credo','opening','Credo','Creo en Dios, Padre todopoderoso, Creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo, nació de santa María Virgen, padeció bajo el poder de Poncio Pilato, fue crucificado, muerto y sepultado, descendió a los infiernos, al tercer día resucitó de entre los muertos, subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',NULL,3),
 ('padre-nuestro','opening','Padre Nuestro','Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',NULL,4),
 ('ave-maria','opening','Ave María','Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',NULL,5),
 ('gloria','opening','Gloria','Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',NULL,6),
 ('oracion-inicial-san-miguel','opening','Oración inicial a San Miguel','Glorioso San Miguel Arcángel, príncipe de la milicia celestial, tú que proclamas sin cesar "¿Quién como Dios?", alcánzanos la gracia de reconocer que solo Dios es Dios. Acompáñanos en esta oración para que, protegidos por tu intercesión, vivamos fielmente unidos a Jesucristo. Amén.',NULL,7),
 ('invocacion-cuenta','bead','Invocación de cada cuenta','¿Quién como Dios?','¡Nadie como Dios!',8),
 ('gloria-grupo','group_end','Gloria al final de cada grupo','Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',NULL,9),
 ('invocacion-final-triple','closing','Invocación final (tres veces)','San Miguel Arcángel, con tu luz ilumínanos, con tus alas protégenos y con tu espada defiéndenos.',NULL,10),
 ('peregrinos','closing','Miserables peregrinos','Miserables peregrinos en la tierra, pero somos tus devotos, oh glorioso San Miguel Arcángel, ruega por nosotros.','Para que seamos dignos de alcanzar las divinas gracias de Nuestro Señor Jesucristo. Amén.',11),
 ('oracion-final','closing','Oración final','Oh Señor, que la poderosa intercesión del Arcángel San Miguel nos proteja siempre de todo mal y peligro y nos conduzca a la vida eterna. Por Jesucristo nuestro Señor. Amén.',NULL,12)
) v(s,k,t,b,r,o) where c.slug='santos-arcangeles-33-dias';

insert into public.resources (consecration_id, category, title, summary, body, sort_order)
select c.id, v.cat, v.t, v.s, v.b, v.o from public.consecrations c,
(values
 ('oraciones','Oración a San Miguel Arcángel (León XIII)','Oración tradicional de la Iglesia','San Miguel Arcángel, defiéndenos en la batalla. Sé nuestro amparo contra la perversidad y asechanzas del demonio. Reprímale Dios, pedimos suplicantes, y tú, Príncipe de la Milicia Celestial, arroja al infierno con el divino poder a Satanás y a los otros espíritus malignos que andan dispersos por el mundo para la perdición de las almas. Amén.',1),
 ('oraciones','Ángel de mi guarda','Oración sencilla y tradicional','Ángel de mi guarda, dulce compañía, no me desampares ni de noche ni de día. No me dejes solo, que me perdería. Amén.',2),
 ('san-miguel','¿Quién como Dios?','El sentido del nombre de San Miguel','El nombre "Miguel" (Mi-ka-El) significa "¿Quién como Dios?". Es una pregunta que es al mismo tiempo una profesión de fe: nadie es como Dios. Toda la espiritualidad de esta consagración nace de esa afirmación.',3),
 ('san-gabriel','Gabriel, mensajero de Dios','Palabra, anuncio y obediencia','San Gabriel aparece en la Escritura como el mensajero que anuncia el designio de Dios (Dn 8-9; Lc 1). Su figura nos enseña a escuchar la Palabra y a responder con la obediencia de la fe.',4),
 ('san-rafael','Rafael, Dios sana','Acompañante en el camino','El nombre "Rafael" significa "Dios sana". En el libro de Tobías acompaña al joven Tobías en su camino y es instrumento de la Providencia para la sanación y la familia.',5),
 ('biblia','Textos bíblicos sobre los ángeles','Para leer con la Sagrada Escritura en la mano','Gn 28,12; Ex 23,20; Sal 91 (90); Sal 103 (102),20; Dn 10; Tb 5-12; Lc 1,26-38; Hch 12,7-11; Hb 1,14; Ap 12,7-9.',6),
 ('combate-espiritual','La armadura de Dios','Ef 6,10-18','San Pablo describe la armadura del cristiano: la verdad, la justicia, el celo por el Evangelio de la paz, la fe, la salvación y la Palabra de Dios. Se recomienda leer y meditar el texto completo.',7),
 ('vida-sacramental','La Confesión y la Eucaristía','Fuente del combate espiritual','Ninguna consagración sustituye los sacramentos. Se recomienda vivamente celebrar el sacramento de la Reconciliación al comenzar y participar de la Santa Misa durante el camino.',8),
 ('maria','María, Reina de los Ángeles','Con María hacia Jesús','La Iglesia invoca a la Virgen María como Reina de los Ángeles. Ella nos enseña el "hágase" que los ángeles viven en plenitud.',9),
 ('formacion','El Catecismo sobre los ángeles','CIC 325-336','Se recomienda leer los números 325 a 336 del Catecismo de la Iglesia Católica para una comprensión fiel de la doctrina sobre los ángeles.',10)
) v(cat,t,s,b,o) where c.slug='santos-arcangeles-33-dias';
