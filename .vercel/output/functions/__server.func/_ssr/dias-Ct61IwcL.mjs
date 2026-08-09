import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as LoadingState, f as StageCard, h as daysQuery, t as DayCard, v as myConsecrationQuery, w as stagesQuery, y as myProgressQuery } from "./cards-DkgcFlMS.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dias-Ct61IwcL.js
var import_jsx_runtime = require_jsx_runtime();
function Dias() {
	const { user } = useAuth();
	const { data: mine } = useQuery(myConsecrationQuery(user?.id));
	const { data: stages, isLoading } = useQuery(stagesQuery(mine?.consecration_id));
	const { data: days } = useQuery(daysQuery(mine?.consecration_id));
	const { data: progress } = useQuery(myProgressQuery(mine?.id));
	const completed = new Set((progress ?? []).filter((p) => p.completed).map((p) => p.day_number));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Los 33 días",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground",
				children: "Un camino de transformación de la mano de los Arcángeles."
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-6",
				children: (stages ?? []).map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageCard, {
					stageNumber: stage.stage_number,
					title: stage.title,
					motto: stage.motto,
					startDay: stage.start_day,
					endDay: stage.end_day,
					completedDays: (days ?? []).filter((d) => d.stage_id === stage.id && completed.has(d.day_number)).length
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-col gap-2",
					children: (days ?? []).filter((d) => d.stage_id === stage.id).map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayCard, {
						dayNumber: day.day_number,
						title: day.title,
						completed: completed.has(day.day_number),
						available: true
					}, day.id))
				})] }, stage.id))
			})
		]
	});
}
//#endregion
export { Dias as component };
