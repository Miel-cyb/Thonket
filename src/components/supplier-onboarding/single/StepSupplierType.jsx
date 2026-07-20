import React from "react";

export default function StepSupplierType({ formData, updateFormData }) {
    // Isolated key targeting the specific supplier payment profile
    const localData = formData.supplierType || {};

    const handleFieldChange = (name, value) => {
        updateFormData("supplierType", { [name]: value });
    };

    // When changing the terms window, we clear custom text if they pick a standard option
    const handleTermsWindowChange = (e) => {
        const val = e.target.value;
        const updates = { creditTermsWindow: val };
        if (val !== "custom") {
            updates.creditTermsWindowCustom = "";
        }
        updateFormData("supplierType", updates);
    };

    const paymentModels = [
        {
            value: "cash",
            label: "Cash-Based / Immediate Payment",
            desc: "Payment is settled instantly upon order placement, delivery dispatch, or receipt of invoice.",
            icon: (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            value: "credit",
            label: "Credit-Based / Net Terms",
            desc: "Goods are supplied upfront with an agreed repayment cycle (e.g., Net 30, Net 60 days).",
            icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            value: "both",
            label: "Hybrid / Flexible Terms",
            desc: "Supports both models depending on order volume, category thresholds, or contract structures.",
            icon: (
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    return (
        <div className="space-y-8">

            {/* Clear, Human-Centric UX Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Supplier Payment Profile
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Select how financial transactions will be managed with this supplier to structure default accounting workflows.
                </p>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 tracking-wide uppercase block">
                    What is your primary commercial relationship with this supplier? <span className="text-rose-500">*</span>
                </label>

                {/* Interactive Radio-Card Matrix */}
                <div className="grid grid-cols-1 gap-3.5">
                    {paymentModels.map((model) => {
                        const isSelected = localData.paymentTermsType === model.value;
                        return (
                            <button
                                key={model.value}
                                type="button"
                                onClick={() => handleFieldChange("paymentTermsType", model.value)}
                                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-4 relative outline-none ${isSelected
                                    ? "border-slate-900 bg-slate-50/60 ring-1 ring-slate-900/10 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/20"
                                    }`}
                            >
                                {/* Radio Indicator with customized Icons */}
                                <div className={`p-2 rounded-lg border flex-shrink-0 transition-colors ${isSelected ? "bg-white border-slate-300 shadow-xs" : "bg-slate-50 border-slate-200"}`}>
                                    {model.icon}
                                </div>

                                <div className="flex-1 pr-6">
                                    <p className="text-sm font-semibold text-slate-900">{model.label}</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{model.desc}</p>
                                </div>

                                <div className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "border-slate-900" : "border-slate-300"}`}>
                                    {isSelected && <div className="h-2 w-2 rounded-full bg-slate-900" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Conditional Sub-Form: Displays details if credit elements are involved */}
            {(localData.paymentTermsType === "credit" || localData.paymentTermsType === "both") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Standard Credit Terms Cycle Selector */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="creditTermsWindow" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                            Default Credit Window <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="creditTermsWindow"
                                name="creditTermsWindow"
                                value={localData.creditTermsWindow || ""}
                                onChange={handleTermsWindowChange}
                                className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                                required
                            >
                                <option value="" disabled hidden>Select term length...</option>
                                <option value="immediate">Due on Receipt / Cash on Delivery (COD)</option>
                                <option value="15">Net 15 Days</option>
                                <option value="30">Net 30 Days (Standard)</option>
                                <option value="30eom">Net 30 EOM (End of Month)</option>
                                <option value="60">Net 60 Days</option>
                                <option value="60eom">Net 60 EOM (End of Month)</option>
                                <option value="90">Net 90 Days (Extended)</option>
                                <option value="custom">Custom Arrangement</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Nested Conditional Input for Custom Arrangements */}
                        {localData.creditTermsWindow === "custom" && (
                            <div className="mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                <input
                                    id="creditTermsWindowCustom"
                                    type="text"
                                    name="creditTermsWindowCustom"
                                    value={localData.creditTermsWindowCustom || ""}
                                    onChange={(e) => handleFieldChange("creditTermsWindowCustom", e.target.value)}
                                    placeholder="e.g., Net 45, split payments, milestone billing"
                                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {/* Credit Limit Input with GH currency symbol reference */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="creditLimitAmount" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                            Approved Credit Ceiling <span className="text-slate-400 font-normal normal-case ml-1">(Optional)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-slate-400 pointer-events-none">
                                GH₵
                            </span>
                            <input
                                id="creditLimitAmount"
                                type="number"
                                name="creditLimitAmount"
                                value={localData.creditLimitAmount || ""}
                                onChange={(e) => handleFieldChange("creditLimitAmount", e.target.value)}
                                placeholder="e.g., 50,000"
                                className="w-full pl-14 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Special Instructions Field */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <label htmlFor="billingNotes" className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Payment & Invoicing Instructions <span className="text-slate-400 font-normal normal-case ml-1">(Optional)</span>
                </label>
                <textarea
                    id="billingNotes"
                    name="billingNotes"
                    rows="4"
                    value={localData.billingNotes || ""}
                    onChange={(e) => handleFieldChange("billingNotes", e.target.value)}
                    placeholder="Document specific payment structures, deposit requirements, or banking coordination rules..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm resize-none leading-relaxed"
                />
            </div>

        </div>
    );
}