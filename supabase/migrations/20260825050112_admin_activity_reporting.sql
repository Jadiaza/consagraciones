create or replace view public.admin_user_progress_summary
with (security_invoker = true)
as
select
  uc.id as enrollment_id,
  uc.user_id,
  uc.consecration_id,
  coalesce(nullif(p.display_name, ''), nullif(p.full_name, ''), 'Usuario') as user_name,
  p.community,
  c.title as consecration_title,
  c.duration_days,
  uc.start_date,
  uc.expected_end_date,
  uc.current_day,
  uc.status as enrollment_status,
  count(udp.id) filter (where udp.completed) :: integer as completed_days,
  count(udp.id) filter (
    where udp.completed and udp.updated_at >= now() - interval '7 days'
  ) :: integer as completed_last_7d,
  max(udp.updated_at) as last_activity_at,
  least(
    100,
    round(
      100.0 * count(udp.id) filter (where udp.completed)
      / greatest(c.duration_days, 1)
    )
  ) :: integer as progress_percent,
  case
    when uc.status = 'completed'
      or count(udp.id) filter (where udp.completed) >= c.duration_days
      then 'completed'
    when max(udp.updated_at) is null
      or max(udp.updated_at) < now() - interval '7 days'
      then 'inactive'
    when count(udp.id) filter (where udp.completed)
      < least(c.duration_days, greatest(current_date - uc.start_date + 1, 1)) - 2
      then 'behind'
    else 'on_track'
  end as tracking_status
from public.user_consecrations uc
join public.profiles p on p.id = uc.user_id
join public.consecrations c on c.id = uc.consecration_id
left join public.user_day_progress udp on udp.user_consecration_id = uc.id
group by uc.id, p.id, c.id;

revoke all on public.admin_user_progress_summary from public, anon;
grant select on public.admin_user_progress_summary to authenticated, service_role;

create index if not exists user_day_progress_user_activity_idx
on public.user_day_progress(user_id, updated_at desc);

comment on view public.admin_user_progress_summary is
'Resumen paginable de avance por inscripción. Respeta las políticas RLS de sus tablas mediante security_invoker.';
