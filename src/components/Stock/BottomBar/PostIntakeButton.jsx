import React from "react";

/**
 * PostIntakeButton
 * Primary transactional call-to-action button for ledger finalization.
 * Features strict visual state updates for disabled/valid conditional properties.
 */
const PostIntakeButton = ({ onClick, disabled }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold rounded shadow-sm transition-all duration-150 focus:outline-none ${disabled
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                : "bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 active:bg-blue-800 cursor-pointer"
                }`}
        >
            {/* Visual confirmation lock icon prefix for institutional posting validation safety */}
            {!disabled && (
                <svg
                    className="w-3.5 h-3.5 mr-1.5 opacity-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            )}
            Post Intake
        </button>
    );
};

export default PostIntakeButton;