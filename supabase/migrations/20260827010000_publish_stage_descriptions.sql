-- Completa la presentación pública de las etapas sin sobrescribir contenido administrado.
update public.consecration_stages as stage
set description = content.description
from public.consecrations as consecration,
  (values
    (1, 'Reconocer que solo Dios es Dios y comprender, a la luz de la fe de la Iglesia, quiénes son los ángeles y cómo su misión nos conduce siempre a Él.'),
    (2, 'Examinar la propia vida, renunciar al pecado y abrir el corazón a la gracia que sana, libera y dispone para una entrega sincera a Jesucristo.'),
    (3, 'Aprender a reconocer y enfrentar el mal con las armas de la fe, sostenidos por la victoria de Cristo y acompañados por san Miguel Arcángel.'),
    (4, 'Cultivar una vida de oración, adoración, caridad y servicio que haga visible la presencia de Dios en la familia y en la vida cotidiana.'),
    (5, 'Preparar la entrega final y asumir la misión de defender la fe, servir a la Iglesia y vivir plenamente bajo el señorío de Jesucristo.')
  ) as content(stage_number, description)
where stage.consecration_id = consecration.id
  and consecration.slug = 'santos-arcangeles-33-dias'
  and stage.stage_number = content.stage_number
  and nullif(btrim(stage.description), '') is null;
