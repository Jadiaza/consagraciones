import { createFileRoute, notFound } from "@tanstack/react-router";

import { IndependentAudioPlayer } from "@/components/app/IndependentAudioPlayer";
import { getAudioEpisode } from "@/lib/audio-playlist";

export const Route = createFileRoute("/audios/$dayNumber")({
  beforeLoad: ({ params }) => {
    const day = Number(params.dayNumber);
    const episode = getAudioEpisode(day);
    if (!episode?.available) throw notFound();
    return { day, episode };
  },
  head: ({ match }) => {
    const { day, episode } = match.context;
    return {
      meta: [
        { title: `Día ${day} · ${episode.title}` },
        { name: "description", content: episode.summary },
        { property: "og:title", content: `Día ${day} · ${episode.title}` },
        { property: "og:description", content: episode.summary },
      ],
    };
  },
  component: EpisodePage,
});

function EpisodePage() {
  const { day } = Route.useRouteContext();
  return <IndependentAudioPlayer initialDay={day} />;
}
