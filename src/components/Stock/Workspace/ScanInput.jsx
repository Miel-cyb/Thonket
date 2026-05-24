import React, { useRef, useEffect } from "react";

/**
 * ScanInput
 * High-frequency text capture field optimized for hardware wedge barcode scanners.
 * Features auto-focus enforcement mechanics and an integrated action layout.
 */
const ScanInput = ({ value, onChange, onScan }) => {
    const inputRef = useRef(null);
    const inputId = "hardware-barcode-capture-field";

    // Auto-focus enforcement loop on mount to verify instant operational readiness
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Re-focus handler for warehouse operators clicking empty space in the container
    const handleWrapperClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="w-full select-none" onClick={handleWrapperClick}>

            {/* INGRESS STRUCTURAL RUNWAY LABEL */}
            <label
                htmlFor={inputId}
                className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5"
            >
                Scan Barcode
            </label>

            {/* INTEGRATED INPUT HOUSING ELEMENT */}
            <div className="relative flex items-center w-full bg-white border border-slate-300 rounded-lg shadow-sm transition-all duration-150 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 group">

                {/* FLOATING BARCODE DECORATIVE BRAND ICON */}
                <div className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-150">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16V8m3 8V8m3 8V8" />
                    </svg>
                </div>

                {/* TEXT INPUT FIELD ENTRY */}
                <input
                    id={inputId}
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-800 placeholder-slate-400 bg-transparent rounded-lg focus:outline-none"
                    placeholder="Scan or enter barcode..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onScan(e.target.value);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ScanInput;