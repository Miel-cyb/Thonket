import React from "react";

import ErrorsList from "./ErrorsList";
import WarningsList from "./WarningsList";
import SKUConflicts from "./SKUConflicts";

/**
 * ValidationPanel
 * Main diagnostic sidebar container evaluating batch ledger structural integrity.
 * Organizes sub-logs sequentially across prioritized structural validation states.
 */
const ValidationPanel = ({
    errors = [],
    warnings = [],
    conflicts = [],
}) => {
    return (
        <div className="w-full bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden select-none">

            {/* ==========================================
               PANEL HEADER CONTROLLER ZONE
               ========================================== */}
            <div className="flex items-center gap-2 px-4.5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                {/* Shield / Rule Checklist Diagnostic Icon */}
                <svg
                    className="w-4 h-4 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Validation Core
                </h3>
            </div>

            {/* ==========================================
               DIAGNOSTIC WIDGET ITERATION HOUSING
               ========================================== */}
            <div className="flex flex-col divide-y divide-slate-100">

                {/* CRITICAL BLOCKING SCHEMA EXCEPTIONS */}
                <div className="p-4.5">
                    <ErrorsList errors={errors} />
                </div>

                {/* SYSTEM INTEGRITY WARNING MESSAGES */}
                <div className="p-4.5">
                    <WarningsList warnings={warnings} />
                </div>

                {/* MEMORY SCAN SKU CONFLICT POOL */}
                <div className="p-4.5">
                    <SKUConflicts conflicts={conflicts} />
                </div>

            </div>

        </div>
    );
};

export default ValidationPanel;