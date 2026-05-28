import React from "react";

export default function BulkSupplierActions({ addRow }) {
    return (
        <div className="flex items-center justify-end">
            <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm hover:bg-slate-800 active:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-150 ease-in-out cursor-pointer group"
            >
                {/* SVG icon has a subtle scale effect on hover to feel more interactive */}
                <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform duration-150"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add New Supplier</span>
            </button>
        </div>
    );
}