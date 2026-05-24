import React from "react";

/**
 * IntakeStatusChip
 * Clean, production-ready metadata status badge.
 * Leverages structured aesthetic variant maps instead of rigid inline-style functions.
 */
const IntakeStatusChip = ({ status = "Draft" }) => {
    // Normalizing incoming status casing to prevent key mismatches
    const normalizedStatus = status ? status.trim().toLowerCase() : "";

    // Comprehensive structural map isolating color profiles logically
    const statusMap = {
        draft: {
            classes: "bg-amber-50 text-amber-700 border-amber-200",
            dot: "bg-amber-500",
            label: "Draft"
        },
        posted: {
            classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
            dot: "bg-emerald-500",
            label: "Posted"
        },
        pending: {
            classes: "bg-blue-50 text-blue-700 border-blue-200",
            dot: "bg-blue-500",
            label: "Pending"
        },
        fallback: {
            classes: "bg-gray-50 text-gray-600 border-gray-200",
            dot: "bg-gray-400",
            label: status || "Unknown"
        }
    };

    // Extract correct token mapping layer, defaulting cleanly to fallback configurations
    const currentTheme = statusMap[normalizedStatus] || statusMap.fallback;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm select-none tracking-wide transition-all duration-150 ${currentTheme.classes}`}
        >
            {/* Visual core status indicator beacon */}
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 ${currentTheme.dot}`}
                aria-hidden="true"
            />
            {currentTheme.label}
        </span>
    );
};

export default IntakeStatusChip;