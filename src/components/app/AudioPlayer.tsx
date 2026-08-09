import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const SPEEDS = [0.75, 1, 1.25, 1.5];

function format(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  subtitle,
  initialPosition = 0,
  onPosition,
}: {
  src: string | null;
  title: string;
  subtitle?: string;
  initialPosition?: number;
  onPosition?: (seconds: number) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed]);

  if (!src) {
    return (
      <div className="surface-sacred rounded-2xl p-4">
        <p className="font-display text-sm">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        <p className="mt-3 text-sm text-muted-foreground">
          El audio de este día aún no está disponible. Se publicará desde el repositorio multimedia.
        </p>
      </div>
    );
  }

  const seek = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta));
  };

  return (
    <div className="surface-sacred rounded-2xl p-4">
      <p className="font-display text-sm">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          setDuration(audio.duration);
          if (initialPosition > 0) audio.currentTime = initialPosition;
        }}
        onTimeUpdate={(e) => {
          const value = e.currentTarget.currentTime;
          setPosition(value);
          onPosition?.(Math.floor(value));
        }}
        onEnded={() => setPlaying(false)}
      />
      <Slider
        className="mt-4"
        value={[position]}
        max={duration || 1}
        step={1}
        aria-label="Progreso del audio"
        onValueChange={([value]) => {
          if (audioRef.current && value !== undefined) audioRef.current.currentTime = value;
        }}
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{format(position)}</span>
        <span>{format(duration)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Retroceder 15 segundos" onClick={() => seek(-15)}>
          <RotateCcw className="size-5" />
        </Button>
        <Button
          size="icon"
          aria-label={playing ? "Pausar" : "Reproducir"}
          className="size-14 rounded-full"
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (playing) {
              audio.pause();
              setPlaying(false);
            } else {
              void audio.play();
              setPlaying(true);
            }
          }}
        >
          {playing ? <Pause className="size-6" /> : <Play className="size-6" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Avanzar 15 segundos" onClick={() => seek(15)}>
          <RotateCw className="size-5" />
        </Button>
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {SPEEDS.map((value) => (
          <Button
            key={value}
            size="sm"
            variant={speed === value ? "default" : "outline"}
            onClick={() => setSpeed(value)}
          >
            {value}×
          </Button>
        ))}
      </div>
    </div>
  );
}