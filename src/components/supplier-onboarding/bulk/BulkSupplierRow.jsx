import React from "react";

export default function BulkSupplierRow({
    data = {},
    index,
    onUpdateRow,
    onDeleteRow
}) {

    // Destructure with reliable empty fallbacks for runtime stability
    const {
        businessName = "",
        businessType = "manufacturer",
        phone = "",
        email = ""
    } = data;

    // Unified event processing callback handler
    const handleFieldChange = (fieldName, value) => {
        if (onUpdateRow) {
            onUpdateRow(index, { [fieldName]: value });
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm hover:border-slate-300 transition-colors group">

            {/* Row Identifier Metric Index Label */}
            <div className="sm:col-span-1 flex items-center justify-center sm:justify-start">
                <span className="text-xs font-bold font-mono text-slate-400 bg-slate-50 border border-slate-200/60 w-6 h-6 rounded-lg flex items-center justify-center">
                    {index + 1}
                </span>
            </div>

            {/* Input Field: Corporate Registration Entity Name */}
            <div className="sm:col-span-4 flex flex-col gap-1">
                <input
                    type="text"
                    value={businessName}
                    onChange={(e) => handleFieldChange("businessName", e.target.value)}
                    placeholder="Legal Business Name"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                    required
                />
            </div>

            {/* Select Box Option Picker: Business Classification Tier */}
            <div className="sm:col-span-2 flex flex-col gap-1">
                <div className="relative">
                    <select
                        value={businessType}
                        onChange={(e) => handleFieldChange("businessType", e.target.value)}
                        className="w-full appearance-none px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all cursor-pointer"
                    >
                        <option value="manufacturer">Manufacturer</option>
                        <option value="distributor">Distributor</option>
                        <option value="broker">Wholesale Broker</option>
                    </select>
                    <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Input Field: Direct Line Contact Telecom String */}
            <div className="sm:col-span-2 flex flex-col gap-1">
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="+44 20 7946 0192"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 font-mono placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                />
            </div>

            {/* Input Field: Primary Corporate Communication Inbox Endpoint */}
            <div className="sm:col-span-2 flex flex-col gap-1">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="procurement@brand.com"
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
                    required
                />
            </div>

            {/* Inline Utility Operation Segment: Line Deletion Hook */}
            <div className="sm:col-span-1 flex items-center justify-center sm:justify-end">
                <button
                    type="button"
                    onClick={() => onDeleteRow && onDeleteRow(index)}
                    title="Delete this line row profile"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

        </div>
    );
}