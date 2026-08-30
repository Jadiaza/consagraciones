const episodes = window.AUDIO_EPISODES;
const available = episodes.filter((episode) => episode.available);
const audio = document.querySelector("#audio");
const playlist = document.querySelector("#playlist");
const playButton = document.querySelector("#play");
const progress = document.querySelector("#progress");
const currentTime = document.querySelector("#current-time");
const duration = document.querySelector("#duration");
const speedButton = document.querySelector("#speed");
const notice = document.querySelector("#notice");
const speeds = [0.75, 1, 1.25, 1.5];
let speedIndex = 1;
let completed = JSON.parse(localStorage.getItem("lvj-audios-completed") || "[]");

const requestedDay = Number(new URLSearchParams(location.search).get("dia"));
const savedDay = Number(localStorage.getItem("lvj-audios-last-episode"));
let currentDay = episodes.find((episode) => episode.day === requestedDay && episode.available)
  ? requestedDay
  : episodes.find((episode) => episode.day === savedDay && episode.available)
    ? savedDay
    : 1;

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
}

function flash(message) {
  notice.textContent = message;
  notice.classList.add("show");
  window.setTimeout(() => notice.classList.remove("show"), 2400);
}

function renderPlaylist() {
  playlist.innerHTML = "";
  for (const episode of episodes) {
    const button = document.createElement("button");
    button.className = `episode-row${episode.day === currentDay ? " active" : ""}`;
    button.disabled = !episode.available;
    button.innerHTML = `
      <span class="episode-number">${completed.includes(episode.day) ? "✓" : episode.day}</span>
      <span class="episode-details">
        <strong>${episode.title}</strong>
        <small>${episode.available ? "Escuchar enseñanza" : "Próximamente"}</small>
      </span>
      ${episode.available ? '<span class="row-play">▶</span>' : ""}
    `;
    if (episode.available) button.addEventListener("click", () => selectEpisode(episode.day));
    playlist.append(button);
  }
}

function selectEpisode(day, autoplay = false) {
  const episode = episodes.find((item) => item.day === day && item.available);
  if (!episode) return;
  currentDay = day;
  localStorage.setItem("lvj-audios-last-episode", String(day));
  document.querySelector("#day-pill").textContent = `Día ${day} de 33`;
  document.querySelector("#episode-title").textContent = episode.title;
  document.querySelector("#episode-summary").textContent = episode.summary;
  document.querySelector("#daily-route").href = `https://consagraciones.vercel.app/dia/${day}`;
  audio.src = episode.audioUrl;
  audio.load();
  history.replaceState({}, "", `${location.pathname}?dia=${day}`);
  renderPlaylist();
  if (autoplay) audio.play().catch(() => {});
}

audio.addEventListener("loadedmetadata", () => {
  const saved = Number(localStorage.getItem(`lvj-audios-position-${currentDay}`));
  if (saved > 0 && saved < audio.duration - 5) audio.currentTime = saved;
  progress.max = String(audio.duration);
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progress.value = String(audio.currentTime);
  currentTime.textContent = formatTime(audio.currentTime);
  localStorage.setItem(`lvj-audios-position-${currentDay}`, String(audio.currentTime));
});

audio.addEventListener("play", () => {
  playButton.textContent = "Ⅱ";
  playButton.setAttribute("aria-label", "Pausar");
});

audio.addEventListener("pause", () => {
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", "Reproducir");
});

audio.addEventListener("ended", () => {
  completed = [...new Set([...completed, currentDay])];
  localStorage.setItem("lvj-audios-completed", JSON.stringify(completed));
  renderPlaylist();
  if (document.querySelector("#auto-next").checked) move(1, true);
});

progress.addEventListener("input", () => {
  audio.currentTime = Number(progress.value);
});

playButton.addEventListener("click", () => {
  if (audio.paused) audio.play().catch(() => flash("No fue posible iniciar el audio."));
  else audio.pause();
});

document.querySelector("#rewind").addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 15);
});

function move(offset, autoplay = false) {
  const index = available.findIndex((episode) => episode.day === currentDay);
  const nextEpisode = available[index + offset];
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

document.querySelector("#available-count").textContent = String(available.length);
selectEpisode(currentDay);
