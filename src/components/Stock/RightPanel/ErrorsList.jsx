import React from "react";

/**
 * ErrorsList
 * Operational audit log display panel summarizing strict validation failures.
 * Highlights broken schema bounds or integrity exceptions preventing ledger posting.
 */
const ErrorsList = ({ errors = [] }) => {
    return (
        <div className="w-full select-none">

            {/* AUDIT ZONE META HEADER */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-2 w-2 relative">
                    {errors.length > 0 && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${errors.length > 0 ? "bg-rose-500" : "bg-slate-300"}`} />
                </span>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Validation Exceptions ({errors.length})
                </h4>
            </div>

            {/* EMPTY STATE - ALL CHECKS PASSED */}
            {errors.length === 0 ? (
                <div className="flex items-center gap-2.5 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-800">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold">Ledger integrity verified. No exceptional errors discovered.</span>
                </div>
            ) : (
                /* ERROR ITERATION PANEL LOOP */
                <ul className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                    {errors.map((err, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2.5 p-3 bg-rose-50/60 border border-rose-100 rounded-lg text-rose-900 group transition-all duration-150 hover:bg-rose-50"
                        >
                            {/* Warning Indicator Badge Block */}
                            <svg
                                className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-150"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>

                            {/* Operational Failure Log String Output */}
                            <div className="text-xs font-medium leading-relaxed">
                                {err.message || "An unspecified data execution fault structural mismatch occurred."}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default ErrorsList;