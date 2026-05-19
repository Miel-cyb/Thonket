'use client';

import { useState } from "react";
import {
    User, Briefcase, Mail, MapPin,
    PhoneCall, UserCheck, Home, CreditCard
} from "lucide-react";

export default function CreateCustomerForm({ onCustomerCreated, onCancel }) {

    const [formData, setFormData] = useState({
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        idNumber: "",
        occupation: "",
        personalAddress: ""
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (onCustomerCreated) {
            onCustomerCreated({
                ...formData,
                type: "Individual",
                id: Date.now()
            });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-200">

                {/* CORE HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                            <User size={28} className="stroke-[2.25]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                New Individual Customer
                            </h2>
                            <p className="text-base text-slate-500 mt-1 font-medium">
                                Register a new direct consumer profile in the system database.
                            </p>
                        </div>
                    </div>
                </div>

                {/* DATA BODY LAYOUT */}
                <div className="space-y-8">

                    {/* SECTION 1: PERSONAL INFORMATION */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <div className="pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2.5">
                                <UserCheck size={18} className="text-indigo-600 stroke-[2.5]" />
                                Personal Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* FULL NAME */}
                            <div className="sm:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Full Legal Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Alexander Wright"
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-150 shadow-sm"
                                        value={formData.contactName}
                                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* EMAIL ADDRESS */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Email Address <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-150 shadow-sm"
                                        value={formData.contactEmail}
                                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PHONE NUMBER */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-150 shadow-sm"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ID / PASSPORT NO */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    ID / Passport Number
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Identification Document Number"
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-150 shadow-sm"
                                        value={formData.idNumber}
                                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* OCCUPATION */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 block">
                                    Occupation / Profession
                                </label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Software Architect"
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-150 shadow-sm"
                                        value={formData.occupation}
                                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* SECTION 2: METADATA & FULFILLMENT */}
                    <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">

                        {/* ADDRESS COMPONENT (FULL WIDTH) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Home size={16} className="text-indigo-600" /> Fulfillment Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                                <textarea
                                    rows="4"
                                    placeholder="Enter complete street name, housing/suite units, state, and postal index..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-base text-slate-900 font-medium placeholder-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none resize-none transition-all duration-150 shadow-sm"
                                    value={formData.personalAddress}
                                    onChange={(e) => handleInputChange('personalAddress', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                </div>

                {/* ACTIONS FOOTER */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl text-base font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] transition duration-150"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-base font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.99] transition duration-150"
                    >
                        Save Customer Profile
                    </button>
                </div>

            </form>
        </div>
    );
}