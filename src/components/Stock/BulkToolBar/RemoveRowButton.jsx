import React from "react";

/**
 * RemoveRowButton
 * Destructive bulk management action button designed to purge selected items.
 * Uses a soft red warning palette to visually communicate data modification.
 */
const RemoveRowButton = ({ onRemove }) => {
    return (
        <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 hover:text-red-800 active:bg-red-200/80 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
        >
            {/* Destructive Action / Trash Bin Icon Prefix */}
            <svg
                className="w-3.5 h-3.5 mr-1.5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
            </svg>
            Remove Row
        </button>
    );
};

export default RemoveRowButton;