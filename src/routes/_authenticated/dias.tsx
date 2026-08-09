import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app/AppShell";
import { DayCard, LoadingState, StageCard } from "@/components/app/cards";
import { useAuth } from "@/hooks/useAuth";
import { daysQuery, myConsecrationQuery, myProgressQuery, nextAvailableDay, stagesQuery } from "@/lib/consecration";

export const Route = createFileRoute("/_authenticated/dias")({ component: Dias });

function Dias() {
  const { user } = useAuth();
  const { data: mine } = useQuery(myConsecrationQuery(user?.id));
  const { data: stages, isLoading } = useQuery(stagesQuery(mine?.consecration_id));
  const { data: days } = useQuery(daysQuery(mine?.consecration_id));
  const { data: progress } = useQuery(myProgressQuery(mine?.id));

  const completed = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.day_number));
  const availableThrough = nextAvailableDay(progress);

  return (
    <AppShell title="Los 33 días">
      <p className="text-center text-sm text-muted-foreground">
        Un camino de transformación de la mano de los Arcángeles.
      </p>
      {isLoading && <LoadingState />}
      <div className="mt-5 flex flex-col gap-6">
        {(stages ?? []).map((stage) => (
          <section key={stage.id}>
            <StageCard
              stageNumber={stage.stage_number}
              title={stage.title}
              motto={stage.motto}
              startDay={stage.start_day}
              endDay={stage.end_day}
              completedDays={
                (days ?? []).filter((d) => d.stage_id === stage.id && completed.has(d.day_number))
                  .length
              }
              locked={stage.start_day > availableThrough}
            />
            <div className="mt-2 flex flex-col gap-2">
              {(days ?? [])
                .filter((d) => d.stage_id === stage.id)
                .map((day) => (
                  <DayCard
                    key={day.id}
                    dayNumber={day.day_number}
                    title={day.title}
                    completed={completed.has(day.day_number)}
                    available={day.day_number <= availableThrough}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
