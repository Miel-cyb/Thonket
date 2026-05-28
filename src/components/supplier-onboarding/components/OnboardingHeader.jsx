import React from "react";

export default function OnboardingHeader({ onBack }) {
    return (
        <div className="w-full flex items-center justify-between transition-all duration-200">

            {/* Left Section: Back Navigation & Brand Context */}
            <div className="flex items-center gap-4">

                {/* Clean, Premium Interactive Back Button */}
                <button
                    type="button"
                    onClick={onBack || (() => window.history.back())}
                    className="group inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:bg-slate-100 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    title="Go Back"
                >
                    <svg
                        className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-150"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Vertical Divider Line */}
                <div className="h-5 w-px bg-slate-200" />

                {/* Brand Identity Cluster */}
                <div className="flex items-center gap-3">
                    {/* Scaled Minimalist Logo Badge */}
                    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-black shadow-sm tracking-wider">
                        S
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Increased Font Size for Visual Dominance */}
                        <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Supplier Portal
                        </span>
                        {/* Scaled Component Label Badge */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500 border border-slate-200/50">
                            v2.4
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Section: System Metadata & Network Status */}
            <div className="flex items-center gap-4 flex-shrink-0">
                {/* Scaled Network Reference Log */}
                <span className="hidden md:inline-block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    FMCG Supply Network
                </span>

                {/* Upgraded Live Environment Indicator Card */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/50 text-xs font-bold text-emerald-700 shadow-sm shadow-emerald-700/5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Live</span>
                </div>
            </div>

        </div>
    );
}