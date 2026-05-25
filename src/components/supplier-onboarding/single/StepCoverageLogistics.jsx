import React from "react";

export default function StepCoverageLogistics({ formData, updateFormData }) {
    // Safe extraction object fallback from parent state management context
    const localData = formData.coverageLogistics || {};

    const handleFieldChange = (name, value) => {
        updateFormData("coverageLogistics", { [name]: value });
    };

    const capabilities = [
        { value: "local", label: "Local Regional Focus", desc: "Intra-city or regional hub dispatch networks" },
        { value: "national", label: "National Coverage", desc: "Cross-border distribution and nationwide haulage" }
    ];

    return (
        <div className="space-y-6">

            {/* Informative Step Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Logistics & Coverage Mapping
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Map regional fulfillment capacities, operational timelines, and dispatch capabilities.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Coverage Areas (cities/regions) */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="coverageAreas" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Geographic Coverage Areas <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="coverageAreas"
                        type="text"
                        name="coverageAreas"
                        value={localData.coverageAreas || ""}
                        onChange={(e) => handleFieldChange("coverageAreas", e.target.value)}
                        placeholder="e.g., London, Greater Manchester, West Midlands (comma-separated)"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Delivery Type Dropdown Selection */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="deliveryType" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Fulfillment Delivery Model <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="deliveryType"
                            name="deliveryType"
                            value={localData.deliveryType || ""}
                            onChange={(e) => handleFieldChange("deliveryType", e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                            required
                        >
                            <option value="" disabled hidden>Select freight arrangement...</option>
                            <option value="supplier">Supplier Managed Fleet</option>
                            <option value="platform">Platform Self-Pickup</option>
                            <option value="3pl">Third-Party Logistics Partner (3PL)</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Operating Hours Input */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="operatingHours" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Receiving & Operating Hours <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="operatingHours"
                        type="text"
                        name="operatingHours"
                        value={localData.operatingHours || ""}
                        onChange={(e) => handleFieldChange("operatingHours", e.target.value)}
                        placeholder="e.g., Mon-Fri: 08:00 - 17:00"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Delivery Capability - Upgraded from basic Text Box to Interactive Option Selection Grid */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Delivery Scope Capability <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {capabilities.map((item) => {
                            const isSelected = localData.deliveryCapability === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleFieldChange("deliveryCapability", item.value)}
                                    className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 relative ${isSelected
                                        ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900/15"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                                        }`}
                                >
                                    {/* Styled radio circle button replacement */}
                                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? "border-slate-900 text-slate-900" : "border-slate-300"
                                        }`}>
                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-normal">{item.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}