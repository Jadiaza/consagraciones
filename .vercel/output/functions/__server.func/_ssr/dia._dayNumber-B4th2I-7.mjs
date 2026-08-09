import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as Minus, _ as Play, c as Sun, g as Plus, h as RotateCcw, m as RotateCw, x as Moon, y as Pause } from "../_libs/lucide-react.mjs";
import { a as LoadingState, d as SectionTitle, i as ErrorState, m as dayQuery, n as DoctrineCard, o as PrayerCard, u as ScriptureCard, v as myConsecrationQuery, y as myProgressQuery } from "./cards-DkgcFlMS.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-BB8Kf0Qp.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dia._dayNumber-B4th2I-7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var SPEEDS = [
	.75,
	1,
	1.25,
	1.5
];
function format(seconds) {
	if (!Number.isFinite(seconds)) return "0:00";
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${String(s).padStart(2, "0")}`;
}
function AudioPlayer({ src, title, subtitle, initialPosition = 0, onPosition }) {
	const audioRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)(initialPosition);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [speed, setSpeed] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (audio) audio.playbackRate = speed;
	}, [speed]);
	if (!src) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "El audio de este día aún no está disponible. Se publicará desde el repositorio multimedia."
			})
		]
	});
	const seek = (delta) => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + delta));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src,
				preload: "metadata",
				onLoadedMetadata: (e) => {
					const audio = e.currentTarget;
					setDuration(audio.duration);
					if (initialPosition > 0) audio.currentTime = initialPosition;
				},
				onTimeUpdate: (e) => {
					const value = e.currentTarget.currentTime;
					setPosition(value);
					onPosition?.(Math.floor(value));
				},
				onEnded: () => setPlaying(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
				className: "mt-4",
				value: [position],
				max: duration || 1,
				step: 1,
				"aria-label": "Progreso del audio",
				onValueChange: ([value]) => {
					if (audioRef.current && value !== void 0) audioRef.current.currentTime = value;
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(position) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(duration) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Retroceder 15 segundos",
						onClick: () => seek(-15),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						"aria-label": playing ? "Pausar" : "Reproducir",
						className: "size-14 rounded-full",
						onClick: () => {
							const audio = audioRef.current;
							if (!audio) return;
							if (playing) {
								audio.pause();
								setPlaying(false);
							} else {
								audio.play();
								setPlaying(true);
							}
						},
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Avanzar 15 segundos",
						onClick: () => seek(15),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-center gap-2",
				children: SPEEDS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: speed === value ? "default" : "outline",
					onClick: () => setSpeed(value),
					children: [value, "×"]
				}, value))
			})
		]
	});
}
var OPTIONS = [
	1,
	3,
	5
];
function MeditationCard({ text }) {
	const [minutes, setMinutes] = (0, import_react.useState)(3);
	const [remaining, setRemaining] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (remaining === null) return;
		if (remaining <= 0) return;
		const id = setTimeout(() => setRemaining(remaining - 1), 1e3);
		return () => clearTimeout(id);
	}, [remaining]);
	const running = remaining !== null && remaining > 0;
	const finished = remaining === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "surface-sacred overflow-hidden rounded-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative p-5",
			style: { background: "var(--gradient-night)" },
			children: [text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-line text-[15px] leading-relaxed",
				children: text
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col items-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex size-32 items-center justify-center rounded-full border border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 animate-halo rounded-full bg-primary/10",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl text-primary",
							children: remaining === null ? `${minutes} min` : `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
						})]
					}),
					!running && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-2",
						children: OPTIONS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: minutes === value ? "default" : "outline",
							onClick: () => {
								setMinutes(value);
								setRemaining(null);
							},
							children: [value, " min"]
						}, value))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						size: "lg",
						variant: running ? "outline" : "default",
						onClick: () => setRemaining(running ? null : minutes * 60),
						children: running ? "Detener" : finished ? "Meditar nuevamente" : "Comenzar meditación"
					}),
					finished && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-primary",
						children: "Que este silencio te acerque más a Dios."
					})
				]
			})]
		})
	});
}
var trimSlashes = (value) => value.replace(/^\/+|\/+$/g, "");
var CloudflareMediaProvider = class {
	baseUrl;
	name = "cloudflare_r2";
	constructor(baseUrl) {
		this.baseUrl = baseUrl;
	}
	resolve(asset) {
		if (asset.public_url) return asset.public_url;
		if (!asset.storage_key || !this.baseUrl) return null;
		return `${trimSlashes(this.baseUrl)}/${trimSlashes(asset.storage_key)}`;
	}
};
/** Provider temporal mientras no se entregan las credenciales de Cloudflare. */
var MockMediaProvider = class {
	name = "mock";
	resolve(asset) {
		return asset.public_url ?? null;
	}
};
var MediaServiceImpl = class {
	provider;
	constructor(provider) {
		this.provider = provider;
	}
	get providerName() {
		return this.provider.name;
	}
	/** Devuelve la URL utilizable por la interfaz, o null si aún no está disponible. */
	url(asset) {
		if (!asset) return null;
		return this.provider.resolve(asset);
	}
	isAvailable(asset) {
		return this.url(asset) !== null;
	}
};
var baseUrl = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_rOQf6vFxEyDYoeMJRsnVUQ_URAGYkzz",
	"VITE_SUPABASE_URL": "https://zcfnquusvkrkqjeusmly.supabase.co"
}["VITE_MEDIA_BASE_URL"] ?? "";
var MediaService = new MediaServiceImpl(baseUrl ? new CloudflareMediaProvider(baseUrl) : new MockMediaProvider());
function DiaPage() {
	const { dayNumber } = Route.useParams();
	const n = Number(dayNumber);
	const { user } = useAuth();
	const { data: mine } = useQuery(myConsecrationQuery(user?.id));
	const { data, isLoading, error } = useQuery(dayQuery(n, mine?.consecration_id));
	const { data: progress, refetch } = useQuery(myProgressQuery(mine?.id));
	const [scale, setScale] = (0, import_react.useState)(1);
	const [light, setLight] = (0, import_react.useState)(false);
	const [journal, setJournal] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const record = (progress ?? []).find((p) => p.day_number === n);
	const upsert = async (patch) => {
		if (!user || !mine) return;
		const { error: err } = await supabase.from("user_day_progress").upsert({
			user_id: user.id,
			user_consecration_id: mine.id,
			day_number: n,
			...patch
		}, { onConflict: "user_consecration_id,day_number" });
		if (err) toast.error("No fue posible guardar.");
		else refetch();
	};
	const saveJournal = async () => {
		if (!user || !journal.trim()) return;
		setSaving(true);
		const { error: err } = await supabase.from("user_journal_entries").insert({
			user_id: user.id,
			user_consecration_id: mine?.id ?? null,
			day_number: n,
			content: journal.trim().slice(0, 5e3)
		});
		setSaving(false);
		if (err) toast.error("No fue posible guardar tu diario.");
		else {
			setJournal("");
			toast.success("Guardado en tu diario privado.");
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: `Día ${n}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: `Día ${n}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: error.message })
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: `Día ${n}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: "Este día aún no está publicado." })
	});
	const { day, scripture, doctrine, questions, media } = data;
	const podcast = media.find((m) => m.asset_type === "podcast");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: `Día ${n} de 33`,
		back: true,
		className: cn(light && "reading-light"),
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Reducir letra",
					onClick: () => setScale((s) => Math.max(.85, s - .1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Aumentar letra",
					onClick: () => setScale((s) => Math.min(1.4, s + .1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Cambiar modo de lectura",
					onClick: () => setLight((v) => !v),
					children: light ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" })
				})
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-2xl p-1", light && "reading-light bg-background text-foreground"),
			style: { fontSize: `${scale}rem` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: day.title
				}),
				day.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: day.subtitle
				}),
				day.motto && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-display text-primary",
					children: [
						"«",
						day.motto,
						"»"
					]
				}),
				day.introduction && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					hint: "Ponte en la presencia de Dios",
					children: "1 · Preparación"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "leading-relaxed",
					children: day.introduction
				})] }),
				scripture.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "2 · Palabra de Dios" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-3",
					children: scripture.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptureCard, {
						citation: s.citation,
						passage: s.passage,
						commentary: s.commentary
					}, s.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "3 · Escuchar el podcast" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioPlayer, {
					src: MediaService.url(podcast ?? null),
					title: `Día ${n} · ${day.title}`,
					subtitle: `${day.estimated_minutes} min aprox.`,
					initialPosition: record?.audio_position_seconds ?? 0,
					onPosition: (seconds) => {
						if (seconds % 15 === 0) upsert({ audio_position_seconds: seconds });
					}
				}),
				day.teaching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "4 · Enseñanza" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-line leading-relaxed",
					children: day.teaching
				})] }),
				(day.church_teaching || doctrine.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "5 · La Iglesia nos enseña" }),
					day.church_teaching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 leading-relaxed",
						children: day.church_teaching
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: doctrine.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctrineCard, {
							referenceType: d.reference_type,
							author: d.author,
							work: d.work,
							reference: d.reference,
							excerpt: d.excerpt
						}, d.id))
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "6 · Meditación" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeditationCard, { text: day.meditation }),
				questions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					hint: "Responde con calma, en silencio",
					children: "7 · Examen espiritual"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex flex-col gap-2",
					children: questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "surface-sacred rounded-xl p-4 leading-relaxed",
						children: q.question
					}, q.id))
				})] }),
				day.purpose && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "8 · Propósito del día" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-sacred rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "leading-relaxed",
							children: day.purpose
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							variant: record?.purpose_accepted ? "outline" : "default",
							onClick: () => void upsert({ purpose_accepted: true }),
							children: record?.purpose_accepted ? "Propósito asumido" : "Asumir este propósito"
						}),
						record?.purpose_accepted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "¿Pudiste vivirlo?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2",
								children: [
									"Sí",
									"En parte",
									"Hoy me costó"
								].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: record?.purpose_outcome === option ? "default" : "outline",
									onClick: () => void upsert({ purpose_outcome: option }),
									children: option
								}, option))
							})]
						})
					]
				})] }),
				day.prayer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "9 · Oración" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, { body: day.prayer })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "10 · Coronilla de San Miguel" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/coronilla",
						children: "Rezar la Coronilla"
					})
				}),
				day.progressive_consecration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "11 · Consagración progresiva" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrayerCard, { body: day.progressive_consecration })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
					hint: "Estrictamente privado",
					children: "12 · Diario espiritual"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-sacred rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "¿Qué me habló Dios hoy? ¿Qué debo cambiar? ¿Qué gracia quiero pedir? ¿Por quién quiero orar?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-3 min-h-32",
							maxLength: 5e3,
							value: journal,
							onChange: (e) => setJournal(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							variant: "outline",
							disabled: saving,
							onClick: saveJournal,
							children: "Guardar en mi diario"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-8 h-13 w-full text-base",
					size: "lg",
					onClick: () => {
						upsert({
							completed: true,
							completed_at: (/* @__PURE__ */ new Date()).toISOString()
						});
						toast.success("Día completado. Tu camino continúa.");
					},
					children: record?.completed ? "Día completado" : "He completado este día"
				})
			]
		})
	});
}
//#endregion
export { DiaPage as component };
