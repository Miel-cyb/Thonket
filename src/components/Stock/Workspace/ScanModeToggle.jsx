import React from "react";

/**
 * ScanModeToggle
 * Segmented switch component selecting hardware ingress capture channels.
 * Swaps between local optical/video feeds and manual wedge keystroke emulation inputs.
 */
const ScanModeToggle = ({ mode, onChange }) => {
    return (
        <div className="w-full select-none">

            {/* TOGGLE WORKFLOW TRACK SECTION DESCRIPTION */}
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Hardware Device Channel
            </span>

            {/* UNIFIED SEGMENTED CONTROL RAIL */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/40">

                {/* CAMERA INGRESS TRIGGER INTERACTION OPTION */}
                <button
                    type="button"
                    onClick={() => onChange("camera")}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 focus:outline-none cursor-pointer ${mode === "camera"
                        ? "bg-white text-blue-700 shadow-sm border-slate-200/50"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/60"
                        }`}
                >
                    {/* Aperture / Lens Icon */}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Camera</span>
                </button>

                {/* KEYBOARD INGRESS TRIGGER INTERACTION OPTION */}
                <button
                    type="button"
                    onClick={() => onChange("keyboard")}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 focus:outline-none cursor-pointer ${mode === "keyboard"
                        ? "bg-white text-blue-700 shadow-sm border-slate-200/50"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/60"
                        }`}
                >
                    {/* Matrix Array / Keyboard Board Icon */}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M12 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Keyboard</span>
                </button>

            </div>
        </div>
    );
};

export default ScanModeToggle;