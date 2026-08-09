import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.reset-password-DOosRs7o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPassword() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (event) => {
		event.preventDefault();
		setBusy(true);
		try {
			const parsed = stringType().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72).safeParse(password);
			if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
			if (password !== confirm) throw new Error("Las contraseñas no coinciden.");
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			toast.success("Contraseña actualizada.");
			navigate({
				to: "/dashboard",
				replace: true
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "No fue posible actualizar la contraseña.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center font-display text-2xl",
				children: "Nueva contraseña"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-sm text-muted-foreground",
				children: "Escribe la nueva contraseña para tu cuenta."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-8 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Nueva contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						className: "mt-1",
						value: password,
						maxLength: 72,
						onChange: (e) => setPassword(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "confirm",
						children: "Confirmar contraseña"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "confirm",
						type: "password",
						className: "mt-1",
						value: confirm,
						maxLength: 72,
						onChange: (e) => setConfirm(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "lg",
						disabled: busy,
						children: "Guardar contraseña"
					})
				]
			})
		]
	});
}
//#endregion
export { ResetPassword as component };
