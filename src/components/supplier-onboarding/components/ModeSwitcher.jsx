import React from "react";

export default function ModeSwitcher({ mode, setMode }) {
    const isSingle = mode === "single";

    return (
        <div className="relative inline-flex items-center bg-slate-100 p-1 rounded-xl select-none w-full xs:w-auto">

            {/* Sliding Background Pill Track */}
            <div
                className={`absolute top-1 bottom-1 left-1 rounded-lg bg-white shadow-sm border border-slate-200/50 transition-all duration-300 ease-out-back ${isSingle
                    ? "w-[calc(50%-4px)] translate-x-0"
                    : "w-[calc(50%-4px)] translate-x-[calc(100%+4px)]"
                    }`}
            />

            {/* Button Variant: Single Supplier */}
            <button
                type="button"
                onClick={() => setMode("single")}
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-1/2 xs:w-auto min-w-[130px] ${isSingle
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
            >
                {/* User Icon Accent */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isSingle ? "scale-110" : "opacity-70"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Single Supplier</span>
            </button>

            {/* Button Variant: Bulk Entry */}
            <button
                type="button"
                onClick={() => setMode("bulk")}
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 w-1/2 xs:w-auto min-w-[130px] ${!isSingle
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
            >
                {/* Multi-Document Layers Icon Accent */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${!isSingle ? "scale-110" : "opacity-70"}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Bulk Entry</span>
            </button>

        </div>
    );
}