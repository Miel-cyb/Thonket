import React from "react";

export default function StepBusinessIdentity({ formData, updateFormData }) {
    // Safe default reading from the parent wizard centralized state tree
    const localData = formData.businessIdentity || {};

    // Handle value modifications dynamically per input name
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData("businessIdentity", { [name]: value });
    };

    return (
        <div className="space-y-6">

            {/* Structural Step Header Context */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Business Identity
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Provide primary registered legal naming conventions and operational parameters.
                </p>
            </div>

            {/* Grid Inputs Wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Input Field: Legal Business Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessName" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Legal Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="businessName"
                        type="text"
                        name="businessName"
                        value={localData.businessName || ""}
                        onChange={handleChange}
                        placeholder="e.g., Global Logistics Corp"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Input Field: Trading Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="tradingName" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Trading Name <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                    </label>
                    <input
                        id="tradingName"
                        type="text"
                        name="tradingName"
                        value={localData.tradingName || ""}
                        onChange={handleChange}
                        placeholder="e.g., Global Express"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                    />
                </div>

                {/* Selection Dropdown Field: Business Classification Type */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="businessType" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Business Type <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="businessType"
                            name="businessType"
                            value={localData.businessType || ""}
                            onChange={handleChange}
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                            required
                        >
                            <option value="" disabled hidden>Select business structure...</option>
                            <option value="manufacturer">Manufacturer</option>
                            <option value="distributor">Distributor</option>
                            <option value="importer">Importer</option>
                        </select>
                        {/* Custom down arrow element to match look and feel */}
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Input Field: Country of Operation */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="countryOfOperation" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Country of Operation <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="countryOfOperation"
                        type="text"
                        name="countryOfOperation"
                        value={localData.countryOfOperation || ""}
                        onChange={handleChange}
                        placeholder="e.g., United Kingdom"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Input Field: Year Established */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="yearEstablished" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Year Established <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="yearEstablished"
                        type="number"
                        name="yearEstablished"
                        min="1700"
                        max="2026"
                        value={localData.yearEstablished || ""}
                        onChange={handleChange}
                        placeholder="e.g., 2014"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        required
                    />
                </div>

            </div>
        </div>
    );
}