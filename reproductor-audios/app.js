const TRACKING_ENDPOINT = "https://zcfnquusvkrkqjeusmly.supabase.co/functions/v1/audio-tracking";
const SUPABASE_KEY = "sb_publishable_rOQf6vFxEyDYoeMJRsnVUQ_URAGYkzz";
const SEGMENT_SECONDS = 15;
const REQUIRED_SEGMENT_SECONDS = 12;

let episodes = window.EMPTY_AUDIO_EPISODES;
let available = [];
let sessionToken = localStorage.getItem("lvj-audios-session") || "";
let participantCode = localStorage.getItem("lvj-audios-code-display") || "";
let participant = null;
let serverProgress = new Map();
let completedDays = new Set();
let speedIndex = 1;
let previousMediaTime = 0;
let previousWallTime = 0;
let lastHeartbeatAt = 0;
const segmentListening = new Map();
const pendingSegments = new Set();

const audio = document.querySelector("#audio");
const playlist = document.querySelector("#playlist");
const playButton = document.querySelector("#play");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");
const speedButton = document.querySelector("#speed");
const notice = document.querySelector("#notice");
const accessGate = document.querySelector("#access-gate");
const experience = document.querySelector("#audio-experience");
const accessError = document.querySelector("#access-error");
const identifyForm = document.querySelector("#identify-form");
const resumeForm = document.querySelector("#resume-form");
const listeningPercent = document.querySelector("#listening-percent");
const listeningMessage = document.querySelector("#listening-message");
const listeningMeter = document.querySelector("#listening-meter-value");
const speeds = [0.75, 1, 1.25, 1.5];
const requestedDay = Number(new URLSearchParams(location.search).get("dia"));
const savedDay = Number(localStorage.getItem("lvj-audios-last-episode"));
let currentDay = requestedDay || savedDay || 1;

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

function flash(message) {
  notice.textContent = message;
  notice.classList.add("show");
  window.setTimeout(() => notice.classList.remove("show"), 2400);
}

async function trackingRequest(action, body = {}) {
  const response = await fetch(TRACKING_ENDPOINT, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...body }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || "No fue posible completar la solicitud.");
    error.status = response.status;
    throw error;
  }
  return result;
}

function applyIdentity(data, code = participantCode) {
  sessionToken = data.token || sessionToken;
  participant = data.participant;
  participantCode = code || participantCode;
  serverProgress = new Map((data.progress || []).map((row) => [Number(row.day_number), row]));
  completedDays = new Set((data.completedDays || []).map(Number));
  localStorage.setItem("lvj-audios-session", sessionToken);
  if (participantCode) localStorage.setItem("lvj-audios-code-display", participantCode);
  document.querySelector("#participant-name").textContent = participant?.name || "Peregrino";
  document.querySelector("#participant-code").textContent = participantCode
    ? `Código: ${participantCode}`
    : "Acceso personal activo";
  accessGate.hidden = true;
  experience.hidden = false;
}

function isDayUnlocked(day) {
  if (day === 1) return true;
  for (let previous = 1; previous < day; previous += 1) {
    if (!completedDays.has(previous)) return false;
  }
  return true;
}

function renderPlaylist() {
  playlist.innerHTML = "";
  for (const episode of episodes) {
    const unlocked = isDayUnlocked(episode.day);
    const done = completedDays.has(episode.day);
    const button = document.createElement("button");
    button.className = `episode-row${episode.day === currentDay ? " active" : ""}`;
    button.disabled = !episode.available || !unlocked;
    const number = document.createElement("span");
    number.className = "episode-number";
    number.textContent = done ? "✓" : String(episode.day);
    const details = document.createElement("span");
    details.className = "episode-details";
    const title = document.createElement("strong");
    title.textContent = episode.title;
    const state = document.createElement("small");
    state.textContent = !episode.available
      ? "Próximamente"
      : !unlocked
        ? "Completa el día anterior"
        : done
          ? "Cumplido mediante audio"
          : "Escuchar enseñanza";
    details.append(title, state);
    button.append(number, details);
    if (episode.available && unlocked) {
      const icon = document.createElement("span");
      icon.className = "row-play";
      icon.textContent = "▶";
      button.append(icon);
      button.addEventListener("click", () => selectEpisode(episode.day));
    }
    playlist.append(button);
  }
}

function updateListeningStatus() {
  const row = serverProgress.get(currentDay);
  const percent = Number(row?.listened_percent || 0);
  listeningPercent.textContent = `${Math.round(percent)} % escuchado`;
  listeningMeter.style.width = `${Math.min(100, percent)}%`;
  listeningMessage.textContent =
    row?.status === "completed"
      ? "Día cumplido mediante audio. El siguiente día está habilitado."
      : "El día se cumple al escuchar al menos el 85 %.";
}

async function refreshEpisodes({ preserveSelection = true } = {}) {
  try {
    const freshEpisodes = await window.loadAudioEpisodes();
    const changed = JSON.stringify(freshEpisodes) !== JSON.stringify(episodes);
    episodes = freshEpisodes;
    available = episodes.filter((episode) => episode.available);
    document.querySelector("#available-count").textContent = String(available.length);
    if (participant && !preserveSelection) {
      const requestedEpisode = available.find(
        (episode) => episode.day === requestedDay && isDayUnlocked(episode.day),
      );
      const savedEpisode = available.find(
        (episode) => episode.day === savedDay && isDayUnlocked(episode.day),
      );
      const firstPending = available.find(
        (episode) => isDayUnlocked(episode.day) && !completedDays.has(episode.day),
      );
      currentDay = requestedEpisode?.day || savedEpisode?.day || firstPending?.day || currentDay;
    }
    const selected = episodes.find((episode) => episode.day === currentDay);
    if (!selected?.available || !isDayUnlocked(currentDay)) {
      currentDay = available.filter((episode) => isDayUnlocked(episode.day)).at(-1)?.day || 1;
    }
    if (participant && (!preserveSelection || changed)) selectEpisode(currentDay);
    else renderPlaylist();
  } catch (error) {
    console.error(error);
    renderPlaylist();
    flash("No fue posible actualizar la lista. Intentaremos nuevamente.");
  }
}

function selectEpisode(day, autoplay = false) {
  const episode = episodes.find((item) => item.day === day && item.available);
  if (!episode || !isDayUnlocked(day)) {
    flash("Completa primero los días anteriores.");
    return;
  }
  currentDay = day;
  pendingSegments.clear();
  segmentListening.clear();
  previousMediaTime = 0;
  previousWallTime = 0;
  localStorage.setItem("lvj-audios-last-episode", String(day));
  document.querySelector("#day-pill").textContent = `Día ${day} de 33`;
  document.querySelector("#episode-title").textContent = episode.title;
  document.querySelector("#episode-summary").textContent = episode.summary;
  document.querySelector("#daily-route").href = `https://consagraciones.vercel.app/dia/${day}`;
  audio.src = episode.audioUrl;
  audio.load();
  history.replaceState({}, "", `${location.pathname}?dia=${day}`);
  renderPlaylist();
  updateListeningStatus();
  if (autoplay) audio.play().catch(() => {});
}

async function sendHeartbeat(force = false) {
  if (!sessionToken || !participant || !audio.duration) return;
  if (!force && Date.now() - lastHeartbeatAt < 10_000 && pendingSegments.size === 0) return;
  const episode = episodes.find((item) => item.day === currentDay);
  if (!episode?.mediaAssetId) return;
  const segments = [...pendingSegments];
  pendingSegments.clear();
  lastHeartbeatAt = Date.now();
  try {
    const data = await trackingRequest("heartbeat", {
      token: sessionToken,
      day: currentDay,
      mediaAssetId: episode.mediaAssetId,
      duration: audio.duration,
      position: audio.currentTime,
      segments,
    });
    serverProgress.set(currentDay, data.progress);
    if (data.progress.status === "completed") completedDays.add(currentDay);
    renderPlaylist();
    updateListeningStatus();
  } catch (error) {
    segments.forEach((segment) => pendingSegments.add(segment));
    if (error.status === 401) {
      sessionToken = "";
      localStorage.removeItem("lvj-audios-session");
      audio.pause();
      experience.hidden = true;
      accessGate.hidden = false;
      accessError.textContent = error.message;
    }
  }
}

audio.addEventListener("loadedmetadata", () => {
  const remotePosition = Number(serverProgress.get(currentDay)?.last_position_seconds || 0);
  const localPosition = Number(localStorage.getItem(`lvj-audios-position-${currentDay}`));
  const saved = remotePosition || localPosition;
  if (saved > 0 && saved < audio.duration - 5) audio.currentTime = saved;
  progress.max = String(audio.duration);
  duration.textContent = formatTime(audio.duration);
  updateListeningStatus();
});

audio.addEventListener("timeupdate", () => {
  progress.value = String(audio.currentTime);
  currentTime.textContent = formatTime(audio.currentTime);
  localStorage.setItem(`lvj-audios-position-${currentDay}`, String(audio.currentTime));
  const now = performance.now();
  if (!audio.paused && previousWallTime) {
    const wallDelta = (now - previousWallTime) / 1000;
    const mediaDelta = audio.currentTime - previousMediaTime;
    const valid =
      wallDelta > 0 &&
      wallDelta < 5 &&
      mediaDelta >= 0 &&
      mediaDelta <= wallDelta * audio.playbackRate + 1.5;
    if (valid && mediaDelta > 0) {
      const segment = Math.floor(previousMediaTime / SEGMENT_SECONDS);
      const accumulated = (segmentListening.get(segment) || 0) + mediaDelta;
      segmentListening.set(segment, accumulated);
      if (accumulated >= REQUIRED_SEGMENT_SECONDS) pendingSegments.add(segment);
    }
  }
  previousWallTime = now;
  previousMediaTime = audio.currentTime;
  void sendHeartbeat();
});

audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Pausar");
  previousWallTime = performance.now();
  previousMediaTime = audio.currentTime;
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Reproducir");
  previousWallTime = 0;
  void sendHeartbeat(true);
});

audio.addEventListener("ended", async () => {
  await sendHeartbeat(true);
  if (document.querySelector("#auto-next").checked && completedDays.has(currentDay)) move(1, true);
});

progress.addEventListener("input", () => {
  audio.currentTime = Number(progress.value);
  previousWallTime = 0;
});
playButton.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => flash("No fue posible iniciar el audio."));
  else audio.pause();
});
document.querySelector("#rewind").addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 15);
  previousWallTime = 0;
});

function move(offset, autoplay = false) {
  const navigable = available.filter((episode) => isDayUnlocked(episode.day));
  const index = navigable.findIndex((episode) => episode.day === currentDay);
  const nextEpisode = navigable[index + offset];
  if (nextEpisode) selectEpisode(nextEpisode.day, autoplay);
}

document.querySelector("#previous").addEventListener("click", () => move(-1));
document.querySelector("#next").addEventListener("click", () => move(1));
speedButton.addEventListener("click", () => {
  speedIndex = (speedIndex + 1) % speeds.length;
  audio.playbackRate = speeds[speedIndex];
  speedButton.textContent = `${speeds[speedIndex]}×`;
});

document.querySelector("#share").addEventListener("click", async () => {
  const episode = episodes[currentDay - 1];
  const url = `${location.origin}${location.pathname}?dia=${currentDay}`;
  const data = {
    title: `Día ${currentDay} · ${episode.title}`,
    text: `Escucha la enseñanza del Día ${currentDay}: ${episode.title}`,
    url,
  };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(url);
      flash("Enlace copiado");
    }
  } catch (error) {
    if (error.name !== "AbortError") flash("No fue posible compartir el enlace.");
  }
});

document.querySelector("#toggle-access-mode").addEventListener("click", (event) => {
  const recovering = identifyForm.hidden;
  identifyForm.hidden = !recovering;
  resumeForm.hidden = recovering;
  event.currentTarget.textContent = recovering
    ? "Ya tengo un código de peregrino"
    : "Es mi primera entrada";
  accessError.textContent = "";
});

identifyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  accessError.textContent = "Verificando tu inscripción…";
  const submit = identifyForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const data = await trackingRequest("identify", {
      fullName: document.querySelector("#identity-name").value,
      email: document.querySelector("#identity-email").value,
    });
    applyIdentity(data, data.code);
    await refreshEpisodes({ preserveSelection: false });
    flash(`Guarda tu código: ${data.code}`);
  } catch (error) {
    accessError.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});

resumeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  accessError.textContent = "Recuperando tu avance…";
  const submit = resumeForm.querySelector("button[type='submit']");
  submit.disabled = true;
  try {
    const code = document.querySelector("#resume-code").value.trim().toUpperCase();
    const data = await trackingRequest("resume", {
      email: document.querySelector("#resume-email").value,
      code,
    });
    applyIdentity(data, code);
    await refreshEpisodes({ preserveSelection: false });
  } catch (error) {
    accessError.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});

document.querySelector("#leave-session").addEventListener("click", () => {
  audio.pause();
  sessionToken = "";
  participant = null;
  localStorage.removeItem("lvj-audios-session");
  experience.hidden = true;
  accessGate.hidden = false;
  accessError.textContent = "";
});

await refreshEpisodes({ preserveSelection: false });
if (sessionToken) {
  try {
    const data = await trackingRequest("me", { token: sessionToken });
    applyIdentity(data);
    await refreshEpisodes({ preserveSelection: false });
  } catch {
    localStorage.removeItem("lvj-audios-session");
    sessionToken = "";
    accessGate.hidden = false;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") void refreshEpisodes();
  else void sendHeartbeat(true);
});
window.addEventListener("focus", () => void refreshEpisodes());
window.setInterval(() => void refreshEpisodes(), 60_000);
