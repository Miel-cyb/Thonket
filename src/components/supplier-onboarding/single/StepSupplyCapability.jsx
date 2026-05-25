import React from "react";

export default function StepSupplyCapability({ formData, updateFormData }) {
    // Safe default structural extraction from the core wizard state tree
    const localData = formData.supplyCapability || {};

    const handleFieldChange = (name, value) => {
        updateFormData("supplyCapability", { [name]: value });
    };

    const availabilityOptions = [
        { value: "always", label: "Continuous Supply", desc: "Inventory is consistently maintained year-round" },
        { value: "seasonal", label: "Seasonal Supply", desc: "Production depends heavily on crop/harvest windows" }
    ];

    return (
        <div className="space-y-6">

            {/* Informative Step Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Supply & Inventory Capability
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Catalog product portfolios, volume capabilities, and global distribution operational windows.
                </p>
            </div>

            {/* Grid Matrix Layout Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Input Field: Product Categories */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="productCategories" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Product Categories <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="productCategories"
                        type="text"
                        name="productCategories"
                        value={localData.productCategories || ""}
                        onChange={(e) => handleFieldChange("productCategories", e.target.value)}
                        placeholder="e.g., Beverages, Grains, Packaged Dairy Products (comma-separated)"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Input Field: Brands Handled */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="brandsHandled" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Brands / Portfolios Handled <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="brandsHandled"
                        type="text"
                        name="brandsHandled"
                        value={localData.brandsHandled || ""}
                        onChange={(e) => handleFieldChange("brandsHandled", e.target.value)}
                        placeholder="e.g., Nestle, Unilever, Proprietary Farm Labels"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Combined Quantitative Matrix: Estimated Monthly Capacity */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="capacityValue" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Estimated Monthly Throughput Capacity <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex rounded-xl shadow-sm border border-slate-300 bg-white overflow-hidden focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
                        <input
                            id="capacityValue"
                            type="number"
                            name="capacityValue"
                            min="0"
                            value={localData.capacityValue || ""}
                            onChange={(e) => handleFieldChange("capacityValue", e.target.value)}
                            placeholder="e.g., 25000"
                            className="w-full pl-4 pr-3 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            required
                        />
                        {/* Inline Measurement Unit Picker */}
                        <div className="relative flex items-center shrink-0">
                            <select
                                name="capacityUnit"
                                value={localData.capacityUnit || "units"}
                                onChange={(e) => handleFieldChange("capacityUnit", e.target.value)}
                                className="bg-slate-50 border-l border-slate-200 pl-4 pr-8 py-2 h-full text-xs font-bold uppercase tracking-wider text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
                            >
                                <option value="units">Units</option>
                                <option value="kg">kg</option>
                                <option value="tons">Tons</option>
                                <option value="liters">Liters</option>
                                <option value="pallets">Pallets</option>
                            </select>
                            <div className="absolute right-2.5 pointer-events-none text-slate-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Availability Type Selection Cards */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 pt-2">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Stock Availability Cycle <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availabilityOptions.map((option) => {
                            const isSelected = localData.availabilityType === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleFieldChange("availabilityType", option.value)}
                                    className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 relative ${isSelected
                                        ? "border-slate-900 bg-slate-50/50 ring-1 ring-slate-900/15"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30"
                                        }`}
                                >
                                    {/* Clean customized dynamic radio asset indicator button element */}
                                    <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? "border-slate-900 text-slate-900" : "border-slate-300"
                                        }`}>
                                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-normal">{option.desc}</p>
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