import React from "react";
import { ArrowLeft, FileText } from "lucide-react";

export default function WizardHeader({ currentStep, totalSteps, onBack }) {

    // ENFORCE CONTROLLER ROUTING LOGIC BASED ON STEP CONTEXT
    const handleBackNavigation = () => {
        if (currentStep === 1) {
            // EXIT CREATION WIZARD: RETURN TO PREVIOUS MANAGEMENT DASHBOARD
            window.history.back();
        } else {
            // INTERNAL STEP RETRACTION
            onBack();
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 shadow-xs backdrop-blur-md bg-white/95">
            <div className="max-w-[1660px] w-full mx-auto flex items-center justify-between gap-4">

                {/* BRANDING META BLOCK WITH INTEGRATED INTERACTIVE BACK ACTION */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">

                    {/* ACCESSIBLE NAVIGATION CONTROL - ALWAYS ACTIVE */}
                    <button
                        type="button"
                        onClick={handleBackNavigation}
                        aria-label={currentStep === 1 ? "Exit wizard and go back to dashboard" : "Navigate to previous procurement step"}
                        className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-sm font-semibold transition-all duration-150 shrink-0 shadow-3xs"
                    >
                        <ArrowLeft size={16} className="stroke-[2.5]" />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* SEPARATOR LINE FOR VISUAL BALANCE */}
                    <div className="h-6 w-px bg-slate-200 shrink-0 mx-0.5" aria-hidden="true" />

                    {/* METADATA ICON */}
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 hidden md:block">
                        <FileText size={20} className="stroke-[2.5]" />
                    </div>

                    {/* TITLE BLOCK */}
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                            Create Purchase Order
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 hidden xs:block truncate">
                            Procurement Management System Dashboard
                        </p>
                    </div>
                </div>

                {/* HIGH-DENSITY VISUAL STEP PROGRESS METRIC BADGE */}
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3.5 py-2 rounded-xl text-sm font-bold text-slate-700 shrink-0">
                    <span className="tracking-wide uppercase text-xs text-slate-500 hidden sm:inline">Step</span>
                    <span className="bg-white text-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-3xs font-mono">
                        {currentStep} / {totalSteps}
                    </span>
                </div>

            </div>
        </header>
    );
}