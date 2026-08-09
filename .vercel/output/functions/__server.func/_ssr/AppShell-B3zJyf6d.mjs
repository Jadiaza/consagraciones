import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { A as House, G as ChevronLeft, J as CalendarDays, V as CircleDot, Y as BookOpen, i as User } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-B3zJyf6d.js
var import_jsx_runtime = require_jsx_runtime();
function SpiritualHeader({ title, back, action }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-[calc(56px+env(safe-area-inset-top))] items-end gap-2 border-b border-[#c99a3d]/12 bg-[#04101f]/92 px-3 pb-2 backdrop-blur-xl",
		children: [
			back ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Volver",
				onClick: () => void navigate({
					to: "..",
					replace: false
				}),
				className: "flex size-10 items-center justify-center rounded-full text-[#f5f1e8]/85 transition hover:bg-[#e2b85e]/10 hover:text-[#e2b85e] focus-visible:outline-2 focus-visible:outline-[#e2b85e]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-10",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "flex-1 truncate pb-2 text-center font-display text-base tracking-wide text-[#f5f1e8]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex min-w-10 justify-end pb-1",
				children: action
			})
		]
	});
}
var NAV = [
	{
		to: "/dashboard",
		label: "Inicio",
		icon: House
	},
	{
		to: "/dias",
		label: "Días",
		icon: CalendarDays
	},
	{
		to: "/coronilla",
		label: "Coronilla",
		icon: CircleDot
	},
	{
		to: "/recursos",
		label: "Recursos",
		icon: BookOpen
	},
	{
		to: "/perfil",
		label: "Perfil",
		icon: User
	}
];
function BottomNavigation() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Navegación principal",
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-[#c99a3d]/15 bg-[#04101f]/96 backdrop-blur-xl",
		style: { paddingBottom: "env(safe-area-inset-bottom)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-auto flex max-w-2xl",
			children: NAV.map(({ to, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					"aria-label": label,
					className: "flex min-h-16 flex-col items-center justify-center gap-1 py-2 text-[11px] text-[#b8c2d1] transition-colors hover:text-[#f5f1e8] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e2b85e]",
					activeProps: { className: "!text-[#e2b85e]" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
				})
			}, to))
		})
	});
}
function AppShell({ children, title, back, action, hideNav, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,154,61,.08),transparent_28rem)]",
				"aria-hidden": true
			}),
			(title || back || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpiritualHeader, {
				title,
				back,
				action
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: cn("relative mx-auto w-full max-w-2xl px-4 pt-4 pb-[calc(112px+env(safe-area-inset-bottom))]", className),
				children
			}),
			!hideNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNavigation, {})
		]
	});
}
//#endregion
export { AppShell as t };
