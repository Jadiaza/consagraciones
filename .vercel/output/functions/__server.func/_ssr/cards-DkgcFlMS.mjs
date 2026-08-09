import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as queryOptions } from "../_libs/tanstack__react-query.mjs";
import { D as LoaderCircle, E as Lock, W as ChevronRight, k as Inbox, o as TriangleAlert, q as Check } from "../_libs/lucide-react.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-DkgcFlMS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var CONSECRATION_SLUG = "santos-arcangeles-33-dias";
async function fetchConsecration(consecrationId) {
	let query = supabase.from("consecrations").select("*");
	query = consecrationId ? query.eq("id", consecrationId) : query.eq("slug", CONSECRATION_SLUG);
	const { data, error } = await query.maybeSingle();
	if (error) throw error;
	return data;
}
var publishedConsecrationsQuery = () => queryOptions({
	queryKey: ["published-consecrations"],
	queryFn: async () => {
		const { data, error } = await supabase.from("consecrations").select("*").eq("status", "published").order("created_at");
		if (error) throw error;
		return data ?? [];
	}
});
var stagesQuery = (consecrationId) => queryOptions({
	queryKey: ["stages", consecrationId ?? "santos-arcangeles-33-dias"],
	queryFn: async () => {
		const consecration = await fetchConsecration(consecrationId);
		if (!consecration) return [];
		const { data, error } = await supabase.from("consecration_stages").select("*").eq("consecration_id", consecration.id).order("stage_number");
		if (error) throw error;
		return data ?? [];
	}
});
var daysQuery = (consecrationId) => queryOptions({
	queryKey: ["days", consecrationId ?? "santos-arcangeles-33-dias"],
	queryFn: async () => {
		const consecration = await fetchConsecration(consecrationId);
		if (!consecration) return [];
		const { data, error } = await supabase.from("consecration_days").select("id, day_number, title, subtitle, stage_id, estimated_minutes").eq("consecration_id", consecration.id).eq("status", "published").order("day_number");
		if (error) throw error;
		return data ?? [];
	}
});
var dayQuery = (dayNumber, consecrationId) => queryOptions({
	queryKey: [
		"day",
		consecrationId ?? "santos-arcangeles-33-dias",
		dayNumber
	],
	queryFn: async () => {
		const consecration = await fetchConsecration(consecrationId);
		if (!consecration) return null;
		const { data: day, error } = await supabase.from("consecration_days").select("*").eq("consecration_id", consecration.id).eq("day_number", dayNumber).maybeSingle();
		if (error) throw error;
		if (!day) return null;
		const [scripture, doctrine, questions, sections, media, stage] = await Promise.all([
			supabase.from("scripture_references").select("*").eq("day_id", day.id).order("sort_order"),
			supabase.from("doctrinal_references").select("*").eq("day_id", day.id).order("sort_order"),
			supabase.from("examination_questions").select("*").eq("day_id", day.id).order("sort_order"),
			supabase.from("consecration_day_sections").select("*").eq("day_id", day.id).order("sort_order"),
			supabase.from("media_assets").select("*").eq("day_id", day.id),
			day.stage_id ? supabase.from("consecration_stages").select("*").eq("id", day.stage_id).maybeSingle() : Promise.resolve({ data: null })
		]);
		return {
			day,
			stage: stage.data ?? null,
			scripture: scripture.data ?? [],
			doctrine: doctrine.data ?? [],
			questions: questions.data ?? [],
			sections: sections.data ?? [],
			media: media.data ?? []
		};
	}
});
var prayersQuery = (consecrationId) => queryOptions({
	queryKey: ["prayers", consecrationId ?? "santos-arcangeles-33-dias"],
	queryFn: async () => {
		const consecration = await fetchConsecration(consecrationId);
		if (!consecration) return [];
		const { data, error } = await supabase.from("prayers").select("*").eq("consecration_id", consecration.id).order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var resourcesQuery = (consecrationId) => queryOptions({
	queryKey: ["resources", consecrationId ?? "all"],
	queryFn: async () => {
		let query = supabase.from("resources").select("*").eq("status", "published");
		if (consecrationId) query = query.eq("consecration_id", consecrationId);
		const { data, error } = await query.order("sort_order");
		if (error) throw error;
		return data ?? [];
	}
});
var myConsecrationQuery = (userId) => queryOptions({
	queryKey: ["my-consecration", userId],
	enabled: Boolean(userId),
	queryFn: async () => {
		const { data, error } = await supabase.from("user_consecrations").select("*").eq("user_id", userId).eq("status", "active").order("created_at", { ascending: false }).limit(1).maybeSingle();
		if (error) throw error;
		return data;
	}
});
var myProgressQuery = (id) => queryOptions({
	queryKey: ["my-progress", id],
	enabled: Boolean(id),
	queryFn: async () => {
		const { data, error } = await supabase.from("user_day_progress").select("*").eq("user_consecration_id", id).order("day_number");
		if (error) throw error;
		return data ?? [];
	}
});
var RESOURCE_CATEGORIES = [
	{
		key: "oraciones",
		label: "Oraciones"
	},
	{
		key: "biblia",
		label: "Biblia"
	},
	{
		key: "san-miguel",
		label: "San Miguel"
	},
	{
		key: "san-gabriel",
		label: "San Gabriel"
	},
	{
		key: "san-rafael",
		label: "San Rafael"
	},
	{
		key: "catequesis",
		label: "Catequesis"
	},
	{
		key: "combate-espiritual",
		label: "Combate espiritual"
	},
	{
		key: "vida-sacramental",
		label: "Vida sacramental"
	},
	{
		key: "maria",
		label: "María, Reina de los Ángeles"
	},
	{
		key: "eucaristia",
		label: "Eucaristía"
	},
	{
		key: "formacion",
		label: "Formación"
	}
];
function stageAccent(n) {
	return `var(--stage-${n && n >= 1 && n <= 4 ? n : 5})`;
}
function addDays(date, days) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}
function formatLongDate(value) {
	if (!value) return "—";
	return (typeof value === "string" ? /* @__PURE__ */ new Date(`${value}T00:00:00`) : value).toLocaleDateString("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
function SectionTitle({ children, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 mt-8 first:mt-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg text-primary",
			children
		}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: hint
		})]
	});
}
function StageCard({ stageNumber, title, motto, startDay, endDay, completedDays, locked }) {
	const total = endDay - startDay + 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred flex items-center gap-3 rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "h-14 w-1.5 shrink-0 rounded-full",
				style: { backgroundColor: stageAccent(stageNumber) }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs uppercase tracking-[0.2em] text-primary",
						children: ["Etapa ", romanize(stageNumber)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-base",
						children: title
					}),
					motto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted-foreground",
						children: motto
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Días ",
							startDay,
							"–",
							endDay,
							" · ",
							completedDays,
							"/",
							total,
							" completados"
						]
					})
				]
			}),
			locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
				className: "size-4 text-muted-foreground",
				"aria-label": "Aún no iniciada"
			}) : completedDays === total ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-5 text-primary",
				"aria-label": "Etapa completada"
			}) : null
		]
	});
}
function DayCard({ dayNumber, title, completed, available }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/dia/$dayNumber",
		params: { dayNumber: String(dayNumber) },
		className: cn("surface-sacred flex items-center gap-3 rounded-xl p-3 transition-colors hover:border-primary/50", !available && "opacity-60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-medium", completed ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"),
				children: dayNumber
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 truncate text-sm",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
				className: "size-4 shrink-0 text-muted-foreground",
				"aria-hidden": true
			})
		]
	});
}
function ProgressCard({ completed, total }) {
	const percent = total ? Math.round(completed / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm",
					children: "Mi progreso"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-primary",
					children: [percent, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: percent,
				className: "mt-3 h-2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					completed,
					" / ",
					total,
					" días completados"
				]
			})
		]
	});
}
function ScriptureCard({ citation, passage, commentary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
		className: "rounded-2xl border-l-2 border-primary bg-secondary/40 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-primary",
				children: citation
			}),
			passage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[15px] leading-relaxed italic",
				children: [
					"«",
					passage,
					"»"
				]
			}),
			commentary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: commentary
			})
		]
	});
}
var DOCTRINE_LABEL = {
	scripture: "Sagrada Escritura",
	catechism: "Catecismo",
	magisterium: "Magisterio",
	church_father: "Padres de la Iglesia",
	church_doctor: "Doctores de la Iglesia",
	saint: "Santos",
	liturgy: "Liturgia",
	book: "Lectura"
};
function DoctrineCard({ referenceType, author, work, reference, excerpt }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-primary",
				children: DOCTRINE_LABEL[referenceType] ?? referenceType
			}),
			excerpt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] leading-relaxed",
				children: excerpt
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					author,
					work,
					reference
				].filter(Boolean).join(" · ")
			})
		]
	});
}
function PrayerCard({ title, body, response }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-primary/30 bg-secondary/30 p-4",
		children: [
			title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm text-primary",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 whitespace-pre-line text-[15px] leading-relaxed",
				children: body
			}),
			response && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[15px] font-medium text-primary",
				children: response
			})
		]
	});
}
function ResourceCard({ title, summary, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "surface-sacred flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-colors hover:border-primary/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-display text-sm",
				children: title
			}), summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-0.5 block truncate text-xs text-muted-foreground",
				children: summary
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
			className: "size-4 shrink-0 text-muted-foreground",
			"aria-hidden": true
		})]
	});
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred flex flex-col items-center gap-2 rounded-2xl p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, {
				className: "size-6 text-muted-foreground",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
function LoadingState({ label = "Preparando…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-2 py-16 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
			className: "size-5 animate-spin",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		})]
	});
}
function ErrorState({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred flex flex-col items-center gap-2 rounded-2xl p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-6 text-destructive",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display",
				children: "No pudimos cargar este contenido"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: message ?? "Intenta nuevamente en unos momentos."
			})
		]
	});
}
function romanize(n) {
	return [
		"",
		"I",
		"II",
		"III",
		"IV",
		"V",
		"VI",
		"VII"
	][n] ?? String(n);
}
//#endregion
export { romanize as C, resourcesQuery as S, formatLongDate as _, LoadingState as a, prayersQuery as b, RESOURCE_CATEGORIES as c, SectionTitle as d, StageCard as f, fetchConsecration as g, daysQuery as h, ErrorState as i, ResourceCard as l, dayQuery as m, DoctrineCard as n, PrayerCard as o, addDays as p, EmptyState as r, ProgressCard as s, DayCard as t, ScriptureCard as u, myConsecrationQuery as v, stagesQuery as w, publishedConsecrationsQuery as x, myProgressQuery as y };
