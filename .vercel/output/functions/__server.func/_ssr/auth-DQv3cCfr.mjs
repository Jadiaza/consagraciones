import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { D as LoaderCircle, E as Lock, L as Eye, R as EyeOff, a as UserRound, q as Check, w as Mail } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
import { r as Route$9 } from "./router-BB8Kf0Qp.mjs";
import { t as useAuth } from "./useAuth-CYyEMh52.mjs";
import { t as san_miguel_hero_default } from "./san-miguel-hero-BP89roED.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DQv3cCfr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		...opts,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const { modo } = Route$9.useSearch();
	const navigate = useNavigate();
	const { session } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [terms, setTerms] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [emailSent, setEmailSent] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!session?.user) return;
		let active = true;
		supabase.from("user_roles").select("role").eq("user_id", session.user.id).then(({ data }) => {
			if (!active) return;
			const isStaff = data?.some(({ role }) => role === "admin" || role === "editor");
			navigate({
				to: isStaff ? "/admin" : "/dashboard",
				replace: true
			});
		});
		return () => {
			active = false;
		};
	}, [session, navigate]);
	const setModo = (next) => void navigate({
		to: "/auth",
		search: { modo: next }
	});
	const handleSubmit = async (event) => {
		event.preventDefault();
		setBusy(true);
		try {
			if (modo === "recuperar") {
				const parsed = stringType().trim().email().max(255).safeParse(email);
				if (!parsed.success) throw new Error("Introduce un correo electrónico válido.");
				const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${window.location.origin}/auth/reset-password` });
				if (error) throw error;
				setEmailSent("reset");
				return;
			}
			if (modo === "registro") {
				const parsed = objectType({
					fullName: stringType().trim().min(3, "Escribe tu nombre completo.").max(120),
					email: stringType().trim().email("Correo electrónico no válido.").max(255),
					password: stringType().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72)
				}).safeParse({
					fullName,
					email,
					password
				});
				if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Revisa los datos.");
				if (password !== confirm) throw new Error("Las contraseñas no coinciden.");
				if (!terms) throw new Error("Debes aceptar los términos y la política de privacidad.");
				const { data, error } = await supabase.auth.signUp({
					email: parsed.data.email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: parsed.data.fullName }
					}
				});
				if (error) throw error;
				if (!data.session) {
					setEmailSent("confirm");
					return;
				}
				navigate({
					to: "/onboarding",
					replace: true
				});
				return;
			}
			const { data: login, error } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password
			});
			if (error) throw error;
			const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", login.user.id);
			const isStaff = roles?.some(({ role }) => role === "admin" || role === "editor");
			navigate({
				to: isStaff ? "/admin" : "/dashboard",
				replace: true
			});
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Ha ocurrido un error.");
		} finally {
			setBusy(false);
		}
	};
	const handleGoogle = async () => {
		setBusy(true);
		const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
		if (result.error) {
			setBusy(false);
			toast.error("No fue posible iniciar sesión con Google.");
			return;
		}
		if (result.redirected) return;
		navigate({
			to: "/dashboard",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: san_miguel_hero_default,
			alt: "",
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0 size-full object-cover object-top opacity-15"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-12 pt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm text-muted-foreground hover:text-primary",
					children: "← Volver"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl",
						children: modo === "registro" ? "Crear cuenta" : modo === "recuperar" ? "Recuperar contraseña" : "Iniciar sesión"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: modo === "registro" ? "Únete al camino de consagración." : modo === "recuperar" ? "Te enviaremos un enlace para restablecer tu contraseña." : "Bienvenido de nuevo."
					})]
				}),
				emailSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-sacred mt-8 rounded-2xl p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
							className: "mx-auto size-6 text-primary",
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display",
							children: "Revisa tu correo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: emailSent === "confirm" ? "Te enviamos un enlace para confirmar tu cuenta. Al confirmarla podrás comenzar tu camino." : "Te enviamos un enlace para restablecer tu contraseña."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-5 w-full",
							onClick: () => setModo("login"),
							children: "Volver al inicio de sesión"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "mt-8 flex flex-col gap-3",
					children: [
						modo === "registro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4" }),
							label: "Nombre completo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								maxLength: 120,
								autoComplete: "name",
								placeholder: "Nombre completo",
								className: "border-0 bg-transparent px-0 focus-visible:ring-0"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }),
							label: "Correo electrónico",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								maxLength: 255,
								autoComplete: "email",
								placeholder: "Correo electrónico",
								className: "border-0 bg-transparent px-0 focus-visible:ring-0"
							})
						}),
						modo !== "recuperar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
							label: "Contraseña",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showPassword ? "text" : "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								maxLength: 72,
								autoComplete: modo === "registro" ? "new-password" : "current-password",
								placeholder: "Contraseña",
								className: "border-0 bg-transparent px-0 focus-visible:ring-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": showPassword ? "Ocultar contraseña" : "Mostrar contraseña",
								onClick: () => setShowPassword((v) => !v),
								className: "text-muted-foreground",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})]
						}),
						modo === "registro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }),
							label: "Confirmar contraseña",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showPassword ? "text" : "password",
								value: confirm,
								onChange: (e) => setConfirm(e.target.value),
								maxLength: 72,
								autoComplete: "new-password",
								placeholder: "Confirmar contraseña",
								className: "border-0 bg-transparent px-0 focus-visible:ring-0"
							})
						}),
						modo === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: remember,
									onCheckedChange: (v) => setRemember(Boolean(v))
								}), "Recordarme"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-primary",
								onClick: () => setModo("recuperar"),
								children: "¿Olvidaste tu contraseña?"
							})]
						}),
						modo === "registro" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2 px-1 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								className: "mt-0.5",
								checked: terms,
								onCheckedChange: (v) => setTerms(Boolean(v)),
								"aria-label": "Acepto los términos y la política de privacidad"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Acepto los ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary underline",
									children: "Términos y Condiciones"
								}),
								" ",
								"y la ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary underline",
									children: "Política de Privacidad"
								}),
								"."
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							size: "lg",
							className: "mt-2 h-12",
							disabled: busy,
							children: [busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), modo === "registro" ? "Crear mi cuenta" : modo === "recuperar" ? "Enviar enlace" : "Iniciar sesión"]
						}),
						modo === "registro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted-foreground",
							children: "Tu camino quedará guardado para que puedas continuar desde cualquier dispositivo."
						}),
						modo !== "recuperar" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-3 flex items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
								"o continúa con",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "lg",
							className: "h-12",
							onClick: handleGoogle,
							disabled: busy,
							children: "Continuar con Google"
						})] })
					]
				}),
				!emailSent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-center text-sm text-muted-foreground",
					children: modo === "registro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"¿Ya tienes cuenta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary",
							onClick: () => setModo("login"),
							children: "Iniciar sesión"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"¿No tienes cuenta?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-primary",
							onClick: () => setModo("registro"),
							children: "Regístrate"
						})
					] })
				})
			]
		})]
	});
}
function Field({ icon, label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "surface-sacred flex items-center gap-3 rounded-xl px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				"aria-hidden": true,
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "sr-only",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center gap-2 py-1",
				children
			})
		]
	});
}
//#endregion
export { AuthPage as component };
