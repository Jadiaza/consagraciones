import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { V as CircleDot, Y as BookOpen, b as NotebookPen, j as Heart, l as Sparkles, r as Users } from "../_libs/lucide-react.mjs";
import { C as romanize, a as LoadingState, f as StageCard, h as daysQuery, s as ProgressCard, v as myConsecrationQuery, w as stagesQuery, y as myProgressQuery } from "./cards-DkgcFlMS.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BJ49qm-1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var angeles_default = "/assets/angeles-BzAEL-4z.jpg";
function Dashboard() {
	const navigate = useNavigate();
	const { user, displayName } = useAuth();
	const { data: mine, isLoading } = useQuery(myConsecrationQuery(user?.id));
	const { data: progress } = useQuery(myProgressQuery(mine?.id));
	const { data: days } = useQuery(daysQuery(mine?.consecration_id));
	const { data: stages } = useQuery(stagesQuery(mine?.consecration_id));
	(0, import_react.useEffect)(() => {
		if (!isLoading && user && mine === null) navigate({
			to: "/onboarding",
			replace: true
		});
	}, [
		isLoading,
		mine,
		user,
		navigate
	]);
	if (isLoading || !mine) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}) });
	const completed = (progress ?? []).filter((p) => p.completed).map((p) => p.day_number);
	const currentDay = Math.min(33, (completed.length ? Math.max(...completed) : 0) + 1);
	const currentDayInfo = (days ?? []).find((d) => d.day_number === currentDay);
	const currentStage = (stages ?? []).find((s) => currentDay >= s.start_day && currentDay <= s.end_day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-xl",
				children: ["Bienvenido, ", displayName || "hermano"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Que los Santos Arcángeles te acompañen siempre."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface-sacred mt-5 overflow-hidden rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: angeles_default,
					alt: "",
					"aria-hidden": true,
					width: 1536,
					height: 1024,
					className: "size-full object-cover opacity-60"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0",
					style: { background: "var(--gradient-veil)" },
					"aria-hidden": true
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "-mt-10 relative p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-primary",
						children: "Día actual"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-2xl",
						children: [
							"Día ",
							currentDay,
							" de 33"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: currentDayInfo?.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4 w-full",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dia/$dayNumber",
							params: { dayNumber: String(currentDay) },
							children: "Continuar día"
						})
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressCard, {
				completed: completed.length,
				total: 33
			})
		}),
		currentStage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-2 text-xs uppercase tracking-[0.22em] text-muted-foreground",
				children: ["Etapa actual · Etapa ", romanize(currentStage.stage_number)]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageCard, {
				stageNumber: currentStage.stage_number,
				title: currentStage.title,
				motto: currentStage.motto,
				startDay: currentStage.start_day,
				endDay: currentStage.end_day,
				completedDays: completed.filter((d) => d >= currentStage.start_day && d <= currentStage.end_day).length
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid grid-cols-3 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/coronilla",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "size-5" }),
					label: "Coronilla"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/dias",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" }),
					label: "Los 33 días"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/recursos",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }),
					label: "Recursos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/perfil",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" }),
					label: "Mi intención"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/perfil",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotebookPen, { className: "size-5" }),
					label: "Mi diario"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shortcut, {
					to: "/perfil",
					icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
					label: "Acompañamiento"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-center text-sm text-muted-foreground",
			children: "Si perdiste un día, tu camino continúa. Retoma tranquilamente donde quedaste."
		})
	] });
}
function Shortcut({ to, icon, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "surface-sacred flex flex-col items-center gap-1.5 rounded-xl p-3 text-center text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			"aria-hidden": true,
			children: icon
		}), label]
	});
}
//#endregion
export { Dashboard as component };
