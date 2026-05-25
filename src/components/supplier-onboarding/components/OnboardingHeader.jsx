import React from "react";

export default function OnboardingHeader() {
    return (
        <div className="w-full py-4 transition-all duration-200">
            <div className="flex items-center justify-between gap-6">

                {/* Left Content: Brand & Context */}
                <div className="flex items-start gap-3 sm:items-center">

                    {/* Enhanced Logo Icon */}
                    <div className="relative flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-white text-base font-bold shadow-sm shadow-slate-900/20 animate-in zoom-in-95 duration-300">
                        S
                        <div className="absolute -inset-px rounded-xl border border-white/10 pointer-events-none" />
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Supplier Portal
                            </h1>

                            {/* Desktop Component Label Badge */}
                            <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200/60">
                                v2.4
                            </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 max-w-xl line-clamp-1 sm:line-clamp-none mt-0.5">
                            Register and provision new vendor entities into the global distribution network.
                        </p>
                    </div>

                </div>

                {/* Right Content: System Metadata & Environment Status */}
                <div className="flex items-center gap-4 flex-shrink-0">

                    {/* System Network Metadata block */}
                    <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Active Environment
                        </span>
                        <span className="text-sm font-semibold text-slate-700 tracking-tight">
                            FMCG Supply Network
                        </span>
                    </div>

                    {/* Modern Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-700 shadow-sm shadow-emerald-700/5">
                        {/* Live Environment Status Indicator Dot */}
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        Onboarding Module
                    </div>

                </div>

            </div>
        </div>
    );
}