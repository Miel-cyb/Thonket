import React from "react";

export default function StepLegalVerification({ formData, updateFormData }) {
    // Safe extraction object fallback from the wizard core state
    const localData = formData.legalVerification || {};

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        // If it's a file input, grab the first file object; otherwise, grab the text value
        const val = type === "file" ? files[0] : value;

        updateFormData("legalVerification", { [name]: val });
    };

    return (
        <div className="space-y-6">

            {/* Informative Header Context */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Legal & Regulatory Verification
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Provide authenticated corporate governance identifiers, corporate certifications, and tax compliance indices.
                </p>
            </div>

            {/* Grid Inputs Wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Business Registration Number */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="registrationNumber" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Business Registration Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="registrationNumber"
                        type="text"
                        name="registrationNumber"
                        value={localData.registrationNumber || ""}
                        onChange={handleChange}
                        placeholder="e.g., CRN-9081234"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Tax ID / VAT Number */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="taxId" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Tax ID / VAT Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="taxId"
                        type="text"
                        name="taxId"
                        value={localData.taxId || ""}
                        onChange={handleChange}
                        placeholder="e.g., GB123456789"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* License Type Selector */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="licenseType" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Operational License Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="licenseType"
                        type="text"
                        name="licenseType"
                        value={localData.licenseType || ""}
                        onChange={handleChange}
                        placeholder="e.g., Wholesale Distribution License"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Optional Certificate Image Upload */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="documentReference" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Certification Document Image <span className="text-slate-400 font-normal lowercase">(optional)</span>
                    </label>

                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-center hover:bg-slate-50 transition-colors group">
                        <svg className="w-8 h-8 text-slate-400 mb-2 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-700">
                            {localData.documentReference ? localData.documentReference.name : "Click or drag to upload document image"}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, or WEBP</span>

                        <input
                            id="documentReference"
                            type="file"
                            name="documentReference"
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}