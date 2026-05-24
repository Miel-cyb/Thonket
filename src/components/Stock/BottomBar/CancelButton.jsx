import React from "react";

/**
 * CancelButton
 * Subtle destructive escape action styled for enterprise forms.
 * Avoids heavy solid backgrounds to keep the layout visual hierarchy clean.
 */
const CancelButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold text-gray-500 bg-transparent rounded hover:text-red-600 hover:bg-red-50 active:bg-red-100 border border-transparent hover:border-red-100 transition-all duration-150 cursor-pointer focus:outline-none"
        >
            Cancel
        </button>
    );
};

export default CancelButton;