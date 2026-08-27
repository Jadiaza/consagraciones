import { ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import angeles from "@/assets/angeles.jpg";
import { stagesQuery } from "@/lib/consecration";

export const Route = createFileRoute("/conocer")({
  head: () => ({
    meta: [
      { title: "Conoce la consagración · 33 días a los Santos Arcángeles" },
      {
        name: "description",
        content:
          "Conoce el sentido y las cinco etapas del camino de consagración de 33 días a los Santos Arcángeles.",
      },
    ],
  }),
  component: ConocerConsagracion,
});

const fallbackChapters = [
  {
    number: "I",
    days: "Días 1–7",
    title: "Conocer a Dios y el mundo angélico",
    motto: "Todo comienza en Dios",
    purpose:
      "Reconocer que solo Dios es Dios y comprender, a la luz de la fe de la Iglesia, quiénes son los ángeles y cómo su misión nos conduce siempre a Él.",
  },
  {
    number: "II",
    days: "Días 8–14",
    title: "Conversión y purificación",
    motto: "Un corazón nuevo",
    purpose:
      "Examinar la propia vida, renunciar al pecado y abrir el corazón a la gracia que sana, libera y dispone para una entrega sincera a Jesucristo.",
  },
  {
    number: "III",
    days: "Días 15–21",
    title: "El combate espiritual",
    motto: "Revestíos de la armadura de Dios",
    purpose:
      "Aprender a reconocer y enfrentar el mal con las armas de la fe, sostenidos por la victoria de Cristo y acompañados por san Miguel Arcángel.",
  },
  {
    number: "IV",
    days: "Días 22–28",
    title: "Vida de santidad",
    motto: "Vivir para la gloria de Dios",
    purpose:
      "Cultivar una vida de oración, adoración, caridad y servicio que haga visible la presencia de Dios en la familia y en la vida cotidiana.",
  },
  {
    number: "V",
    days: "Días 29–33",
    title: "Consagración y misión",
    motto: "Enviados a servir",
    purpose:
      "Preparar la entrega final y asumir la misión de defender la fe, servir a la Iglesia y vivir plenamente bajo el señorío de Jesucristo.",
  },
] as const;

function ConocerConsagracion() {
  const stages = useQuery(stagesQuery());
  const chapters = fallbackChapters.map((fallback) => {
    const stage = stages.data?.find((item) => item.stage_number === romanToNumber(fallback.number));
    return {
      ...fallback,
      days: stage ? `Días ${stage.start_day}–${stage.end_day}` : fallback.days,
      title: stage?.title || fallback.title,
      motto: stage?.motto || fallback.motto,
      purpose: stage?.description || fallback.purpose,
    };
  });

  return (
    <main className="min-h-dvh bg-[#f7f2e7] text-[#172238]">
      <header className="relative isolate overflow-hidden bg-[#061426] text-[#f7f2e7]">
        <img
          src={angeles}
          alt="Los Santos Arcángeles"
          className="absolute inset-0 -z-20 size-full object-cover object-center opacity-30"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(6,20,38,.25),#061426_92%)]"
          aria-hidden
        />
        <div className="mx-auto max-w-3xl px-5 pb-12 pt-[calc(20px+env(safe-area-inset-top))] sm:px-8 sm:pb-16">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-[#f7f2e7]/80 transition hover:text-[#e4bd68] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#f5d991]"
          >
            <ArrowLeft className="size-4" aria-hidden /> Volver
          </Link>
          <div className="mt-12 max-w-2xl sm:mt-20">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e4bd68]">
              Un camino de 33 días
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Conoce la consagración
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#f7f2e7]/80 sm:text-lg">
              No es solo una serie de lecturas y oraciones. Es un itinerario espiritual que avanza
              en cinco capítulos: de conocer a Dios a entregarle la vida y salir a servir.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="recorrido">
        <div className="max-w-2xl">
          <p className="font-display text-lg text-[#a66f20]">¿Qué persigue este camino?</p>
          <h2 id="recorrido" className="mt-2 font-display text-3xl text-[#172238]">
            Un recorrido con propósito
          </h2>
          <p className="mt-4 leading-7 text-[#465064]">
            Cada capítulo prepara el siguiente. La meta no son los arcángeles en sí mismos, sino
            una vida más profundamente unida y consagrada a Jesucristo, acompañada por san Miguel,
            san Gabriel y san Rafael.
          </p>
        </div>

        <ol className="mt-10 space-y-4">
          {chapters.map((chapter) => (
            <li
              key={chapter.number}
              className="rounded-2xl border border-[#d8c6a4]/70 bg-white/80 p-5 shadow-[0_8px_28px_rgba(77,57,28,.07)] sm:p-7"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0b2442] font-display text-lg text-[#e4bd68]">
                  {chapter.number}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a66f20]">
                    {chapter.days}
                  </p>
                  <h3 className="mt-1 font-display text-xl leading-snug sm:text-2xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-1 text-sm italic text-[#7b6440]">{chapter.motto}</p>
                  <p className="mt-3 whitespace-pre-line leading-7 text-[#465064]">
                    {chapter.purpose}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl bg-[#061426] px-6 py-8 text-center text-[#f7f2e7] sm:px-10">
          <p className="font-display text-2xl">¿Quién como Dios?</p>
          <p className="mt-2 text-sm leading-6 text-[#f7f2e7]/70">
            Comienza este camino de fe, conversión, combate espiritual, santidad y misión.
          </p>
          <Link
            to="/auth"
            search={{ modo: "registro" }}
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(180deg,#e4bd68,#b98227)] px-6 text-sm font-semibold text-[#061426] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d991]"
          >
            Comenzar mi consagración <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}

function romanToNumber(value: (typeof fallbackChapters)[number]["number"]) {
  return fallbackChapters.findIndex((chapter) => chapter.number === value) + 1;
}
