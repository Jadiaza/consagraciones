import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BaK6rBLy.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as useQueryClient, r as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { C as Menu, F as Gauge, H as CircleCheck, I as FileText, J as CalendarDays, K as ChevronDown, O as Layers, P as HandHeart, T as LogOut, U as ChevronUp, W as ChevronRight, Y as BookOpen, Z as Activity, a as UserRound, d as ShieldCheck, f as Search, g as Plus, p as Save, q as Check, r as Users, s as Trash2, t as X, v as Pencil } from "../_libs/lucide-react.mjs";
import { a as LoadingState, c as RESOURCE_CATEGORIES, i as ErrorState, r as EmptyState } from "./cards-DkgcFlMS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B8UejCZ-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var emptyStage = {
	stage_number: 1,
	title: "",
	motto: "",
	description: "",
	start_day: 1,
	end_day: 7,
	accent_color: "",
	hero_image: ""
};
var emptyDay = {
	stage_id: "none",
	day_number: 1,
	title: "",
	subtitle: "",
	objective: "",
	motto: "",
	hero_image: "",
	introduction: "",
	teaching: "",
	church_teaching: "",
	meditation: "",
	purpose: "",
	prayer: "",
	progressive_consecration: "",
	estimated_minutes: 25,
	status: "draft"
};
function StageDayManager({ mode, consecrationId }) {
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [stageForm, setStageForm] = (0, import_react.useState)(emptyStage);
	const [dayForm, setDayForm] = (0, import_react.useState)(emptyDay);
	const stages = useQuery({
		queryKey: ["admin-stages", consecrationId],
		queryFn: async () => {
			const { data, error } = await supabase.from("consecration_stages").select("*").eq("consecration_id", consecrationId).order("stage_number");
			if (error) throw error;
			return data ?? [];
		}
	});
	const days = useQuery({
		queryKey: ["admin-days", consecrationId],
		queryFn: async () => {
			const { data, error } = await supabase.from("consecration_days").select("*").eq("consecration_id", consecrationId).order("day_number");
			if (error) throw error;
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		setSelected(null);
		setStageForm(emptyStage);
		setDayForm(emptyDay);
	}, [mode, consecrationId]);
	const refresh = async () => {
		await Promise.all([
			qc.invalidateQueries({ queryKey: ["admin-stages", consecrationId] }),
			qc.invalidateQueries({ queryKey: ["admin-days", consecrationId] }),
			qc.invalidateQueries({ queryKey: ["admin-dashboard"] }),
			qc.invalidateQueries({ queryKey: [mode, consecrationId] })
		]);
	};
	const save = useMutation({
		mutationFn: async () => {
			if (mode === "stages") {
				if (!stageForm.title.trim()) throw new Error("Escribe el título de la etapa.");
				const payload = {
					...stageForm,
					consecration_id: consecrationId,
					title: stageForm.title.trim(),
					motto: stageForm.motto.trim() || null,
					description: stageForm.description.trim() || null,
					accent_color: stageForm.accent_color.trim() || null,
					hero_image: stageForm.hero_image.trim() || null
				};
				const r = selected ? await supabase.from("consecration_stages").update(payload).eq("id", selected) : await supabase.from("consecration_stages").insert(payload);
				if (r.error) throw r.error;
			} else {
				if (!dayForm.title.trim()) throw new Error("Escribe el título del día.");
				const nullable = (v) => v.trim() || null;
				const payload = {
					...dayForm,
					consecration_id: consecrationId,
					stage_id: dayForm.stage_id === "none" ? null : dayForm.stage_id,
					title: dayForm.title.trim(),
					subtitle: nullable(dayForm.subtitle),
					objective: nullable(dayForm.objective),
					motto: nullable(dayForm.motto),
					hero_image: nullable(dayForm.hero_image),
					introduction: nullable(dayForm.introduction),
					teaching: nullable(dayForm.teaching),
					church_teaching: nullable(dayForm.church_teaching),
					meditation: nullable(dayForm.meditation),
					purpose: nullable(dayForm.purpose),
					prayer: nullable(dayForm.prayer),
					progressive_consecration: nullable(dayForm.progressive_consecration),
					published_at: dayForm.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
				};
				const r = selected ? await supabase.from("consecration_days").update(payload).eq("id", selected) : await supabase.from("consecration_days").insert(payload);
				if (r.error) throw r.error;
			}
		},
		onSuccess: async () => {
			await refresh();
			reset();
			toast.success(mode === "stages" ? "Etapa guardada" : "Día guardado");
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async () => {
			if (!selected) return;
			const r = mode === "stages" ? await supabase.from("consecration_stages").delete().eq("id", selected) : await supabase.from("consecration_days").delete().eq("id", selected);
			if (r.error) throw r.error;
		},
		onSuccess: async () => {
			await refresh();
			reset();
			toast.success("Registro eliminado");
		},
		onError: (e) => toast.error(e.message)
	});
	function reset() {
		setSelected(null);
		setStageForm(emptyStage);
		setDayForm(emptyDay);
	}
	function chooseStage(item) {
		setSelected(item.id);
		setStageForm({
			stage_number: item.stage_number,
			title: item.title,
			motto: item.motto ?? "",
			description: item.description ?? "",
			start_day: item.start_day,
			end_day: item.end_day,
			accent_color: item.accent_color ?? "",
			hero_image: item.hero_image ?? ""
		});
	}
	function chooseDay(item) {
		setSelected(item.id);
		setDayForm({
			stage_id: item.stage_id ?? "none",
			day_number: item.day_number,
			title: item.title,
			subtitle: item.subtitle ?? "",
			objective: item.objective ?? "",
			motto: item.motto ?? "",
			hero_image: item.hero_image ?? "",
			introduction: item.introduction ?? "",
			teaching: item.teaching ?? "",
			church_teaching: item.church_teaching ?? "",
			meditation: item.meditation ?? "",
			purpose: item.purpose ?? "",
			prayer: item.prayer ?? "",
			progressive_consecration: item.progressive_consecration ?? "",
			estimated_minutes: item.estimated_minutes,
			status: item.status
		});
	}
	const list = mode === "stages" ? stages.data : days.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[.72fr_1.28fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface-sacred rounded-2xl border border-white/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-white/10 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: mode === "stages" ? "Etapas" : "Días y enseñanzas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Nuevo"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[720px] space-y-2 overflow-auto p-4",
				children: list?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => mode === "stages" ? chooseStage(item) : chooseDay(item),
					className: `flex w-full items-center gap-3 rounded-xl border p-3 text-left ${selected === item.id ? "border-[#d6a642] bg-[#d6a642]/10" : "border-white/10"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "grid size-9 place-items-center rounded-full bg-[#c99a3d] text-[#061426]",
							children: mode === "stages" ? "stage_number" in item ? item.stage_number : "" : "day_number" in item ? item.day_number : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					]
				}, item.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "surface-sacred rounded-2xl border border-white/10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-white/10 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-semibold",
					children: [
						selected ? "Editar" : "Crear",
						" ",
						mode === "stages" ? "etapa" : "día"
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4 p-4",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [mode === "stages" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageForm, {
					form: stageForm,
					set: setStageForm
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayForm, {
					form: dayForm,
					set: setDayForm,
					stages: stages.data ?? []
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between pt-2",
					children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "destructive",
						disabled: remove.isPending,
						onClick: () => confirm("¿Eliminar este registro definitivamente?") && remove.mutate(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Eliminar"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: save.isPending,
						className: "bg-[#c99a3d] text-[#061426]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), "Guardar"]
					})]
				})]
			})]
		})]
	});
}
function StageForm({ form, set }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Etapa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						value: form.stage_number,
						onChange: (e) => set({
							...form,
							stage_number: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Día inicial",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						value: form.start_day,
						onChange: (e) => set({
							...form,
							start_day: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Día final",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						value: form.end_day,
						onChange: (e) => set({
							...form,
							end_day: Number(e.target.value)
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Título",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.title,
				onChange: (e) => set({
					...form,
					title: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Lema",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.motto,
				onChange: (e) => set({
					...form,
					motto: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Descripción",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: form.description,
				onChange: (e) => set({
					...form,
					description: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "URL de imagen",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "url",
				value: form.hero_image,
				onChange: (e) => set({
					...form,
					hero_image: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Color identificador",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "stage-1 o #c99a3d",
				value: form.accent_color,
				onChange: (e) => set({
					...form,
					accent_color: e.target.value
				})
			})
		})
	] });
}
function DayForm({ form, set, stages }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Número",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						value: form.day_number,
						onChange: (e) => set({
							...form,
							day_number: Number(e.target.value)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Etapa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.stage_id,
						onValueChange: (v) => set({
							...form,
							stage_id: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "Sin etapa"
						}), stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: s.id,
							children: [
								s.stage_number,
								". ",
								s.title
							]
						}, s.id))] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Estado",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: form.status,
						onValueChange: (v) => set({
							...form,
							status: v
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "draft",
							children: "Borrador"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "published",
							children: "Publicado"
						})] })]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Título",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.title,
				onChange: (e) => set({
					...form,
					title: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Subtítulo",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: form.subtitle,
				onChange: (e) => set({
					...form,
					subtitle: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "Objetivo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: form.objective,
					onChange: (e) => set({
						...form,
						objective: e.target.value
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "Lema",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: form.motto,
					onChange: (e) => set({
						...form,
						motto: e.target.value
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Introducción",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 4,
				value: form.introduction,
				onChange: (e) => set({
					...form,
					introduction: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Enseñanza",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 8,
				value: form.teaching,
				onChange: (e) => set({
					...form,
					teaching: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Enseñanza de la Iglesia",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: form.church_teaching,
				onChange: (e) => set({
					...form,
					church_teaching: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "Meditación",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 5,
					value: form.meditation,
					onChange: (e) => set({
						...form,
						meditation: e.target.value
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "Propósito",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 5,
					value: form.purpose,
					onChange: (e) => set({
						...form,
						purpose: e.target.value
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Oración",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: form.prayer,
				onChange: (e) => set({
					...form,
					prayer: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Consagración progresiva",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 5,
				value: form.progressive_consecration,
				onChange: (e) => set({
					...form,
					progressive_consecration: e.target.value
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "URL de imagen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "url",
					value: form.hero_image,
					onChange: (e) => set({
						...form,
						hero_image: e.target.value
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
				label: "Duración estimada",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: 1,
					value: form.estimated_minutes,
					onChange: (e) => set({
						...form,
						estimated_minutes: Number(e.target.value)
					})
				})
			})]
		})
	] });
}
function Field$1({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function UserManagement({ mode, consecrationId }) {
	const qc = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const data = useQuery({
		queryKey: ["admin-users", consecrationId],
		queryFn: async () => {
			const [p, e, d, c, r, s] = await Promise.all([
				supabase.from("profiles").select("id,full_name,display_name,community,created_at").order("created_at", { ascending: false }),
				supabase.from("user_consecrations").select("id,user_id,consecration_id,start_date,current_day,status,updated_at").order("updated_at", { ascending: false }),
				supabase.from("user_day_progress").select("id,user_id,user_consecration_id,day_number,completed,updated_at").order("updated_at", { ascending: false }).limit(300),
				supabase.from("consecrations").select("id,title,duration_days"),
				supabase.from("user_roles").select("user_id,role"),
				supabase.from("super_admins").select("user_id")
			]);
			const error = [
				p,
				e,
				d,
				r
			].find((x) => x.error)?.error;
			if (error) throw error;
			return {
				profiles: p.data ?? [],
				enrollments: e.data ?? [],
				progress: d.data ?? [],
				consecrations: c.data ?? [],
				roles: r.data ?? [],
				superIds: new Set((s.data ?? []).map((x) => x.user_id))
			};
		}
	});
	const changeRole = useMutation({
		mutationFn: async ({ id, role }) => {
			const { error } = await supabase.rpc("super_admin_set_user_role", {
				target_user: id,
				next_role: role
			});
			if (error) throw error;
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["admin-users"] });
			toast.success("Privilegios actualizados");
		},
		onError: (e) => toast.error(e.message)
	});
	const rows = (0, import_react.useMemo)(() => data.data?.profiles.map((p) => {
		const enrollment = data.data.enrollments.find((e) => e.user_id === p.id && (!consecrationId || e.consecration_id === consecrationId));
		const cons = data.data.consecrations.find((c) => c.id === enrollment?.consecration_id);
		const completed = enrollment ? data.data.progress.filter((x) => x.user_consecration_id === enrollment.id && x.completed).length : 0;
		return {
			...p,
			enrollment,
			cons,
			completed,
			percent: cons ? Math.round(completed / cons.duration_days * 100) : 0,
			role: data.data.roles.find((r) => r.user_id === p.id && r.role !== "user")?.role ?? "user",
			superAdmin: data.data.superIds.has(p.id)
		};
	}).filter((x) => `${x.full_name} ${x.display_name}`.toLowerCase().includes(q.toLowerCase())) ?? [], [
		data.data,
		q,
		consecrationId
	]);
	if (data.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (data.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: `${data.error.message}. Aplica la migración 20260809140000 en Supabase.` });
	if (mode === "activity") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel$1, {
		title: "Actividad reciente",
		children: data.data.progress.length ? data.data.progress.slice(0, 40).map((x) => {
			const p = data.data.profiles.find((v) => v.id === x.user_id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 border-b border-white/10 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "text-emerald-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: p?.display_name || p?.full_name || "Usuario" }),
						" ",
						x.completed ? "completó" : "actualizó",
						" el Día ",
						x.day_number,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#8fa3b8]",
							children: new Date(x.updated_at).toLocaleString("es-CO")
						})
					]
				})]
			}, x.id);
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { title: "Sin actividad reciente" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel$1, {
		title: "Usuarios e inscripciones",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				className: "h-9 w-60 pl-9",
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Buscar usuario"
			})]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs uppercase text-[#8398ad]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-3",
							children: "Usuario"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Consagración" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Día" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progreso" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Estado" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Privilegios" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-white/10",
					children: rows.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [x.superAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "text-[#d6a642]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [x.display_name || x.full_name || "Sin nombre", x.superAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "block text-[#d6a642]",
									children: "Superadministrador"
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: x.cons?.title || "Sin inscripción" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: x.enrollment?.current_day || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
							x.completed,
							" · ",
							x.percent,
							"%"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: x.enrollment?.status || "—" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: x.superAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-[#d6a642]",
							children: "admin"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: x.role,
							onValueChange: (role) => changeRole.mutate({
								id: x.id,
								role
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "user",
									children: "Usuario"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "companion",
									children: "Acompañante"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "editor",
									children: "Editor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "admin",
									children: "Administrador"
								})
							] })]
						}) })
					] }, x.id))
				})]
			})
		})
	});
}
function Panel$1({ title, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-sacred rounded-2xl border border-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex min-h-14 items-center justify-between border-b border-white/10 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: title
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
			children
		})]
	});
}
var EMPTY = {
	title: "",
	body: "",
	slug: "",
	kind: "prayer",
	response: "",
	category: "oraciones",
	summary: "",
	external_url: "",
	status: "draft",
	sort_order: 0
};
var EMPTY_CONSECRATION = {
	title: "",
	subtitle: "",
	slug: "",
	duration_days: 33,
	status: "draft",
	description: ""
};
function AdminPage() {
	const qc = useQueryClient();
	const [section, setSection] = (0, import_react.useState)("dashboard");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	const [modal, setModal] = (0, import_react.useState)(false);
	const [newForm, setNewForm] = (0, import_react.useState)(EMPTY_CONSECRATION);
	const data = useQuery({
		queryKey: ["admin-dashboard"],
		queryFn: async () => {
			const results = await Promise.all([
				supabase.from("consecrations").select("id,title,subtitle,slug,duration_days,status,created_at").order("created_at"),
				supabase.from("consecration_stages").select("id,consecration_id,stage_number,title,motto,start_day,end_day").order("stage_number"),
				supabase.from("consecration_days").select("id,consecration_id,stage_id,day_number,title,status").order("day_number"),
				supabase.from("prayers").select("id,consecration_id,title,sort_order"),
				supabase.from("resources").select("id,consecration_id,title,sort_order")
			]);
			const error = results.find((r) => r.error)?.error;
			if (error) throw error;
			return {
				consecrations: results[0].data ?? [],
				stages: results[1].data ?? [],
				days: results[2].data ?? [],
				prayers: results[3].data ?? [],
				resources: results[4].data ?? []
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (!selectedId && data.data?.consecrations[0]) setSelectedId(data.data.consecrations[0].id);
	}, [data.data, selectedId]);
	const selected = data.data?.consecrations.find((c) => c.id === selectedId);
	const stages = data.data?.stages.filter((s) => s.consecration_id === selectedId) ?? [];
	data.data?.days.filter((d) => d.consecration_id === selectedId);
	const createConsecration = useMutation({
		mutationFn: async () => {
			if (!newForm.title.trim()) throw new Error("Escribe el nombre.");
			const payload = {
				...newForm,
				title: newForm.title.trim(),
				slug: newForm.slug.trim() || slugify(newForm.title),
				subtitle: newForm.subtitle.trim() || null,
				description: newForm.description.trim() || null,
				published_at: newForm.status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null
			};
			const { error } = await supabase.from("consecrations").insert(payload);
			if (error) throw error;
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
			setModal(false);
			setNewForm(EMPTY_CONSECRATION);
			toast.success("Consagración creada");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-[#041426] text-[#f5f1e8]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_75%_0%,rgba(31,89,137,.24),transparent_42%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
				open: menu,
				section,
				close: () => setMenu(false),
				select: (s) => {
					setSection(s);
					setMenu(false);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative min-h-dvh lg:pl-[244px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-[#06182b]/90 px-4 backdrop-blur lg:hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMenu(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "text-[#d6a642]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Administración" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[.2em] text-[#d6a642]",
									children: "Centro de contenidos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-3xl font-semibold",
									children: titles[section]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-[#9cb0c7]",
									children: "Gestiona todas las consagraciones de la plataforma."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedId,
									onValueChange: setSelectedId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[270px] border-white/15 bg-white/[.05]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecciona una consagración" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: data.data?.consecrations.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.title
									}, c.id)) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setModal(true),
									className: "bg-gradient-to-r from-[#ae7926] to-[#d8ac52] text-[#071525]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Nueva consagración"]
								})]
							})]
						}),
						data.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}),
						data.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: data.error.message }),
						" ",
						data.data && section === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
							data: data.data,
							selected,
							stages,
							go: setSection
						}),
						" ",
						data.data && section === "consecrations" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Consecrations, {
							items: data.data.consecrations,
							selected: selectedId,
							choose: setSelectedId,
							add: () => setModal(true)
						}),
						" ",
						section === "stages" && selectedId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageDayManager, {
							mode: "stages",
							consecrationId: selectedId
						}),
						" ",
						section === "days" && selectedId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageDayManager, {
							mode: "days",
							consecrationId: selectedId
						}),
						" ",
						section === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserManagement, {
							mode: "users",
							consecrationId: selectedId || void 0
						}),
						section === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserManagement, {
							mode: "activity",
							consecrationId: selectedId || void 0
						}),
						(section === "prayers" || section === "resources") && selectedId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentManager, {
							kind: section,
							consecrationId: selectedId
						})
					]
				})]
			}),
			modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				title: "Nueva consagración",
				close: () => setModal(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: (e) => {
						e.preventDefault();
						createConsecration.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nombre",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newForm.title,
								onChange: (e) => setNewForm({
									...newForm,
									title: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Subtítulo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newForm.subtitle,
								onChange: (e) => setNewForm({
									...newForm,
									subtitle: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Identificador",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Se genera automáticamente",
								value: newForm.slug,
								onChange: (e) => setNewForm({
									...newForm,
									slug: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Duración",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 1,
									value: newForm.duration_days,
									onChange: (e) => setNewForm({
										...newForm,
										duration_days: Number(e.target.value)
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Estado",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: newForm.status,
									onValueChange: (status) => setNewForm({
										...newForm,
										status
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "draft",
											children: "Borrador"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "published",
											children: "Publicada"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "archived",
											children: "Archivada"
										})
									] })]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Descripción",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: newForm.description,
								onChange: (e) => setNewForm({
									...newForm,
									description: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: createConsecration.isPending,
							className: "w-full bg-[#c99a3d] text-[#061426]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), "Guardar"]
						})
					]
				})
			})
		]
	});
}
var titles = {
	dashboard: "Panel de administración",
	consecrations: "Consagraciones",
	stages: "Etapas",
	days: "Días y enseñanzas",
	prayers: "Gestión de oraciones",
	resources: "Gestión de recursos",
	users: "Usuarios e inscripciones",
	activity: "Actividad reciente"
};
function Sidebar({ open, section, select, close }) {
	const links = [
		[
			"dashboard",
			"Dashboard",
			Gauge
		],
		[
			"consecrations",
			"Consagraciones",
			BookOpen
		],
		[
			"stages",
			"Etapas",
			Layers
		],
		[
			"days",
			"Días / Enseñanzas",
			CalendarDays
		],
		[
			"prayers",
			"Oraciones",
			HandHeart
		],
		[
			"resources",
			"Recursos",
			FileText
		],
		[
			"users",
			"Usuarios",
			Users
		],
		[
			"activity",
			"Actividad",
			Activity
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: close,
		className: `fixed inset-0 z-30 bg-black/70 lg:hidden ${open ? "block" : "hidden"}`
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `fixed inset-y-0 left-0 z-40 flex w-[244px] flex-col border-r border-white/10 bg-[#041a2f] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-24 items-center gap-3 border-b border-white/10 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-12 place-items-center rounded-xl border border-[#c99a3d]/40 bg-[#c99a3d]/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "text-[#d9ac4c]" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-[#d9ac4c]",
							children: "Consagración"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: "33 días"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-[#9cb0c7]",
							children: "ADMINISTRADOR"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "ml-auto lg:hidden",
						onClick: close,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]",
						children: "General"
					}),
					links.slice(0, 2).map(Link),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 mt-6 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]",
						children: "Contenido"
					}),
					links.slice(2, 6).map(Link),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 mt-6 px-3 text-[10px] uppercase tracking-widest text-[#7890a6]",
						children: "Sistema"
					}),
					links.slice(6).map(Link)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => supabase.auth.signOut().then(() => location.assign("/")),
				className: "flex items-center gap-3 border-t border-white/10 p-5 text-sm text-[#b7c5d3]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Cerrar sesión"]
			})
		]
	})] });
	function Link([key, label, Icon]) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => select(key),
			className: `mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${section === key ? "bg-gradient-to-r from-[#ae7926] to-[#c99a3d] text-[#071525]" : "text-[#d8e1ea] hover:bg-white/[.06]"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" }), label]
		}, key);
	}
}
function Dashboard({ data, selected, stages, go }) {
	const stats = [
		[
			BookOpen,
			"Consagraciones activas",
			data.consecrations.filter((c) => c.status === "published").length,
			`${data.consecrations.length} en total`
		],
		[
			Layers,
			"Etapas configuradas",
			data.stages.length,
			"En todas las consagraciones"
		],
		[
			CalendarDays,
			"Días publicados",
			data.days.filter((d) => d.status === "published").length,
			`${data.days.length} días cargados`
		],
		[
			HandHeart,
			"Oraciones y recursos",
			data.prayers.length + data.resources.length,
			"Contenido disponible"
		]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: stats.map(([Icon, label, value, sub]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				bare: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-12 place-items-center rounded-xl border border-[#d6a642]/30 bg-[#d6a642]/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "text-[#e0ad45]" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#b5c3d1]",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-semibold",
							children: value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#8fa3b8]",
							children: sub
						})
					] })]
				})
			}, label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 xl:grid-cols-[1.2fr_1fr_.7fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Consagraciones",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => go("consecrations"),
						className: "text-xs text-[#e0ad45]",
						children: "Ver todas"
					}),
					children: data.consecrations.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-white/10 py-3 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-lg bg-[#c99a3d]/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "text-[#e0ad45]" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: c.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[#8fa3b8]",
									children: [
										c.duration_days,
										" días ·",
										" ",
										data.stages.filter((s) => s.consecration_id === c.id).length,
										" etapas"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: c.status })
						]
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: `Etapas${selected ? ` · ${selected.title}` : ""}`,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => go("stages"),
						className: "text-xs text-[#e0ad45]",
						children: "Ver etapas"
					}),
					children: stages.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-white/10 py-3 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "grid size-8 place-items-center rounded-full bg-[#c99a3d] text-[#061426]",
							children: s.stage_number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: s.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-[#8fa3b8]",
								children: [
									"Días ",
									s.start_day,
									"–",
									s.end_day
								]
							})]
						})]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Acciones rápidas",
					children: [
						[
							HandHeart,
							"Gestionar oraciones",
							"prayers"
						],
						[
							FileText,
							"Gestionar recursos",
							"resources"
						],
						[
							CalendarDays,
							"Revisar días",
							"days"
						]
					].map(([Icon, label, target]) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => go(target),
							className: "flex w-full items-center gap-3 border-b border-white/10 py-4 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "text-[#d8ad50]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 text-left text-sm",
									children: label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
							]
						}, label);
					})
				})
			]
		})]
	});
}
function Consecrations({ items, selected, choose, add }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
		children: [items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => choose(c.id),
			className: `surface-sacred overflow-hidden p-0 text-left transition hover:-translate-y-1 ${selected === c.id ? "ring-2 ring-[#d6a642]" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-28 bg-[radial-gradient(circle_at_75%_10%,rgba(220,174,76,.45),transparent_35%),linear-gradient(135deg,#123c60,#07182b)] p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-10 text-[#e8c36e]" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "flex-1 font-display text-xl",
							children: c.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Status, { value: c.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 min-h-10 text-sm text-[#9cb0c7]",
						children: c.subtitle || "Sin subtítulo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 border-t border-white/10 pt-3 text-xs text-[#c3cfda]",
						children: [
							c.duration_days,
							" días · ",
							c.slug
						]
					})
				]
			})]
		}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: add,
			className: "grid min-h-72 place-items-center rounded-2xl border border-dashed border-[#c99a3d]/50 text-[#d8ad50]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex flex-col items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-10" }), "Crear consagración"]
			})
		})]
	});
}
function ContentManager({ kind, consecrationId }) {
	const qc = useQueryClient();
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const content = useQuery({
		queryKey: [
			"admin-content",
			kind,
			consecrationId
		],
		queryFn: async () => {
			const r = kind === "prayers" ? await supabase.from("prayers").select("*").eq("consecration_id", consecrationId).order("sort_order") : await supabase.from("resources").select("*").eq("consecration_id", consecrationId).order("sort_order");
			if (r.error) throw r.error;
			return r.data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async () => {
			if (!form.title.trim() || !form.body.trim()) throw new Error("Escribe título y contenido.");
			let r;
			if (kind === "prayers") {
				const p = {
					consecration_id: consecrationId,
					title: form.title.trim(),
					body: form.body.trim(),
					slug: form.slug.trim() || slugify(form.title),
					kind: form.kind,
					response: form.response.trim() || null,
					sort_order: form.sort_order
				};
				r = selected ? await supabase.from("prayers").update(p).eq("id", selected) : await supabase.from("prayers").insert(p);
			} else {
				const p = {
					consecration_id: consecrationId,
					title: form.title.trim(),
					body: form.body.trim(),
					summary: form.summary.trim() || null,
					category: form.category,
					external_url: form.external_url.trim() || null,
					status: form.status,
					sort_order: form.sort_order
				};
				r = selected ? await supabase.from("resources").update(p).eq("id", selected) : await supabase.from("resources").insert(p);
			}
			if (r.error) throw r.error;
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: [
				"admin-content",
				kind,
				consecrationId
			] });
			await qc.invalidateQueries({ queryKey: ["admin-dashboard"] });
			setSelected(null);
			setForm(EMPTY);
			toast.success("Contenido guardado");
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const r = kind === "prayers" ? await supabase.from("prayers").delete().eq("id", id) : await supabase.from("resources").delete().eq("id", id);
			if (r.error) throw r.error;
		},
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: [
				"admin-content",
				kind,
				consecrationId
			] });
			setSelected(null);
			setForm(EMPTY);
			toast.success("Contenido eliminado");
		}
	});
	function choose(i) {
		setSelected(i.id);
		setForm({
			...EMPTY,
			title: i.title,
			body: String(i.body ?? ""),
			slug: String(i.slug ?? ""),
			kind: String(i.kind ?? "prayer"),
			response: String(i.response ?? ""),
			category: String(i.category ?? "oraciones"),
			summary: String(i.summary ?? ""),
			external_url: String(i.external_url ?? ""),
			status: String(i.status ?? "draft"),
			sort_order: i.sort_order
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5 xl:grid-cols-[.75fr_1.25fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: kind === "prayers" ? "Oraciones" : "Recursos",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => {
					setSelected(null);
					setForm(EMPTY);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Nuevo"]
			}),
			children: [
				content.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {}),
				content.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: content.error.message }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[650px] space-y-2 overflow-auto",
					children: content.data?.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => choose(i),
						className: `flex w-full items-center gap-3 rounded-xl border p-3 text-left ${selected === i.id ? "border-[#d6a642] bg-[#d6a642]/10" : "border-white/10"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 truncate text-sm",
								children: i.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								className: "text-[#8fa3b8]",
								children: ["#", i.sort_order]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						]
					}, i.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: selected ? "Editar contenido" : "Nuevo contenido",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					save.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Título",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.title,
							onChange: (e) => setForm({
								...form,
								title: e.target.value
							})
						})
					}),
					kind === "prayers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Identificador",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.slug,
								onChange: (e) => setForm({
									...form,
									slug: e.target.value
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tipo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.kind,
								onValueChange: (v) => setForm({
									...form,
									kind: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "prayer",
										children: "Oración"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "opening",
										children: "Inicial"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "closing",
										children: "Final"
									})
								] })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Respuesta",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.response,
							onChange: (e) => setForm({
								...form,
								response: e.target.value
							})
						})
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Categoría",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.category,
									onValueChange: (v) => setForm({
										...form,
										category: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: RESOURCE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.key,
										children: c.label
									}, c.key)) })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Estado",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: form.status,
									onValueChange: (v) => setForm({
										...form,
										status: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "draft",
										children: "Borrador"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "published",
										children: "Publicado"
									})] })]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Resumen",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: form.summary,
								onChange: (e) => setForm({
									...form,
									summary: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Enlace externo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "url",
								value: form.external_url,
								onChange: (e) => setForm({
									...form,
									external_url: e.target.value
								})
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Contenido",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 12,
							value: form.body,
							onChange: (e) => setForm({
								...form,
								body: e.target.value
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Orden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "w-28",
							type: "number",
							value: form.sort_order,
							onChange: (e) => setForm({
								...form,
								sort_order: Number(e.target.value)
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "destructive",
							onClick: () => confirm("¿Eliminar definitivamente?") && remove.mutate(selected),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Eliminar"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: save.isPending,
							className: "bg-[#c99a3d] text-[#061426]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), "Guardar"]
						})]
					})
				]
			})
		})]
	});
}
function Panel({ title, action, bare = false, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "surface-sacred rounded-2xl border border-white/10 bg-[#0a2742]/80",
		children: [!bare && (title || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex min-h-14 items-center justify-between gap-3 border-b border-white/10 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: title
			}), action]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: bare ? "" : "p-4",
			children
		})]
	});
}
function Status({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-md px-2 py-1 text-[10px] ${value === "published" ? "bg-emerald-500/15 text-emerald-300" : value === "draft" ? "bg-amber-500/15 text-amber-300" : "bg-slate-500/20 text-slate-300"}`,
		children: value === "published" ? "Activa" : value === "draft" ? "Borrador" : "Inactiva"
	});
}
function Modal({ title, close, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl rounded-2xl border border-[#c99a3d]/30 bg-[#09223a]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex justify-between border-b border-white/10 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[80dvh] overflow-auto p-5",
				children
			})]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function slugify(v) {
	return v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
//#endregion
export { AdminPage as component };
