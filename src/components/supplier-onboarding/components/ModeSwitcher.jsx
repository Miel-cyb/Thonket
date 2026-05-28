import React from "react";

export default function ModeSwitcher({ mode, setMode }) {
    const isSingle = mode === "single";

    return (
        <div className="relative inline-flex items-center bg-slate-100 p-1 rounded-xl select-none w-full sm:w-auto border border-slate-200/30">

            {/* Sliding Background Pill Track */}
            <div
                className={`absolute top-1 bottom-1 rounded-lg bg-white shadow-sm border border-slate-200/60 transition-all duration-200 ease-in-out ${isSingle
                        ? "left-1 right-1/2"
                        : "left-1/2 right-1"
                    }`}
            />

            {/* Button Variant: Single Supplier */}
            <button
                type="button"
                onClick={() => setMode("single")}
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 w-1/2 sm:w-auto sm:min-w-[140px] focus:outline-none cursor-pointer ${isSingle
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
            >
                <svg
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${isSingle ? "text-slate-900" : "text-slate-400"}`}
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
                className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 w-1/2 sm:w-auto sm:min-w-[140px] focus:outline-none cursor-pointer ${!isSingle
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
            >
                <svg
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${!isSingle ? "text-slate-900" : "text-slate-400"}`}
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