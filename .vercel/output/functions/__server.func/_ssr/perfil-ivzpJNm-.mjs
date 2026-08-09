import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as useQueryClient, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as formatLongDate, d as SectionTitle, r as EmptyState, s as ProgressCard, v as myConsecrationQuery, y as myProgressQuery } from "./cards-DkgcFlMS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-ivzpJNm-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Perfil() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user, displayName } = useAuth();
	const { data: mine } = useQuery(myConsecrationQuery(user?.id));
	const { data: progress } = useQuery(myProgressQuery(mine?.id));
	const { data: intentions } = useQuery({
		queryKey: ["intentions", user?.id],
		enabled: Boolean(user),
		queryFn: async () => (await supabase.from("user_intentions").select("*").order("created_at")).data ?? []
	});
	const { data: journal } = useQuery({
		queryKey: ["journal", user?.id],
		enabled: Boolean(user),
		queryFn: async () => (await supabase.from("user_journal_entries").select("*").order("created_at", { ascending: false }).limit(20)).data ?? []
	});
	const { data: petitions, refetch: refetchPetitions } = useQuery({
		queryKey: ["petitions", user?.id],
		enabled: Boolean(user),
		queryFn: async () => (await supabase.from("user_petitions").select("*").order("created_at", { ascending: false })).data ?? []
	});
	const [petition, setPetition] = (0, import_react.useState)("");
	const completed = (progress ?? []).filter((p) => p.completed).length;
	const addPetition = async () => {
		if (!user || !petition.trim()) return;
		const { error } = await supabase.from("user_petitions").insert({
			user_id: user.id,
			title: petition.trim().slice(0, 160),
			visibility: "private"
		});
		if (error) toast.error("No fue posible guardar la petición.");
		else {
			setPetition("");
			refetchPetitions();
		}
	};
	const signOut = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Mi consagración",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-sacred rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: displayName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Mensajero de San Miguel"
					}),
					mine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Inicio: ",
							formatLongDate(mine.start_date),
							" · Finalización prevista: ",
							formatLongDate(mine.expected_end_date)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressCard, {
					completed,
					total: 33
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				hint: "Privada, sólo tú puedes verla",
				children: "Mi intención"
			}),
			intentions && intentions.length > 0 ? intentions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "surface-sacred rounded-2xl p-4 text-[15px] leading-relaxed",
				children: item.content
			}, item.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Aún no has escrito tu intención" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				hint: "Estrictamente privado",
				children: "Mi diario"
			}),
			journal && journal.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: journal.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "surface-sacred rounded-2xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-primary",
						children: ["Día ", entry.day_number ?? "—"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 whitespace-pre-line text-[15px] leading-relaxed",
						children: entry.content
					})]
				}, entry.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Tu diario está vacío",
				description: "Escribe desde la pantalla de cada día."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Mis peticiones" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: petition,
					maxLength: 160,
					onChange: (e) => setPetition(e.target.value),
					placeholder: "Escribe una petición"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: addPetition,
					children: "Añadir"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-col gap-2",
				children: (petitions ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "surface-sacred rounded-xl p-3 text-sm",
					children: item.title
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Mi acompañante" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Aún no tienes acompañante asignado",
				description: "Cuando se te asigne un acompañante podrás compartir con él sólo lo que autorices."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Certificado" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-sacred rounded-2xl border-2 border-primary/40 p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "Certificado de Consagración"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: completed >= 33 ? "Has completado los 33 días. Tu certificado está disponible." : `Disponible al completar el Día 33 (${completed}/33).`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
						children: [
							"Mensajeros de San Miguel Arcángel · Escuela de Fe y Misión",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"con la colaboración de La Voz de Jesús"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "sr-only",
				"aria-hidden": true,
				readOnly: true,
				value: ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8 w-full",
				variant: "outline",
				onClick: signOut,
				children: "Cerrar sesión"
			})
		]
	});
}
//#endregion
export { Perfil as component };
