import React from "react";

export default function StepContactInformation({ formData, updateFormData }) {
    // Safe default parsing from the root wizard state
    const localData = formData.contactInformation || {};

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData("contactInformation", { [name]: value });
    };

    return (
        <div className="space-y-6">

            {/* Informative Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Contact Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Establish the primary communication points of contact for ongoing operational procurement.
                </p>
            </div>

            {/* Grid Inputs Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Contact Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="primaryContactName" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Primary Contact Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="primaryContactName"
                        type="text"
                        name="primaryContactName"
                        value={localData.primaryContactName || ""}
                        onChange={handleChange}
                        placeholder="e.g., Sarah Jenkins"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Role / Position */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="contactRole" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Role / Position <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="contactRole"
                        type="text"
                        name="contactRole"
                        value={localData.contactRole || ""}
                        onChange={handleChange}
                        placeholder="e.g., Logistics Director"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        value={localData.phoneNumber || ""}
                        onChange={handleChange}
                        placeholder="e.g., +1 (555) 019-2834"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="whatsappNumber" className="text-xs font-semibold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                        WhatsApp Number
                        <span className="text-slate-400 font-normal text-[11px] uppercase tracking-normal">(Optional)</span>
                    </label>
                    <input
                        id="whatsappNumber"
                        type="tel"
                        name="whatsappNumber"
                        value={localData.whatsappNumber || ""}
                        onChange={handleChange}
                        placeholder="e.g., +1 (555) 019-2834"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                    />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label htmlFor="emailAddress" className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                        Corporate Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                        id="emailAddress"
                        type="email"
                        name="emailAddress"
                        value={localData.emailAddress || ""}
                        onChange={handleChange}
                        placeholder="s.jenkins@company.com"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        required
                    />
                </div>

                {/* Secondary Contact Alias */}
                <div className="flex flex-col gap-1.5 sm:col-span-2 pt-2 border-t border-slate-100 mt-2">
                    <label htmlFor="secondaryContact" className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                        Secondary Point of Contact <span className="text-slate-400 font-normal text-[11px]">(Backup Escalation)</span>
                    </label>
                    <input
                        id="secondaryContact"
                        type="text"
                        name="secondaryContact"
                        value={localData.secondaryContact || ""}
                        onChange={handleChange}
                        placeholder="e.g., Account Management Desk (ops@company.com)"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                    />
                </div>

            </div>
        </div>
    );
}