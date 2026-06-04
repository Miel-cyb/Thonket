import React from "react";
import { ArrowLeft, FileText } from "lucide-react";

export default function PurchaseCreateHeader({
    step = 1,
    totalSteps = 4,
    onBackPage
}) {
    // Calculate percentage for the visual progress bar
    const progressPercentage = totalSteps > 0 ? (step / totalSteps) * 100 : 0;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            <div className="mx-auto max-w-[1660px] px-6 py-3.5 flex items-center justify-between gap-4">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4 min-w-0">

                    {/* BACK BUTTON */}
                    <button
                        onClick={onBackPage}
                        aria-label="Go back"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 outline-none transition-all hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 active:scale-95"
                    >
                        <ArrowLeft size={18} strokeWidth={2.25} />
                    </button>

                    {/* ICON BADGE */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">
                        <FileText size={18} strokeWidth={2.25} />
                    </div>

                    {/* TITLE & BREADCRUMB */}
                    <div className="min-w-0">
                        <h1 className="text-base font-semibold tracking-tight text-slate-900 truncate">
                            Create Purchase Order
                        </h1>
                        <p className="text-xs text-slate-500 hidden sm:block font-medium">
                            Procurement Management System
                        </p>
                    </div>
                </div>

                {/* STEP BADGE */}
                <div className="flex items-center gap-2.5 shrink-0 rounded-xl border border-slate-200/60 bg-slate-50/50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    <span className="text-slate-400 uppercase tracking-wider text-[10px]">
                        Progress
                    </span>
                    <span className="font-mono bg-white text-slate-900 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs text-sm">
                        {step}<span className="text-slate-400 mx-0.5">/</span>{totalSteps}
                    </span>
                </div>

            </div>

            {/* VISUAL PROGRESS BAR LINE */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-slate-100">
                <div
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </header>
    );
}