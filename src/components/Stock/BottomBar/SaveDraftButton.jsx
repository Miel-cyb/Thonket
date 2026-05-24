import React from "react";

/**
 * SaveDraftButton
 * Secondary operational button for mid-workflow data preservation.
 * Blends cleanly into your white/light-gray card structures.
 */
const SaveDraftButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 transition-all duration-150 cursor-pointer focus:outline-none"
        >
            {/* Folder/Save Document Icon Prefix */}
            <svg
                className="w-3.5 h-3.5 mr-1.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
            </svg>
            Save Draft
        </button>
    );
};

export default SaveDraftButton;