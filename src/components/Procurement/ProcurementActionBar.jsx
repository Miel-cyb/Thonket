import React from "react";
import {
    Save,
    CheckCircle,
    Send,
    X,
    ChevronUp,
    Sparkles,
} from "lucide-react";

// PROCUREMENT ACTION BAR - PREMIUM CONTEXTUAL CONTROL BAR
export default function ProcurementActionBar({
    onSaveDraft,
    onApprove,
    onSend,
    onCancel,
}) {
    return (
        <div className="w-full border-t border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-lg">

            <div className="flex items-center justify-between px-6 py-4">

                {/* LEFT STATUS */}
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">

                        <Sparkles size={14} className="text-slate-500" />

                        <span className="text-xs font-semibold text-slate-600">
                            Procurement Actions
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
                        <ChevronUp size={14} />
                        Context-aware controls
                    </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex flex-wrap items-center gap-2">

                    {/* SAVE */}
                    <button
                        onClick={onSaveDraft}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                        <Save
                            size={14}
                            className="text-slate-500 transition group-hover:text-slate-700"
                        />
                        Save Draft
                    </button>

                    {/* APPROVE */}
                    <button
                        onClick={onApprove}
                        className="group flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
                    >
                        <CheckCircle size={14} />
                        Approve
                    </button>

                    {/* SEND */}
                    <button
                        onClick={onSend}
                        className="group flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                    >
                        <Send size={14} />
                        Send
                    </button>

                    {/* CANCEL */}
                    <button
                        onClick={onCancel}
                        className="group flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:-translate-y-0.5 hover:bg-red-100"
                    >
                        <X size={14} />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}