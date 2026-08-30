import { createFileRoute } from "@tanstack/react-router";

import { IndependentAudioPlayer } from "@/components/app/IndependentAudioPlayer";

export const Route = createFileRoute("/audios/")({
  head: () => ({
    meta: [
      { title: "33 días en audio · Santos Arcángeles" },
      {
        name: "description",
        content: "Escucha las enseñanzas de la Consagración de 33 días con los Santos Arcángeles.",
      },
      { property: "og:title", content: "33 días en audio · Santos Arcángeles" },
      {
        property: "og:description",
        content: "Playlist espiritual con las enseñanzas diarias de la Consagración.",
      },
    ],
  }),
  component: () => <IndependentAudioPlayer />,
});
