import React from "react";

/**
 * DuplicateScanToggle
 * Elegant, interactive hardware configuration switch.
 * Swaps out raw checkboxes for a fluid, accessible micro-interaction toggle.
 */
const DuplicateScanToggle = ({ enabled, onToggle }) => {
    // Generate a unique fallback ID if missing to keep input labels fully accessible
    const toggleId = "duplicate-scan-merge-switch";

    return (
        <div className="flex items-center gap-3 select-none">
            {/* INFORMATIVE WORKFLOW CONTRAST LABEL */}
            <label
                htmlFor={toggleId}
                className="text-xs font-semibold text-slate-600 cursor-pointer"
            >
                Duplicate Scan Merge
            </label>

            {/* VISUAL SWITCH MECHANISM CONTAINER */}
            <div className="relative inline-flex items-center">
                <input
                    id={toggleId}
                    type="checkbox"
                    className="sr-only peer" // Hides the raw checkbox box while leaving it accessible
                    checked={enabled}
                    aria-checked={enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                />

                {/* TRACK AREA */}
                <button
                    type="button"
                    onClick={() => onToggle(!enabled)}
                    className={`w-8 h-4.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${enabled ? "bg-blue-600" : "bg-gray-300"
                        }`}
                >
                    {/* THUMB PIN */}
                    <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${enabled ? "translate-x-3.5" : "translate-x-0"
                            }`}
                    />
                </button>
            </div>
        </div>
    );
};

export default DuplicateScanToggle;