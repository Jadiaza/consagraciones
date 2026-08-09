import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as Headphones, N as Hand, l as Sparkles } from "../_libs/lucide-react.mjs";
import { a as LoadingState, b as prayersQuery, o as PrayerCard } from "./cards-DkgcFlMS.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/coronilla-Br8KwbmI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BEADS = 10;
var GROUPS = 5;
function vibrate() {
	if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
}
function PrayerBead({ active, done }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: cn("block size-3.5 rounded-full border transition-all", done ? "border-primary bg-primary" : "border-border bg-secondary", active && "scale-150 border-primary bg-primary/70 shadow-[var(--shadow-halo)]")
	});
}
function RosaryCounter({ invocation, response, gloria, initialGroup = 1, initialBead = 0, onProgress, onFinished }) {
	const [group, setGroup] = (0, import_react.useState)(initialGroup);
	const [bead, setBead] = (0, import_react.useState)(initialBead);
	const [showGloria, setShowGloria] = (0, import_react.useState)(false);
	const advance = () => {
		vibrate();
		if (bead + 1 >= BEADS) {
			setBead(BEADS);
			setShowGloria(true);
			onProgress?.(group, BEADS);
			return;
		}
		setBead(bead + 1);
		onProgress?.(group, bead + 1);
	};
	const nextGroup = () => {
		setShowGloria(false);
		if (group >= GROUPS) {
			onFinished?.();
			return;
		}
		setGroup(group + 1);
		setBead(0);
		onProgress?.(group + 1, 0);
	};
	const angle = (index) => index / BEADS * 2 * Math.PI - Math.PI / 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase tracking-[0.25em] text-primary",
				children: [
					"Grupo ",
					group,
					" de ",
					GROUPS
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-6 size-64",
				children: [Array.from({ length: BEADS }).map((_, index) => {
					const a = angle(index);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-1/2 top-1/2",
						style: { transform: `translate(${Math.cos(a) * 110 - 7}px, ${Math.sin(a) * 110 - 7}px)` },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerBead, {
							active: index === bead && !showGloria,
							done: index < bead
						})
					}, index);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 flex flex-col items-center justify-center text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-4xl text-primary",
						children: [
							Math.min(bead, BEADS),
							" / ",
							BEADS
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground",
						children: "cuentas"
					})]
				})]
			}),
			showGloria ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 w-full text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-line text-[15px] leading-relaxed",
					children: gloria
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					size: "lg",
					onClick: nextGroup,
					children: group >= GROUPS ? "Terminar los cinco grupos" : "Continuar al siguiente grupo"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 w-full text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: invocation
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl text-primary",
						children: response
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-6 h-14 w-full text-base",
						size: "lg",
						onClick: advance,
						children: "Rezar esta cuenta"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Toca para avanzar a tu propio ritmo."
					})
				]
			})
		]
	});
}
function Coronilla() {
	const { user } = useAuth();
	const { data: prayers, isLoading } = useQuery(prayersQuery());
	const [modo, setModo] = (0, import_react.useState)(null);
	if (isLoading || !prayers) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Coronilla",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {})
	});
	const bySlug = (slug) => prayers.find((p) => p.slug === slug);
	const opening = prayers.filter((p) => p.kind === "opening");
	const closing = prayers.filter((p) => p.kind === "closing");
	const bead = bySlug("invocacion-cuenta");
	const gloria = bySlug("gloria-grupo");
	const saveProgress = async (group, beadIndex) => {
		if (!user) return;
		await supabase.from("user_prayer_progress").upsert({
			user_id: user.id,
			prayer_slug: "coronilla-san-miguel",
			current_group: group,
			current_bead: beadIndex,
			last_prayed_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "user_id,prayer_slug" });
	};
	if (modo === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Coronilla · Selección",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center font-display text-2xl",
				children: "Coronilla de San Miguel Arcángel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-sm text-muted-foreground",
				children: "Elige la forma en que deseas rezarla."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" }),
						title: "Modo interactivo",
						hint: "Reza paso a paso con ayudas visuales",
						onClick: () => setModo("interactiva")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-5" }),
						title: "Modo manual",
						hint: "Reza a tu ritmo con el texto completo",
						onClick: () => setModo("manual")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-5" }),
						title: "Modo audio",
						hint: "Escucha y reza con la guía de audio",
						onClick: () => setModo("audio")
					})
				]
			})
		]
	});
	if (modo === "audio") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Coronilla · Audio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "surface-sacred rounded-2xl p-5 text-center text-sm text-muted-foreground",
			children: "La guía en audio se publicará desde el repositorio multimedia. Mientras tanto puedes rezar en modo interactivo o manual."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4 w-full",
			variant: "outline",
			onClick: () => setModo(null),
			children: "Volver"
		})]
	});
	if (modo === "manual") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Coronilla · Manual",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3",
			children: [
				opening.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {
					title: p.title,
					body: p.body,
					response: p.response
				}, p.id)),
				bead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-sacred rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm text-primary",
							children: "Cinco grupos de diez cuentas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-xl",
							children: bead.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl text-primary",
							children: bead.response
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Al completar las diez cuentas se reza el Gloria. Se repite cinco veces."
						})
					]
				}),
				gloria && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {
					title: gloria.title,
					body: gloria.body
				}),
				closing.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {
					title: p.title,
					body: p.body,
					response: p.response
				}, p.id))
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-6 w-full",
			variant: "outline",
			onClick: () => setModo(null),
			children: "Volver"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Coronilla · Interactiva",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-3",
				children: opening.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {
					title: p.title,
					body: p.body,
					response: p.response
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RosaryCounter, {
					invocation: bead?.body ?? "¿Quién como Dios?",
					response: bead?.response ?? "¡Nadie como Dios!",
					gloria: gloria?.body ?? "",
					onProgress: (group, index) => void saveProgress(group, index),
					onFinished: () => toast.success("Has completado los cinco grupos. Continúa con las oraciones finales.")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex flex-col gap-3",
				children: closing.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, {
					title: p.title,
					body: p.body,
					response: p.response
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6 w-full",
				variant: "outline",
				onClick: () => setModo(null),
				children: "Volver"
			})
		]
	});
}
function ModeCard({ icon, title, hint, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "surface-sacred flex items-center gap-3 rounded-2xl p-4 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			"aria-hidden": true,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-display text-sm",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs text-muted-foreground",
			children: hint
		})] })]
	});
}
//#endregion
export { Coronilla as component };
