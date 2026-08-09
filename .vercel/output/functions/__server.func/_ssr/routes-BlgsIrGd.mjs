import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { X as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as san_miguel_hero_default } from "./san-miguel-hero-BP89roED.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BlgsIrGd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Bienvenida() {
	const { session, loading } = useAuth();
	const navigate = useNavigate();
	const [splash, setSplash] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const id = setTimeout(() => setSplash(false), 1800);
		return () => clearTimeout(id);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!splash && !loading && session) navigate({
			to: "/dashboard",
			replace: true
		});
	}, [
		splash,
		loading,
		session,
		navigate
	]);
	if (splash) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#061426] px-6 text-center text-[#f7f2e7]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: san_miguel_hero_default,
				alt: "",
				"aria-hidden": true,
				width: 1024,
				height: 1536,
				className: "absolute inset-0 size-full object-cover object-top opacity-45"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,20,38,.08),rgba(6,20,38,.7)_65%,#061426)]",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.42em] text-[#e4bd68]",
						children: "Consagración"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-6xl text-[#f3d58e]",
						children: "33 días"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-sm tracking-[0.2em]",
						children: "A LOS SANTOS ARCÁNGELES"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 font-display text-lg text-[#e4bd68]",
						children: "«¿Quién como Dios?»"
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-[#061426] text-[#f7f2e7]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(228,189,104,.16),transparent_38%),linear-gradient(135deg,#0b2442,#061426_65%)]",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-dvh w-full max-w-[520px] flex-col pb-[calc(24px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] shadow-2xl shadow-black/50",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-[48dvh] flex-1 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: san_miguel_hero_default,
					alt: "San Miguel Arcángel con espada y escudo entre nubes de luz",
					width: 1024,
					height: 1536,
					className: "absolute inset-0 size-full object-cover object-top"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(6,20,38,.18)_50%,rgba(6,20,38,.86)_78%,#061426_96%)]",
					"aria-hidden": true
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative z-10 -mt-24 px-6 text-center sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.38em] text-[#e4bd68]",
						children: "Consagración"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-1 font-display uppercase leading-none",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-[clamp(2.8rem,15vw,4.5rem)] text-[#f5d991] drop-shadow-lg",
								children: "33 días"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[11px] tracking-[0.24em] text-[#f7f2e7]/90",
								children: "A los Santos Arcángeles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-4 block text-[clamp(1.65rem,8vw,2.35rem)] tracking-[0.08em]",
								children: "San Miguel"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] uppercase tracking-[0.2em] text-[#f7f2e7]/75",
						children: "San Gabriel · San Rafael"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-4 flex max-w-xs items-center gap-3 text-[#d7ab51]",
						"aria-hidden": true,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-current opacity-35" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rotate-45 bg-current" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-current opacity-35" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-sm uppercase tracking-[0.15em] text-[#e4bd68]",
						children: "¿Quién como Dios?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] uppercase tracking-[0.22em] text-[#f7f2e7]/55",
						children: "Nadie como Dios"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-[#f7f2e7]/80",
						children: "Un camino de fe, conversión, combate espiritual, santidad y misión."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						"aria-label": "Acciones de bienvenida",
						className: "mt-6 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								search: { modo: "registro" },
								className: "flex min-h-13 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#e4bd68,#b98227)] px-5 text-sm font-semibold text-[#061426] shadow-[0_8px_24px_rgba(0,0,0,.25)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d991]",
								children: "Comenzar mi consagración"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								search: { modo: "login" },
								className: "flex min-h-13 items-center justify-center rounded-xl border border-[#e4bd68]/65 bg-[#061426]/35 px-5 text-sm font-semibold text-[#f7f2e7] backdrop-blur-sm transition hover:border-[#e4bd68] hover:bg-[#e4bd68]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5d991]",
								children: "Iniciar sesión"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/recursos",
								className: "mx-auto flex min-h-11 items-center gap-2 px-3 text-sm text-[#f7f2e7]/80 transition hover:text-[#e4bd68] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-[#f5d991]",
								children: ["Conocer la consagración ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "size-4",
									"aria-hidden": true
								})]
							})
						]
					})
				]
			})]
		})]
	});
}
//#endregion
export { Bienvenida as component };
