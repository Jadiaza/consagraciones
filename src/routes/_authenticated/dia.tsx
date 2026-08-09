import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dia")({
  beforeLoad: () => {
    throw redirect({
      to: "/dia/$dayNumber",
      params: { dayNumber: "1" },
      replace: true,
    });
  },
});
