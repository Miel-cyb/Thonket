import React from "react";
import { Factory, Globe } from "lucide-react";

// STEP 5 (OR MATCHING CORRESPONDING PIPELINE STAGE) - OPTIONAL MANUFACTURER REFERENCE
export default function StepOptionalManufacturer({ form, setForm }) {

    // SAFE STRUCTURAL CLOSURE DISPATCHER
    const handleManufacturerChange = (e) => {
        setForm((prev) => ({
            ...prev,
            manufacturer: {
                ...(prev.manufacturer || {}),
                name: e.target.value
            }
        }));
    };

    return (
        <div className="space-y-5 animate-fadeIn">

            {/* INPUT BLOCK: MANUFACTURER ORGIN BRAND */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="manufacturer-name"
                        className="text-sm font-bold tracking-tight text-slate-700"
                    >
                        Original Equipment Manufacturer (OEM)
                    </label>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        Optional Reference
                    </span>
                </div>

                <div className="relative">
                    <Factory size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        id="manufacturer-name"
                        type="text"
                        placeholder="e.g., Cisco Systems Inc., Intel Corp, Caterpillar"
                        value={form.manufacturer?.name || ""}
                        onChange={handleManufacturerChange}
                        className="w-full text-base font-normal bg-white border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3 shadow-3xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                <p className="text-xs text-slate-400 font-normal">
                    Specify the source producer entity if this purchase order is handled via a secondary vendor partner or distributor channel.
                </p>
            </div>

        </div>
    );
}