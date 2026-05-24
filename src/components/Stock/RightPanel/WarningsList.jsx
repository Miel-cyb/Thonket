import React from "react";

/**
 * WarningsList
 * Non-blocking advisory panel highlighting procedural inconsistencies or variance notes.
 * Flags records that require human verification but do not prevent document state changes.
 */
const WarningsList = ({ warnings = [] }) => {
    return (
        <div className="w-full select-none">

            {/* COMPONENT SECTION METADATA HEADER */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className={`h-2 w-2 rounded-full ${warnings.length > 0 ? "bg-amber-500" : "bg-slate-300"}`} />
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Process Warnings ({warnings.length})
                </h4>
            </div>

            {/* EMPTY STATE - CONDITIONAL CHECKS OPTIMIZED */}
            {warnings.length === 0 ? (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-500">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium">All record parameters match local warehouse protocols.</span>
                </div>
            ) : (
                /* SYSTEM ADVISORY LIST LOOP RUNWAY */
                <ul className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                    {warnings.map((warn, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2.5 p-3 bg-amber-50/40 border border-amber-200/50 rounded-lg text-amber-900 transition-all duration-150 hover:bg-amber-50"
                        >
                            {/* Standard Advisory Yield/Warning Icon Prefix */}
                            <svg
                                className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                            {/* Warning Message String Layout */}
                            <div className="text-xs font-medium leading-relaxed">
                                {warn.message || "Anomalous parameter variant detected requiring supervisor verification."}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default WarningsList;