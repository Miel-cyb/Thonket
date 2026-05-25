import React from "react";

export default function StepLegalVerification({ formData, updateFormData }) {
    // Safe extraction object fallback from the wizard core state
    const localData = formData.legalVerification || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData("legalVerification", { [name]: value });
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
                <div className="flex flex-col gap-1.5">
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

                {/* License Expiry Date Selector */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="licenseExpiry" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        License Expiry Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="licenseExpiry"
                        type="date"
                        name="licenseExpiry"
                        value={localData.licenseExpiry || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Styled Document Reference Reference Dropzone Mock */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="documentReference" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Certification Document Reference <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 text-center hover:bg-slate-50 transition-colors group">
                        <svg className="w-8 h-8 text-slate-400 mb-2 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-700">Enter validation payload data lower down</span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Provide a resource storage URL path, file server directory link, or secure index string hash</span>

                        <input
                            id="documentReference"
                            type="text"
                            name="documentReference"
                            value={localData.documentReference || ""}
                            onChange={handleChange}
                            placeholder="https://s3.amazonaws.com/bucket/legal_cert_772.pdf"
                            className="w-full mt-4 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
                            required
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}