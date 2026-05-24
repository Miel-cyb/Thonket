import React from "react";

/**
 * SKUConflicts
 * Transaction validation block highlighting operational record cross-collisions.
 * Surfaced when physical scan indexes attempt to occupy identical memory states.
 */
const SKUConflicts = ({ conflicts = [] }) => {
    return (
        <div className="w-full select-none">

            {/* SUBSECTION INDEX COMPONENT HEADER */}
            <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-2 w-2 relative">
                    {conflicts.length > 0 && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${conflicts.length > 0 ? "bg-amber-500" : "bg-slate-300"}`} />
                </span>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    SKU Data Collisions ({conflicts.length})
                </h4>
            </div>

            {/* EMPTY STATE - NO SYSTEM DUPLICATES DETECTED */}
            {conflicts.length === 0 ? (
                <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-500">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-xs font-medium">All item identifiers hold distinct system definitions.</span>
                </div>
            ) : (
                /* CONFLICT LIST LOOP RUNWAY */
                <ul className="flex flex-col gap-2 max-h-[240px] overflow-y-auto pr-1">
                    {conflicts.map((conflict, index) => (
                        <li
                            key={index}
                            className="flex flex-col gap-2 p-3 bg-amber-50/50 border border-amber-200/70 rounded-lg group transition-all duration-150 hover:bg-amber-50"
                        >
                            <div className="flex items-start gap-2.5">
                                {/* Intersecting Vector Recycle/Conflict Icon */}
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.213 6H16"
                                    />
                                </svg>

                                {/* Core descriptive instruction text layout */}
                                <span className="text-xs font-semibold text-amber-900 leading-tight">
                                    {conflict.message}
                                </span>
                            </div>

                            {/* CORE META DATA BADGE FIELD FOR CROSS-VERIFICATION */}
                            {conflict.sku && (
                                <div className="pl-6.5">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/40 tracking-wider">
                                        TARGET SKU: {conflict.sku}
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};

export default SKUConflicts;