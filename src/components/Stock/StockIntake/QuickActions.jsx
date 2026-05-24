import React from "react";

/**
 * QuickActions
 * Core command trigger group for global state preservation.
 * Built with micro-interactions and explicit accessibility visual hierarchy.
 */
const QuickActions = ({ onSave, onPost, onExit }) => {
    return (
        <div className="flex items-center gap-2 select-none">
            {/* SAVE DRAFT - SECONDARY ACTION */}
            <button
                type="button"
                onClick={onSave}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                Save Draft
            </button>

            {/* POST INTAKE - PRIMARY BRAND ACTION */}
            <button
                type="button"
                onClick={onPost}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-blue-600 border border-blue-700 rounded shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
                Post Intake
            </button>

            {/* EXIT - WARNING / DANGER ACTION */}
            <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-gray-200 rounded shadow-sm hover:bg-red-50 hover:border-red-200 active:bg-red-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
                Exit
            </button>
        </div>
    );
};

export default QuickActions;