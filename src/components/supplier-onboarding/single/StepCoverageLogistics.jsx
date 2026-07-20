import React from "react";

export default function StepCoverageLogistics({ formData, updateFormData }) {
    // Safe extraction object fallback from parent state management context
    const localData = formData.coverageLogistics || {};

    const handleFieldChange = (name, value) => {
        updateFormData("coverageLogistics", { [name]: value });
    };

    // Weekdays dataset for interactive choice matrix with 3-letter spellings
    const availableDays = [
        { key: "Mon", label: "Mon" },
        { key: "Tue", label: "Tue" },
        { key: "Wed", label: "Wed" },
        { key: "Thu", label: "Thu" },
        { key: "Fri", label: "Fri" },
        { key: "Sat", label: "Sat" },
        { key: "Sun", label: "Sun" }
    ];

    const capabilities = [
        { value: "local", label: "Local Regional Focus", desc: "Intra-city or regional hub dispatch networks" },
        { value: "national", label: "National Coverage", desc: "Cross-border distribution and nationwide haulage" }
    ];

    // Simple chronological validation helper for clean UI warning states
    const hasTimeError = localData.operatingHoursStart &&
        localData.operatingHoursEnd &&
        localData.operatingHoursStart >= localData.operatingHoursEnd;

    // Handles toggling days in an array matrix
    const toggleDay = (dayKey) => {
        const currentDays = localData.operatingDays || [];
        const updatedDays = currentDays.includes(dayKey)
            ? currentDays.filter((d) => d !== dayKey)
            : [...currentDays, dayKey];

        handleFieldChange("operatingDays", updatedDays);
    };

    // Corrected logic: Form is only considered configured when BOTH values are completely present
    const isTimeSelected = localData.operatingHoursStart && localData.operatingHoursEnd;

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
                        placeholder="e.g., Accra, Kumasi, Tamale, Western Region (comma-separated)"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
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
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm cursor-pointer"
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

                {/* Days of Operation Selection Matrix */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Days of Operation <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availableDays.map((day) => {
                            const isSelected = (localData.operatingDays || []).includes(day.key);
                            return (
                                <button
                                    key={day.key}
                                    type="button"
                                    onClick={() => toggleDay(day.key)}
                                    title={`Toggle ${day.key}`}
                                    className={`px-4 h-10 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center shadow-sm select-none min-w-[54px] ${isSelected
                                        ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                >
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Structured operating hours timeline system */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 max-w-md">
                    <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        {isTimeSelected ? "Daily Operational Hours Window" : "Set Operational Hours Window"} <span className="text-rose-500">*</span>
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Native Time Type - Opening */}
                        <div className="flex-1 relative">
                            <input
                                id="operatingHoursStart"
                                type="time"
                                name="operatingHoursStart"
                                value={localData.operatingHoursStart || ""}
                                onChange={(e) => handleFieldChange("operatingHoursStart", e.target.value)}
                                className={`w-full px-3 py-2 bg-white border rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm ${hasTimeError ? "border-rose-400 focus:border-rose-500" : "border-slate-300 focus:border-indigo-500"
                                    }`}
                                required
                            />
                        </div>

                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider px-1">to</span>

                        {/* Native Time Type - Closing */}
                        <div className="flex-1 relative">
                            <input
                                id="operatingHoursEnd"
                                type="time"
                                name="operatingHoursEnd"
                                value={localData.operatingHoursEnd || ""}
                                onChange={(e) => handleFieldChange("operatingHoursEnd", e.target.value)}
                                className={`w-full px-3 py-2 bg-white border rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm ${hasTimeError ? "border-rose-400 focus:border-rose-500" : "border-slate-300 focus:border-indigo-500"
                                    }`}
                                required
                            />
                        </div>
                    </div>

                    {/* Inline logical data safeguard */}
                    {hasTimeError && (
                        <p className="text-[11px] text-rose-600 font-semibold mt-0.5 tracking-wide animate-in fade-in duration-100">
                            Closing time must be later than opening time.
                        </p>
                    )}
                </div>

                {/* Delivery Capability */}
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
                                        ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/15"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                                        }`}
                                >
                                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? "border-indigo-600 text-indigo-600" : "border-slate-300"
                                        }`}>
                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
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