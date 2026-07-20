import React from "react";

export default function StepContactInformation({ formData, updateFormData }) {
    // Safe default parsing from the root wizard state
    const localData = formData.contactInformation || {};
    const secondaryContacts = localData.secondaryContacts || [];

    // Handles changes for the standalone primary fields
    const handlePrimaryChange = (e) => {
        const { name, value } = e.target;
        updateFormData("contactInformation", { [name]: value });
    };

    // Handles individual field modifications within the secondary contact array
    const handleSecondaryChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSecondaries = [...secondaryContacts];
        updatedSecondaries[index] = {
            ...updatedSecondaries[index],
            [name]: value
        };
        updateFormData("contactInformation", { secondaryContacts: updatedSecondaries });
    };

    // Appends a clean, blank contact object onto the list
    const addSecondaryContact = () => {
        const updatedSecondaries = [
            ...secondaryContacts,
            { name: "", role: "", phone: "", whatsapp: "", email: "" }
        ];
        updateFormData("contactInformation", { secondaryContacts: updatedSecondaries });
    };

    // Remonves a targeted secondary contact by its index positions
    const removeSecondaryContact = (index) => {
        const updatedSecondaries = secondaryContacts.filter((_, i) => i !== index);
        updateFormData("contactInformation", { secondaryContacts: updatedSecondaries });
    };

    return (
        <div className="space-y-6">

            {/* Informative Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Contact Information
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Establish the primary communication points of contact and backup escalations for ongoing operational procurement.
                </p>
            </div>

            {/* Section: Primary Contact */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                    Primary Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="primaryContactName" className="text-xs font-semibold text-slate-700 uppercase">
                            Primary Contact Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="primaryContactName"
                            type="text"
                            name="primaryContactName"
                            value={localData.primaryContactName || ""}
                            onChange={handlePrimaryChange}
                            placeholder="e.g., Sarah Jenkins"
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="contactRole" className="text-xs font-semibold text-slate-700 uppercase">
                            Role / Position <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="contactRole"
                            type="text"
                            name="contactRole"
                            value={localData.contactRole || ""}
                            onChange={handlePrimaryChange}
                            placeholder="e.g., Logistics Director"
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700 uppercase">
                            Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={localData.phoneNumber || ""}
                            onChange={handlePrimaryChange}
                            placeholder="e.g., +1 (555) 019-2834"
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="whatsappNumber" className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5">
                            WhatsApp Number <span className="text-slate-400 font-normal text-[11px] normal-case">(Optional)</span>
                        </label>
                        <input
                            id="whatsappNumber"
                            type="tel"
                            name="whatsappNumber"
                            value={localData.whatsappNumber || ""}
                            onChange={handlePrimaryChange}
                            placeholder="e.g., +1 (555) 019-2834"
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label htmlFor="emailAddress" className="text-xs font-semibold text-slate-700 uppercase">
                            Corporate Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            id="emailAddress"
                            type="email"
                            name="emailAddress"
                            value={localData.emailAddress || ""}
                            onChange={handlePrimaryChange}
                            placeholder="s.jenkins@company.com"
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Section: Secondary Contacts Loop */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Secondary Contacts ({secondaryContacts.length})
                    </h3>
                    <button
                        type="button"
                        onClick={addSecondaryContact}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Contact
                    </button>
                </div>

                {secondaryContacts.map((contact, index) => (
                    <div key={index} className="p-5 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-4 relative group">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                                Contact #{index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeSecondaryContact(index)}
                                className="text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={contact.name || ""}
                                    onChange={(e) => handleSecondaryChange(index, e)}
                                    placeholder="e.g., Robert Chen"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase">
                                    Role / Position
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={contact.role || ""}
                                    onChange={(e) => handleSecondaryChange(index, e)}
                                    placeholder="e.g., Procurement Associate"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={contact.phone || ""}
                                    onChange={(e) => handleSecondaryChange(index, e)}
                                    placeholder="e.g., +1 (555) 014-9921"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase flex items-center gap-1.5">
                                    WhatsApp Number <span className="text-slate-400 font-normal text-[11px] normal-case">(Optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={contact.whatsapp || ""}
                                    onChange={(e) => handleSecondaryChange(index, e)}
                                    placeholder="e.g., +1 (555) 014-9921"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-600 uppercase">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={contact.email || ""}
                                    onChange={(e) => handleSecondaryChange(index, e)}
                                    placeholder="r.chen@company.com"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {secondaryContacts.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <p className="text-xs text-slate-400 font-medium">No secondary backup contacts added yet.</p>
                    </div>
                )}
            </div>

        </div>
    );
}