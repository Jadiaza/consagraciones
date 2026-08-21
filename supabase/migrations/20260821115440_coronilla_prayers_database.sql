insert into public.prayers (consecration_id, slug, kind, title, body, response, sort_order)
select
  c.id,
  'oracion-inicio-ronda',
  'group_start',
  'Oración de inicio de cada ronda',
  'San Miguel Arcángel, defiéndenos en la pelea. Sé nuestro amparo y refugio contra las asechanzas del demonio. ¡Reprímele, oh Dios, con voz imperiosa, como rendidamente te lo suplicamos! Y tú, Príncipe de las Milicias Celestiales, armado del poder divino, precipita al infierno a Satanás y a todos los espíritus malignos que, para la perdición de las almas, vagan por el mundo. Amén.',
  null,
  8
from public.consecrations c
where c.slug = 'santos-arcangeles-33-dias'
on conflict (consecration_id, slug) do update
set
  kind = excluded.kind,
  title = excluded.title,
  body = excluded.body,
  response = excluded.response,
  sort_order = excluded.sort_order;
