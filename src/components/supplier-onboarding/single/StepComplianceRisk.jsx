import React from "react";

export default function StepComplianceRisk({ formData, updateFormData }) {
    // Safe extraction from centralized state key
    const localData = formData.complianceRisk || {};

    const handleFieldChange = (name, value) => {
        updateFormData("complianceRisk", { [name]: value });
    };

    const riskTiers = [
        { value: "low", label: "Low Risk", color: "border-emerald-200 bg-emerald-50 text-emerald-800 ring-emerald-500/10" },
        { value: "medium", label: "Medium Risk", color: "border-amber-200 bg-amber-50 text-amber-800 ring-amber-500/10" },
        { value: "high", label: "High Risk", color: "border-rose-200 bg-rose-50 text-rose-800 ring-rose-500/10" }
    ];

    return (
        <div className="space-y-6">

            {/* Informative Step Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Compliance & Risk Assessment
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Evaluate systemic risk thresholds and verify regulatory alignment properties.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Verification Status Selection */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="verificationStatus" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Verification Status <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="verificationStatus"
                            name="verificationStatus"
                            value={localData.verificationStatus || ""}
                            onChange={(e) => handleFieldChange("verificationStatus", e.target.value)}
                            className="w-full appearance-none px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm cursor-pointer"
                            required
                        >
                            <option value="" disabled hidden>Select state...</option>
                            <option value="pending">⏳ Pending Review</option>
                            <option value="verified">✅ Verified & Approved</option>
                            <option value="rejected">❌ Rejected / Flagged</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Risk Level Toggles - Converted from Dropdown to Interactive Badges */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Assigned Risk Level <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {riskTiers.map((tier) => {
                            const isSelected = localData.riskLevel === tier.value;
                            return (
                                <button
                                    key={tier.value}
                                    type="button"
                                    onClick={() => handleFieldChange("riskLevel", tier.value)}
                                    className={`border p-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ring-1 ${isSelected
                                            ? `${tier.color} border-slate-900 ring-slate-900/10 shadow-sm scale-[1.01]`
                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 ring-transparent"
                                        }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${tier.value === "low" ? "bg-emerald-500" : tier.value === "medium" ? "bg-amber-500" : "bg-rose-500"
                                        }`} />
                                    {tier.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Extended Notes Field */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="complianceNotes" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Compliance & Due Diligence Notes <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
                    </label>
                    <textarea
                        id="complianceNotes"
                        name="complianceNotes"
                        rows="4"
                        value={localData.complianceNotes || ""}
                        onChange={(e) => handleFieldChange("complianceNotes", e.target.value)}
                        placeholder="Add internal verification details, audit trail pointers, or exception conditions..."
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm resize-none"
                    />
                </div>

            </div>
        </div>
    );
}