import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as resourcesQuery, a as LoadingState, c as RESOURCE_CATEGORIES, d as SectionTitle, i as ErrorState, l as ResourceCard, r as EmptyState } from "./cards-DkgcFlMS.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as AppShell } from "./AppShell-B3zJyf6d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recursos-BPRDwZxX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Recursos() {
	const { data, isLoading, error } = useQuery(resourcesQuery());
	const [open, setOpen] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Recursos",
		children: [
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: error.message }),
			data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Aún no hay recursos publicados" }),
			data && RESOURCE_CATEGORIES.map((category) => {
				const items = data.filter((item) => item.category === category.key);
				if (items.length === 0) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: category.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceCard, {
						title: item.title,
						summary: item.summary,
						onClick: () => setOpen(open === item.id ? null : item.id)
					}), open === item.id && item.body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-line rounded-2xl bg-secondary/40 p-4 text-[15px] leading-relaxed",
						children: item.body
					})] }, item.id))
				})] }, category.key);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						children: "Volver al inicio"
					})
				})
			})
		]
	});
}
//#endregion
export { Recursos as component };
