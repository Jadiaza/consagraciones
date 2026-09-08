const SUPABASE_URL = "https://zcfnquusvkrkqjeusmly.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rOQf6vFxEyDYoeMJRsnVUQ_URAGYkzz";

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
  5: "Descubriremos que los ángeles adoran a Dios y cumplen su voluntad con fidelidad, y aprenderemos que la verdadera devoción angélica nos conduce a servir al Señor con humildad, obediencia y amor.",
  6: "Aprenderemos a reconocer, acoger y cumplir la voluntad de Dios, confiando en que sus caminos nos conducen siempre hacia la verdad, la libertad y la plenitud.",
  7: "Reconoceremos la presencia y misión de nuestro Ángel de la Guarda, acogiendo con gratitud el cuidado providente de Dios y aprendiendo a caminar con mayor confianza y docilidad.",
  8: "Iniciaremos una nueva etapa de conversión, reconociendo con sinceridad aquello que debemos abandonar para volver el corazón a Dios y caminar hacia una libertad más plena.",
  9: "Identificaremos las cadenas interiores, hábitos y apegos que limitan nuestra libertad, y abriremos el corazón a la gracia de Cristo, que sana, restaura y fortalece.",
  10: "Aprenderemos a reconocer el orgullo y la autosuficiencia para aceptar con humildad nuestra necesidad de Dios, de su gracia y de la ayuda de los demás.",
  11: "Permitiremos que la verdad de Dios ilumine nuestras excusas, apariencias y autoengaños, para vivir con un corazón sincero y caminar en la libertad de Cristo.",
  12: "Pediremos al Señor pureza de corazón, dejando que ordene nuestros deseos, afectos e intenciones para amar con mayor libertad y buscar sinceramente su voluntad.",
  13: "Comprenderemos que la humildad escucha y la obediencia responde, dando un paso concreto ante aquello que Dios ya nos ha mostrado en este camino de conversión.",
};

function plainText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>`~\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionFromObjective(objective, fallback) {
  const opening = String(objective || "").split(/\n\s*\n|###\s+/)[0];
  return plainText(opening) || fallback;
}

const EMPTY_EPISODES = TITLES.map((title, index) => ({
  day: index + 1,
  title,
  available: false,
  summary:
    SUMMARIES[index + 1] ||
    "La enseñanza de este día estará disponible próximamente como parte del camino espiritual de la Consagración.",
  audioUrl: "",
  mediaAssetId: "",
  durationSeconds: 0,
}));

window.loadAudioEpisodes = async function loadAudioEpisodes() {
  const select = [
    "id",
    "public_url",
    "storage_key",
    "duration_seconds",
    "created_at",
    "consecration_days!inner(day_number,title,playlist_summary,objective,status)",
  ].join(",");
  const endpoint = new URL(`${SUPABASE_URL}/rest/v1/media_assets`);
  endpoint.searchParams.set("select", select);
  endpoint.searchParams.set("asset_type", "eq.podcast");
  endpoint.searchParams.set("consecration_days.status", "eq.published");
  endpoint.searchParams.set("order", "created_at.desc");

  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!response.ok) throw new Error(`No fue posible consultar los audios (${response.status}).`);

  const records = await response.json();
  const publishedByDay = new Map();
  for (const record of records) {
    const day = Number(record.consecration_days?.day_number);
    if (!day || publishedByDay.has(day)) continue;
    const audioUrl = String(record.public_url || "").trim();
    if (!audioUrl) continue;
    publishedByDay.set(day, record);
  }

  return EMPTY_EPISODES.map((episode) => {
    const record = publishedByDay.get(episode.day);
    if (!record) return { ...episode };
    return {
      ...episode,
      title: record.consecration_days?.title || episode.title,
      summary:
        plainText(record.consecration_days?.playlist_summary) ||
        descriptionFromObjective(record.consecration_days?.objective, episode.summary),
      available: true,
      audioUrl: record.public_url,
      mediaAssetId: record.id,
      durationSeconds: Number(record.duration_seconds || 0),
    };
  });
};

window.EMPTY_AUDIO_EPISODES = EMPTY_EPISODES;
