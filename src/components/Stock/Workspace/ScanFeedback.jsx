import React from "react";

/**
 * ScanFeedback
 * Real-time hardware event notification banner.
 * Emits immediate operational status flags for hardware scanning routines.
 */
const ScanFeedback = ({ status, message }) => {
    // Gracefully handle uninitialized or empty system notification pipelines
    if (!status || !message) return null;

    // Status dictionary config map for swift visual parsing
    const statusConfig = {
        success: {
            bg: "bg-emerald-50/90 border-emerald-200/80 text-emerald-900",
            iconColor: "text-emerald-500",
            iconPath: "M5 13l4 4L19 7"
        },
        error: {
            bg: "bg-rose-50/90 border-rose-200/80 text-rose-900",
            iconColor: "text-rose-500",
            iconPath: "M6 18L18 6M6 6l12 12"
        },
        warning: {
            bg: "bg-amber-50/90 border-amber-200/80 text-amber-900",
            iconColor: "text-amber-500",
            iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        }
    };

    // Safe lookup step with general fallback parameters if unknown string passes
    const activeStyle = statusConfig[status] || statusConfig.warning;

    return (
        <div
            role="alert"
            className={`flex items-start gap-2.5 p-3 rounded-lg border shadow-sm backdrop-blur-sm transform transition-all duration-200 ease-out select-none ${activeStyle.bg}`}
        >
            {/* COMPONENT STATUS SYSTEM ICON */}
            <svg
                className={`w-4 h-4 shrink-0 mt-0.5 ${activeStyle.iconColor}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={activeStyle.iconPath}
                />
            </svg>

            {/* MESSAGE INTERACTION STRING TEXT */}
            <span className="text-xs font-semibold leading-relaxed">
                {message}
            </span>
        </div>
    );
};

export default ScanFeedback;