import React from "react";

export default function StepLocationDetails({ formData, updateFormData }) {
    // Safe default extraction from parent wizard core data store
    const localData = formData.locationDetails || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData("locationDetails", { [name]: value });
    };

    return (
        <div className="space-y-6">

            {/* Informative Section Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Location & Spatial Details
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Specify core headquarters coordinates, regional operating jurisdictions, and asset dispatch hubs.
                </p>
            </div>

            {/* Grid Inputs Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Head Office Address - Full Width Span */}
                <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label htmlFor="headOfficeAddress" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Head Office Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="headOfficeAddress"
                        type="text"
                        name="headOfficeAddress"
                        value={localData.headOfficeAddress || ""}
                        onChange={handleChange}
                        placeholder="e.g., 24 Liberation Road, Airport Residential Area"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* City / Region - Full Width Span after country removal */}
                <div className="flex flex-col gap-1.5 md:col-span-3">
                    <label htmlFor="cityRegion" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        City / Region <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="cityRegion"
                        type="text"
                        name="cityRegion"
                        value={localData.cityRegion || ""}
                        onChange={handleChange}
                        placeholder="e.g., Accra, Greater Accra"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Warehouse Locations Textarea - Expanded for listing multiple facilities */}
                <div className="flex flex-col gap-1.5 md:col-span-3 pt-2 border-t border-slate-100 mt-2">
                    <label htmlFor="warehouseLocations" className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                        Warehouse & Fulfillment Depots
                        <span className="text-slate-400 font-normal text-[11px] uppercase tracking-normal">(Optional)</span>
                    </label>
                    <textarea
                        id="warehouseLocations"
                        name="warehouseLocations"
                        rows="4"
                        value={localData.warehouseLocations || ""}
                        onChange={handleChange}
                        placeholder={`e.g.,\nDepot 1: Plot 45 Industrial Area, Tema\nDepot 2: Unit B, Logistics Hub, Kumasi`}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm resize-none leading-relaxed"
                    />
                </div>

            </div>
        </div>
    );
}