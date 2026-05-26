import React from "react";
import { ClipboardList, AlertCircle, ShieldAlert, Zap, Clock } from "lucide-react";

// PURCHASE INTENT STEP - FIRST STEP IN THE PURCHASE CREATION WIZARD
export default function StepPurchaseIntent({ form, setForm }) {
    const intent = form.intent || { description: "", priority: "routine" };

    // IMMUTABLE STRUCTURAL CLOSURE DISPATCHER
    const updateIntentField = (field, value) => {
        setForm((prev) => ({
            ...prev,
            intent: {
                ...(prev.intent || { description: "", priority: "routine" }),
                [field]: value
            }
        }));
    };

    const priorities = [
        { id: "routine", label: "Routine", desc: "Standard supply restock", icon: Clock, style: "border-slate-200 text-slate-700 hover:border-slate-300 peer-checked:border-slate-900 peer-checked:bg-slate-50" },
        { id: "urgent", label: "Urgent", desc: "Production line bottleneck", icon: Zap, style: "border-slate-200 text-amber-700 hover:border-amber-300 peer-checked:border-amber-500 peer-checked:bg-amber-50/40" },
        { id: "critical", label: "Critical", desc: "Emergency infrastructure failure", icon: ShieldAlert, style: "border-slate-200 text-rose-700 hover:border-rose-300 peer-checked:border-rose-500 peer-checked:bg-rose-50/40" }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* COMPONENT SECTION 1: VISUAL RADIO CARD GRID FOR PRIORITY MATRIX */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold tracking-tight text-slate-700">
                    Procurement Urgency Tier
                </label>
                <div className="grid grid-cols-12 gap-3">
                    {priorities.map((p) => {
                        const IconComponent = p.icon;
                        const isChecked = intent.priority === p.id;
                        return (
                            <label key={p.id} className="col-span-12 md:col-span-4 cursor-pointer">
                                <input
                                    type="radio"
                                    name="priority-tier"
                                    value={p.id}
                                    checked={isChecked}
                                    onChange={() => updateIntentField("priority", p.id)}
                                    className="sr-only peer"
                                />
                                <div className={`flex flex-col gap-1.5 p-3.5 border rounded-xl transition-all h-full ${p.style} ${isChecked ? "shadow-2xs" : ""}`}>
                                    <div className="flex items-center gap-2">
                                        <IconComponent size={16} className="shrink-0" />
                                        <span className="text-base font-bold tracking-tight">{p.label}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-normal leading-normal">
                                        {p.desc}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* COMPONENT SECTION 2: INTENT DESCRIPTION AND JUSTIFICATION TEXTAREA */}
            <div className="flex flex-col gap-2">
                <label htmlFor="procurement-need" className="text-sm font-bold tracking-tight text-slate-700">
                    Detailed Procurement Justification
                </label>
                <div className="relative">
                    <ClipboardList size={18} className="absolute left-4 top-[15px] text-slate-400 pointer-events-none" />
                    <textarea
                        id="procurement-need"
                        rows={4}
                        placeholder="e.g., Procurement of 15 high-throughput networking nodes to replace failing legacy switches in server farm sector B..."
                        value={intent.description || ""}
                        onChange={(e) => updateIntentField("description", e.target.value)}
                        className="w-full text-base font-normal bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-3xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    />
                </div>
                <p className="text-xs text-slate-400 font-normal">
                    Describe explicitly what items are required and the business context driving this asset request for compliance auditing.
                </p>
            </div>

        </div>
    );
}