import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as Cross, J as CalendarDays, W as ChevronRight, Y as BookOpen, j as Heart, n as Wine, u as Shield, z as Earth } from "../_libs/lucide-react.mjs";
import { C as romanize, _ as formatLongDate, g as fetchConsecration, p as addDays, w as stagesQuery, x as publishedConsecrationsQuery } from "./cards-DkgcFlMS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as san_miguel_hero_default } from "./san-miguel-hero-BP89roED.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-DHqdKYvN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { data: available } = useQuery(publishedConsecrationsQuery());
	const [selectedConsecrationId, setSelectedConsecrationId] = (0, import_react.useState)("");
	const { data: stages } = useQuery(stagesQuery(selectedConsecrationId || void 0));
	const durationDays = (available?.find((item) => item.id === selectedConsecrationId))?.duration_days ?? 33;
	const [step, setStep] = (0, import_react.useState)(0);
	const [startDate, setStartDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [intention, setIntention] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!selectedConsecrationId && available?.[0]) setSelectedConsecrationId(available[0].id);
	}, [available, selectedConsecrationId]);
	const end = formatLongDate(addDays(/* @__PURE__ */ new Date(`${startDate}T00:00:00`), durationDays - 1));
	const finish = async () => {
		if (!user) return;
		setBusy(true);
		try {
			const consecration = await fetchConsecration(selectedConsecrationId || void 0);
			if (!consecration) throw new Error("La consagración no está disponible.");
			const expected = addDays(/* @__PURE__ */ new Date(`${startDate}T00:00:00`), durationDays - 1).toISOString().slice(0, 10);
			const { data, error } = await supabase.from("user_consecrations").insert({
				user_id: user.id,
				consecration_id: consecration.id,
				start_date: startDate,
				expected_end_date: expected
			}).select().single();
			if (error) throw error;
			if (intention.trim()) await supabase.from("user_intentions").insert({
				user_id: user.id,
				user_consecration_id: data.id,
				content: intention.trim().slice(0, 2e3)
			});
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "No fue posible comenzar el camino.");
		} finally {
			setBusy(false);
		}
	};
	if (step === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-dvh overflow-hidden bg-[#061426] text-[#f5f1e8]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(226,184,94,.15),transparent_32%),linear-gradient(160deg,#0b2442,#061426_58%)]",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto min-h-dvh w-full max-w-2xl pb-[calc(104px+env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "relative min-h-[390px] overflow-hidden px-5 pt-[calc(28px+env(safe-area-inset-top))] sm:min-h-[430px] sm:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: san_miguel_hero_default,
							alt: "San Miguel Arcángel, guía de este camino espiritual",
							width: 1024,
							height: 1536,
							className: "absolute inset-0 size-full object-cover object-[62%_top] opacity-90"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-[linear-gradient(90deg,rgba(6,20,38,.98)_0%,rgba(6,20,38,.78)_43%,rgba(6,20,38,.15)_78%),linear-gradient(to_bottom,rgba(6,20,38,.08),rgba(6,20,38,.2)_50%,#061426_98%)]",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-rise relative z-10 max-w-[250px] pt-8 sm:max-w-[310px] sm:pt-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-11 items-center justify-center rounded-full border border-[#e2b85e]/45 bg-[#061426]/55 text-[#e2b85e] shadow-[0_0_28px_rgba(226,184,94,.16)] backdrop-blur-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cross, {
										className: "size-5",
										"aria-hidden": true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "mt-5 font-display text-[clamp(2.25rem,10vw,3.6rem)] uppercase leading-[.95] tracking-[0.015em]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block",
										children: "Prepara"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 block text-[#e2b85e]",
										children: "tu camino"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center gap-2 text-[#c99a3d]",
									"aria-hidden": true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-24 bg-current opacity-60" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rotate-45 bg-current" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-10 bg-current opacity-35" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-5 text-[15px] leading-relaxed text-[#f5f1e8]/88 sm:text-base",
									children: [
										"Durante ",
										durationDays,
										" días recorrerás ",
										stages?.length ?? 0,
										" etapas que te conducirán, de la mano de los Santos Arcángeles, hacia una entrega más profunda a Jesucristo."
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					"aria-label": "Etapas de la consagración",
					className: "relative z-10 -mt-3 space-y-3.5 px-4 sm:px-6",
					children: (stages ?? []).map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingStageCard, {
						stageNumber: stage.stage_number,
						title: stage.title,
						motto: stage.motto,
						startDay: stage.start_day,
						endDay: stage.end_day,
						completedDays: 0
					}, stage.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 sm:px-7",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-7 min-h-13 w-full bg-[linear-gradient(180deg,#e2b85e,#b98227)] font-semibold text-[#061426] shadow-[0_8px_24px_rgba(0,0,0,.25)] hover:brightness-110",
						size: "lg",
						onClick: () => setStep(1),
						children: "Continuar"
					})
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-2xl px-5 py-10",
		children: [
			step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "animate-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: "Fecha de inicio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Puedes comenzar hoy o elegir una fecha. Si deseas culminar alrededor del 29 de septiembre, solemnidad de los Santos Arcángeles, puedes organizar tu itinerario para ello. No es obligatorio."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "lg",
								onClick: () => setStartDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10)),
								children: "Comenzar hoy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "start",
								children: "Elegir fecha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "start",
								type: "date",
								className: "mt-1",
								value: startDate,
								onChange: (e) => setStartDate(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Fecha prevista de finalización: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: end
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						size: "lg",
						onClick: () => setStep(2),
						children: "Continuar"
					})
				]
			}),
			step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "animate-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: "¿Por qué quieres realizar esta consagración?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Esta intención es privada. Solo tú puedes verla."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-4 min-h-36",
						maxLength: 2e3,
						value: intention,
						onChange: (e) => setIntention(e.target.value),
						placeholder: "Mi conversión, mi familia, fortalecer mi fe, discernimiento…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						size: "lg",
						onClick: () => setStep(3),
						children: "Continuar"
					})
				]
			}),
			step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "animate-rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: "Antes de comenzar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 flex flex-col gap-3 text-[15px] leading-relaxed",
						children: [
							"Participa en la Santa Eucaristía.",
							"Acércate al sacramento de la Reconciliación.",
							"Reserva cada día un momento para Dios.",
							"Ten a mano la Sagrada Escritura.",
							"Realiza el propósito diario.",
							"Persevera: si pierdes un día, tu camino continúa."
						].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "surface-sacred rounded-xl p-3",
							children: item
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						size: "lg",
						disabled: busy,
						onClick: finish,
						children: "Comenzar mi camino"
					})
				]
			})
		]
	});
}
var STAGE_ICONS = [
	BookOpen,
	Heart,
	Shield,
	Wine,
	Earth
];
function OnboardingStageCard({ stageNumber, title, motto, startDay, endDay, completedDays }) {
	const total = endDay - startDay + 1;
	const Icon = STAGE_ICONS[stageNumber - 1] ?? BookOpen;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"aria-label": `Etapa ${romanize(stageNumber)}: ${title}`,
		className: "group relative grid min-h-32 grid-cols-[58px_52px_minmax(0,1fr)_24px] items-stretch overflow-hidden rounded-[20px] border border-[#c99a3d]/20 bg-[linear-gradient(180deg,rgba(13,40,70,.94),rgba(7,28,50,.98))] shadow-[0_10px_28px_rgba(0,0,0,.18)] transition-transform motion-safe:hover:-translate-y-0.5 sm:grid-cols-[68px_58px_minmax(0,1fr)_28px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center pl-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-12 items-center justify-center rounded-full border border-[#c99a3d]/35 bg-[#061426]/65 text-[#e2b85e] shadow-[0_0_20px_rgba(226,184,94,.1)] sm:size-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-6 sm:size-7",
						"aria-hidden": true
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col items-center justify-center bg-[linear-gradient(90deg,#a87321,#e2b85e_48%,#a87321)] px-1 text-[#061426] shadow-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] font-bold uppercase tracking-[0.08em]",
						children: "Etapa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl leading-none",
						children: romanize(stageNumber)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute inset-x-0 bottom-0 h-3 translate-y-1/2 rotate-45 bg-[#a87321]",
						"aria-hidden": true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 min-w-0 self-center px-3 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[17px] font-semibold leading-tight text-[#f5f1e8] sm:text-xl",
						children: title
					}),
					motto && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 line-clamp-2 text-[13px] text-[#8ea6c4] sm:text-sm",
						children: motto
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-center gap-1.5 text-[11px] text-[#e2b85e] sm:text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
								className: "size-3.5 shrink-0",
								"aria-hidden": true
							}),
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center pr-2 text-[#c99a3d]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
					className: "size-7",
					"aria-hidden": true
				})
			})
		]
	});
}
//#endregion
export { Onboarding as component };
