const AUDIO_BASE =
  "https://pub-d51964240d644bebafa009ba9eae6df4.r2.dev/modulos/consagraciones/san-miguel/podcast";

const TITLES = [
  "¿Quiénes son los ángeles?",
  "San Miguel en la Biblia",
  "Su misión y su amor a Dios",
  "La gloria de Dios",
  "La adoración y el servicio de los ángeles",
  "La voluntad de Dios",
  "Mi Ángel de la Guarda",
  "Renunciar al pecado",
  "Romper cadenas espirituales",
  "Vencer el orgullo",
  "Combatir la mentira",
  "Pureza de corazón",
  "Obediencia y humildad",
  "La confesión como arma espiritual",
  "La guerra espiritual",
  "La armadura de Dios",
  "La victoria de San Miguel sobre el dragón",
  "Discernir tentaciones y engaños",
  "La autoridad del Nombre de Jesús",
  "La Sangre de Cristo",
  "La victoria definitiva",
  "Oración constante",
  "Adoración eucarística",
  "María, Reina de los Ángeles",
  "La caridad que transforma",
  "Servicio humilde",
  "Custodiar la familia",
  "Vivir como ciudadano del Cielo",
  "San Miguel, protector de la Iglesia",
  "Defender la fe en el mundo actual",
  "Vivir bajo el señorío de Jesucristo",
  "Prepararse para el encuentro con Dios",
  "Solemne Consagración a los Tres Arcángeles",
];

const SUMMARIES = {
  1: "Conoceremos quiénes son verdaderamente los ángeles, su lugar dentro de la creación y por qué toda auténtica devoción angélica debe conducirnos hacia Dios y hacia Jesucristo.",
  2: "Recorreremos los pasajes bíblicos que presentan a San Miguel y descubriremos que su verdadera grandeza está en servir fielmente el designio y la autoridad de Dios.",
  3: "Profundizaremos en la misión de San Miguel y aprenderemos que la verdadera fortaleza espiritual nace de permanecer orientados hacia Dios mediante la adoración, la obediencia y el servicio.",
  4: "Comprenderemos que toda la creación encuentra su sentido último en Dios y que glorificarlo significa permitir que nuestra vida refleje su bondad, su verdad y su santidad.",
};

window.AUDIO_EPISODES = TITLES.map((title, index) => {
  const day = index + 1;
  return {
    day,
    title,
    available: day <= 4,
    summary:
      SUMMARIES[day] ||
      "La enseñanza de este día estará disponible próximamente como parte del camino espiritual de la Consagración.",
    audioUrl: `${AUDIO_BASE}/Dia-${String(day).padStart(2, "0")}.mp3`,
  };
});
