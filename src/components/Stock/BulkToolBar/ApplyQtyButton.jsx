import React from "react";

/**
 * ApplyQtyButton
 * Bulk modification action button designed to update large datasets instantly.
 * Styled with an operational indigo palette to distinguish it from basic structural actions.
 */
const ApplyQtyButton = ({ onApply }) => {
    return (
        <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded hover:bg-indigo-100 hover:text-indigo-800 active:bg-indigo-200/80 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
            {/* Quick Action / Automation Lightning Icon Prefix */}
            <svg
                className="w-3.5 h-3.5 mr-1.5 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
            Apply Qty
        </button>
    );
};

export default ApplyQtyButton;