import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  ListMusic,
  Pause,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import sanMiguel from "@/assets/san-miguel-hero.jpg";
import { audioEpisodes, getAudioEpisode } from "@/lib/audio-playlist";

const LAST_EPISODE_KEY = "lvj-audios-last-episode";
const POSITION_PREFIX = "lvj-audios-position-";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function IndependentAudioPlayer({ initialDay }: { initialDay?: number }) {
  const navigate = useNavigate();
  const availableEpisodes = useMemo(() => audioEpisodes.filter((episode) => episode.available), []);
  const fallbackDay = initialDay && getAudioEpisode(initialDay)?.available ? initialDay : 1;
  const [currentDay, setCurrentDay] = useState(fallbackDay);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoNext, setAutoNext] = useState(true);
  const [completed, setCompleted] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const episode = getAudioEpisode(currentDay) ?? availableEpisodes[0];
  const currentIndex = availableEpisodes.findIndex((item) => item.day === currentDay);

  useEffect(() => {
    if (!initialDay) {
      const savedDay = Number(window.localStorage.getItem(LAST_EPISODE_KEY));
      if (getAudioEpisode(savedDay)?.available) setCurrentDay(savedDay);
    }
    const savedCompleted = window.localStorage.getItem("lvj-audios-completed");
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted) as number[]);
  }, [initialDay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    window.localStorage.setItem(LAST_EPISODE_KEY, String(currentDay));
    void navigate({
      to: "/audios/$dayNumber",
      params: { dayNumber: String(currentDay) },
      replace: true,
    });
  }, [currentDay, navigate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed]);

  const selectEpisode = (day: number) => {
    if (!getAudioEpisode(day)?.available) return;
    setCurrentDay(day);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) await audio.play();
    else audio.pause();
  };

  const shareEpisode = async () => {
    const url = `${window.location.origin}/audios/${episode.day}`;
    const shareData = {
      title: `Día ${episode.day} · ${episode.title}`,
      text: `Escucha la enseñanza del Día ${episode.day}: ${episode.title}`,
      url,
    };
    if (navigator.share) await navigator.share(shareData);
    else await navigator.clipboard.writeText(url);
  };

  const goToRelativeEpisode = (offset: number) => {
    const next = availableEpisodes[currentIndex + offset];
    if (next) selectEpisode(next.day);
  };

  return (
    <main className="min-h-dvh bg-[#050e1b] text-[#f8f3e8]">
      <header className="relative overflow-hidden border-b border-[#d6aa52]/20">
        <img
          src={sanMiguel}
          alt="San Miguel Arcángel"
          className="absolute inset-0 size-full object-cover object-[center_20%] opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050e1b_5%,rgba(5,14,27,.76),#050e1b)]" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#e6bd6a]">
              La Voz de Jesús · Enseñanzas
            </p>
            <h1 className="mt-1 font-display text-2xl text-[#f2d48d] sm:text-3xl">
              33 días con los Santos Arcángeles
            </h1>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[#d6aa52]/40 bg-[#07182b]/70 px-4 text-sm text-[#f8f3e8] backdrop-blur transition hover:border-[#e6bd6a]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Ir a la aplicación</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(330px,.65fr)] lg:py-10">
        <section className="overflow-hidden rounded-[2rem] border border-[#d6aa52]/25 bg-[linear-gradient(160deg,#102b49,#07182b_70%)] shadow-2xl shadow-black/30">
          <div className="relative min-h-52 overflow-hidden px-6 py-8 sm:min-h-64 sm:px-9">
            <img
              src={sanMiguel}
              alt=""
              aria-hidden
              className="absolute inset-0 size-full object-cover object-[center_23%] opacity-35"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#07182b_8%,rgba(7,24,43,.78),rgba(7,24,43,.34))]" />
            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e6bd6a]/35 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f2d48d]">
                <Headphones className="size-4" aria-hidden /> Día {episode.day} de 33
              </span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-white sm:text-5xl">
                {episode.title}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#e8e4dc]/85 sm:text-base">
                {episode.summary}
              </p>
            </div>
          </div>

          <div className="border-t border-[#d6aa52]/15 bg-[#061426]/88 px-5 py-6 sm:px-8">
            <audio
              ref={audioRef}
              src={episode.audioUrl}
              preload="metadata"
              onLoadedMetadata={(event) => {
                const audio = event.currentTarget;
                const saved = Number(
                  window.localStorage.getItem(`${POSITION_PREFIX}${currentDay}`),
                );
                if (saved > 0 && saved < audio.duration - 5) audio.currentTime = saved;
                setDuration(audio.duration);
                setPosition(audio.currentTime);
                audio.playbackRate = speed;
              }}
              onTimeUpdate={(event) => {
                const current = event.currentTarget.currentTime;
                setPosition(current);
                window.localStorage.setItem(`${POSITION_PREFIX}${currentDay}`, String(current));
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => {
                const nextCompleted = Array.from(new Set([...completed, currentDay]));
                setCompleted(nextCompleted);
                window.localStorage.setItem("lvj-audios-completed", JSON.stringify(nextCompleted));
                if (autoNext) goToRelativeEpisode(1);
              }}
            />

            <div className="flex items-center gap-3">
              <span className="w-10 text-xs tabular-nums text-[#b7c1ce]">
                {formatTime(position)}
              </span>
              <input
                aria-label="Progreso del audio"
                type="range"
                min={0}
                max={duration || 0}
                value={Math.min(position, duration || 0)}
                onChange={(event) => {
                  const nextPosition = Number(event.target.value);
                  if (audioRef.current) audioRef.current.currentTime = nextPosition;
                  setPosition(nextPosition);
                }}
                className="h-2 flex-1 cursor-pointer accent-[#d6aa52]"
              />
              <span className="w-10 text-right text-xs tabular-nums text-[#b7c1ce]">
                {formatTime(duration)}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToRelativeEpisode(-1)}
                disabled={currentIndex <= 0}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-[#e6bd6a] disabled:opacity-30"
                aria-label="Episodio anterior"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime = Math.max(0, position - 15);
                }}
                className="grid size-11 place-items-center rounded-full text-[#d9e0e8] hover:bg-white/5"
                aria-label="Retroceder 15 segundos"
              >
                <RotateCcw className="size-5" />
              </button>
              <button
                type="button"
                onClick={togglePlayback}
                className="grid size-16 place-items-center rounded-full bg-[linear-gradient(180deg,#f0d58e,#bd8429)] text-[#061426] shadow-lg shadow-[#d6aa52]/15 transition hover:scale-105"
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <Pause className="size-7 fill-current" />
                ) : (
                  <Play className="ml-1 size-7 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setSpeed((current) => (current >= 1.5 ? 0.75 : current + 0.25))}
                className="grid size-11 place-items-center rounded-full text-xs font-bold text-[#f2d48d] hover:bg-white/5"
                aria-label="Cambiar velocidad de reproducción"
              >
                {speed}×
              </button>
              <button
                type="button"
                onClick={() => goToRelativeEpisode(1)}
                disabled={currentIndex >= availableEpisodes.length - 1}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-[#e6bd6a] disabled:opacity-30"
                aria-label="Episodio siguiente"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={shareEpisode}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d6aa52]/35 bg-[#d6aa52]/8 px-4 text-sm font-semibold text-[#f2d48d] transition hover:bg-[#d6aa52]/15"
              >
                <Share2 className="size-4" /> Compartir este día
              </button>
              <a
                href={`/dia/${episode.day}`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f1d68f] px-4 text-center text-sm font-bold text-[#061426] transition hover:brightness-105"
              >
                Realizar el recorrido en la app
              </a>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 text-xs text-[#b7c1ce]">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={(event) => setAutoNext(event.target.checked)}
                className="accent-[#d6aa52]"
              />
              Reproducir automáticamente el siguiente audio
            </label>
          </div>
        </section>

        <aside className="overflow-hidden rounded-[2rem] border border-[#d6aa52]/20 bg-[#07182b] shadow-xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-[#d6aa52]/15 px-5 py-5">
            <div>
              <p className="flex items-center gap-2 font-display text-xl text-[#f2d48d]">
                <ListMusic className="size-5" /> Playlist espiritual
              </p>
              <p className="mt-1 text-xs text-[#9eacbc]">
                {availableEpisodes.length} enseñanzas disponibles
              </p>
            </div>
          </div>
          <div className="max-h-[720px] overflow-y-auto p-3">
            {audioEpisodes.map((item) => (
              <button
                key={item.day}
                type="button"
                disabled={!item.available}
                onClick={() => selectEpisode(item.day)}
                className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                  item.day === currentDay
                    ? "border-[#d6aa52]/55 bg-[#d6aa52]/12"
                    : "border-transparent hover:border-white/10 hover:bg-white/[.035]"
                } disabled:cursor-default disabled:opacity-45`}
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${
                    item.day === currentDay
                      ? "bg-[#d6aa52] text-[#061426]"
                      : "border border-white/10 text-[#c4ced9]"
                  }`}
                >
                  {completed.includes(item.day) ? <Check className="size-4" /> : item.day}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#f6f1e8]">
                    {item.title}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[11px] text-[#9eacbc]">
                    {item.available ? (
                      <>
                        <Clock3 className="size-3" /> Escuchar enseñanza
                      </>
                    ) : (
                      "Próximamente"
                    )}
                  </span>
                </span>
                {item.available &&
                  (item.day === currentDay && isPlaying ? (
                    <Pause className="size-4 text-[#e6bd6a]" />
                  ) : (
                    <Play className="size-4 text-[#e6bd6a]" />
                  ))}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="border-t border-[#d6aa52]/15 px-5 py-8 text-center">
        <p className="mx-auto max-w-2xl text-sm leading-6 text-[#aeb9c6]">
          Este reproductor permite escuchar las enseñanzas. Para completar cada día de la
          Consagración, realiza todas las secciones del recorrido espiritual en la aplicación.
        </p>
        <p className="mt-4 font-display text-sm uppercase tracking-[0.17em] text-[#e6bd6a]">
          ¿Quién como Dios? ¡Nadie como Dios!
        </p>
      </footer>
    </main>
  );
}
