import React from "react";
import { ClipboardList, ShieldAlert, Zap, Clock, CheckCircle2 } from "lucide-react";

// PURCHASE INTENT STEP - FIRST STEP IN THE PURCHASE CREATION WIZARD
export default function StepPurchaseIntent({ form, setForm }) {
    const intent = form?.intent || { description: "", priority: "routine" };

    // IMMUTABLE STRUCTURAL CLOSURE DISPATCHER
    const updateIntentField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            intent: {
                ...(prev?.intent || { description: "", priority: "routine" }),
                [field]: value
            }
        }));
    };

    const priorities = [
        {
            id: "routine",
            label: "Routine",
            desc: "Standard supply restock",
            icon: Clock,
            activeClass: "border-emerald-500 bg-slate-50/80 ring-2 ring-emerald-500/10 scale-[1.01]",
            inactiveClass: "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50",
            iconColor: "text-slate-600 bg-slate-100"
        },
        {
            id: "urgent",
            label: "Urgent",
            desc: "Production line bottleneck",
            icon: Zap,
            activeClass: "border-emerald-500 bg-amber-50/40 ring-2 ring-emerald-500/10 scale-[1.01]",
            inactiveClass: "border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/10",
            iconColor: "text-amber-600 bg-amber-100/70"
        },
        {
            id: "critical",
            label: "Critical",
            desc: "Emergency infrastructure failure",
            icon: ShieldAlert,
            activeClass: "border-emerald-500 bg-rose-50/40 ring-2 ring-emerald-500/10 scale-[1.01]",
            inactiveClass: "border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/10",
            iconColor: "text-rose-600 bg-rose-100/70"
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn max-w-[1660px] mx-auto p-1">

            {/* COMPONENT SECTION 1: VISUAL RADIO CARD GRID FOR PRIORITY MATRIX */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold tracking-tight text-slate-700">
                    Procurement Urgency Tier
                </label>
                <div className="grid grid-cols-12 gap-4">
                    {priorities.map((p) => {
                        const IconComponent = p.icon;
                        const isChecked = intent.priority === p.id;

                        return (
                            <label key={p.id} className="col-span-12 md:col-span-4 cursor-pointer group/card">
                                <input
                                    type="radio"
                                    name="priority-tier"
                                    value={p.id}
                                    checked={isChecked}
                                    onChange={() => updateIntentField("priority", p.id)}
                                    className="sr-only"
                                />
                                <div className={`relative flex flex-col gap-2 p-4 border rounded-xl transition-all duration-200 h-full shadow-xs ${isChecked ? p.activeClass : p.inactiveClass
                                    }`}>

                                    {/* VISUAL CHECKMARK STATUS FLAG */}
                                    <div className={`absolute top-4 right-4 transition-all duration-200 ${isChecked ? "opacity-100 scale-100" : "opacity-0 scale-70 pointer-events-none"
                                        }`}>
                                        <CheckCircle2 size={18} className="text-emerald-600 fill-emerald-50" />
                                    </div>

                                    <div className="flex items-center gap-2.5 pr-6">
                                        <div className={`p-1.5 rounded-lg transition-colors ${isChecked ? p.iconColor : "bg-slate-50 text-slate-400 group-hover/card:text-slate-500"
                                            }`}>
                                            <IconComponent size={16} className="shrink-0" />
                                        </div>
                                        <span className={`text-base font-semibold tracking-tight ${isChecked ? "text-slate-900" : "text-slate-700"}`}>
                                            {p.label}
                                        </span>
                                    </div>

                                    <p className={`text-xs font-normal leading-relaxed transition-colors pl-0.5 ${isChecked ? "text-slate-700" : "text-slate-400"
                                        }`}>
                                        {p.desc}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* COMPONENT SECTION 2: INTENT DESCRIPTION AND JUSTIFICATION TEXTAREA */}
            <div className="flex flex-col gap-2 group">
                <label htmlFor="procurement-need" className="text-sm font-semibold tracking-tight text-slate-700">
                    Detailed Procurement Justification
                </label>
                <div className="relative">
                    <ClipboardList
                        size={18}
                        className="absolute left-4 top-[15px] text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none"
                    />
                    <textarea
                        id="procurement-need"
                        rows={4}
                        placeholder="e.g., Procurement of 15 high-throughput networking nodes to replace failing legacy switches in server farm sector B..."
                        value={intent.description || ""}
                        onChange={(e) => updateIntentField("description", e.target.value)}
                        className="w-full text-base font-normal bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none leading-relaxed"
                    />
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                    Describe explicitly what items are required and the business context driving this asset request for compliance auditing.
                </p>
            </div>

        </div>
    );
}