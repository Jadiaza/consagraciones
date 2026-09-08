alter table public.consecration_days
  add column if not exists playlist_summary text;

comment on column public.consecration_days.playlist_summary is
  'Resumen pastoral breve mostrado en la playlist independiente de audios.';

update public.consecration_days
set playlist_summary = case day_number
  when 1 then 'En este primer día conoceremos quiénes son verdaderamente los ángeles y cuál es su lugar dentro de la creación. Descubriremos que toda auténtica devoción angélica debe conducirnos a Dios, tener a Jesucristo como centro y despertar en nosotros una vida de adoración, obediencia y servicio.'
  when 2 then 'Nos acercaremos a San Miguel desde la Sagrada Escritura para descubrir su misión al servicio de Dios y en defensa de su pueblo. Su verdadera grandeza no está en un poder independiente, sino en su fidelidad al Señor y en permanecer enteramente bajo su autoridad.'
  when 3 then 'Contemplaremos la misión de San Miguel como expresión de su total orientación hacia Dios. Su fidelidad nos enseñará que la fortaleza espiritual nace de amar al Señor, escuchar su voluntad y poner nuestros dones al servicio del bien.'
  when 4 then 'Toda la creación encuentra su sentido último en la gloria de Dios. En esta enseñanza aprenderemos que glorificar al Señor es reconocer su grandeza y permitir que nuestra vida refleje su bondad, su verdad y su santidad.'
  when 5 then 'Los santos ángeles permanecen ante Dios en adoración y, al mismo tiempo, sirven fielmente sus designios. Su ejemplo nos ayudará a comprender que la verdadera adoración transforma la vida y nos dispone a obedecer y servir con humildad.'
  when 6 then 'Amar a Dios nos conduce a buscar y cumplir su voluntad. Hoy aprenderemos a discernirla sin miedo ni supersticiones, confiando en que el Señor nos guía mediante su Palabra, la enseñanza de la Iglesia, la oración y una conciencia bien formada.'
  when 7 then 'La presencia del Ángel de la Guarda es una expresión del cuidado providente de Dios. Conoceremos su misión y aprenderemos a acoger su custodia con gratitud, sin sustituir nuestra libertad, nuestra responsabilidad ni nuestra relación personal con el Señor.'
  when 8 then 'Comenzamos una nueva etapa de conversión y purificación. Hoy reconoceremos aquello que nos aparta de Dios, dejaremos de justificarlo y abriremos el corazón a la gracia para dar un primer paso concreto hacia una vida nueva.'
  when 9 then 'Algunas ataduras interiores no desaparecen solamente porque las reconozcamos. Descubriremos cómo los hábitos, resentimientos, dependencias y afectos desordenados pueden limitar nuestra libertad, y cómo abrirnos a la gracia de Cristo para comenzar un camino verdadero de sanación y liberación.'
  when 10 then 'El orgullo puede ocultarse en la autosuficiencia, la resistencia a la corrección y la dificultad para pedir ayuda. Hoy permitiremos que Dios ilumine estas actitudes y nos enseñe a caminar con humildad, reconociendo que necesitamos su gracia.'
  when 11 then 'La mentira también puede aparecer como excusa, apariencia o autoengaño. En esta enseñanza dejaremos que la verdad de Dios ilumine nuestro interior, para reconocer con sinceridad aquello que necesita cambiar y caminar en la libertad de Cristo.'
  when 12 then 'Dios desea llevar la verdad hasta lo más profundo de nuestro corazón. Hoy pondremos ante Él nuestros deseos, afectos e intenciones, pidiéndole que los purifique y los ordene para que podamos amar con mayor libertad y rectitud.'
  when 13 then 'Después de reconocer lo que necesita cambiar, llega el momento de responder. Aprenderemos que la humildad escucha y la obediencia actúa, dando un paso concreto ante aquello que Dios ya nos ha mostrado durante este camino de conversión.'
  else playlist_summary
end
where day_number between 1 and 13
  and nullif(btrim(playlist_summary), '') is null;
