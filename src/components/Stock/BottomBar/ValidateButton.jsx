import React from "react";

/**
 * ValidateButton
 * Operational audit trigger button used to run business logic validation checks.
 * Uses a clean, focus-driven border style that doesn't cause unnecessary visual alarm.
 */
const ValidateButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 transition-all duration-150 cursor-pointer focus:outline-none"
        >
            {/* Auditing Check-List Icon Prefix */}
            <svg
                className="w-3.5 h-3.5 mr-1.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
            </svg>
            Validate
        </button>
    );
};

export default ValidateButton;