'use client';

import { useState } from "react";
import {
    UserPlus, Building2, User, Briefcase, Mail,
    ShieldCheck, Hash, MapPin, Plus, Trash2,
    Globe, PhoneCall, UserCheck, Home, CreditCard
} from "lucide-react";

export default function CreateCustomerForm({ onCustomerCreated }) {
    const [formData, setFormData] = useState({
        type: "Wholesale", // Wholesale or Individual
        assignedAgent: "Current Agent",
        // Business Fields
        entityName: "",
        taxId: "",
        website: "",
        // Individual/Contact Fields
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        // Branch/Address Logic
        branches: [{ id: Date.now(), name: "Headquarters", address: "", city: "" }],
        personalAddress: ""
    });

    const salesAgents = ["Current Agent", "Sarah Miller", "Marcus Chen", "Elena Rodriguez"];

    const handleTypeChange = (newType) => {
        setFormData(prev => ({ ...prev, type: newType }));
    };

    const addBranch = () => {
        setFormData(prev => ({
            ...prev,
            branches: [...prev.branches, { id: Date.now(), name: "", address: "", city: "" }]
        }));
    };

    const removeBranch = (id) => {
        if (formData.branches.length === 1) return;
        setFormData(prev => ({
            ...prev,
            branches: prev.branches.filter(b => b.id !== id)
        }));
    };

    const handleBranchChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            branches: prev.branches.map(b => b.id === id ? { ...b, [field]: value } : b)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onCustomerCreated) onCustomerCreated({ ...formData, id: Date.now() });
    };

    const isWholesale = formData.type === "Wholesale";

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-700">

                {/* 1. DYNAMIC HEADER & TOGGLE */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm transition-all">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-3xl shadow-xl transition-all duration-500 bg-indigo-600 shadow-indigo-100 text-white`}>
                            {isWholesale ? <Building2 size={32} /> : <User size={32} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                {isWholesale ? "Corporate Accession" : "Individual Enrollment"}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                {isWholesale ? "Registering Business Entity & Nodes" : "Direct Consumer Entry Protocol"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        {['Wholesale', 'Individual'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => handleTypeChange(t)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === t
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 2. PRIMARY DATA COLUMN */}
                    <div className="lg:col-span-2 space-y-8">

                        {isWholesale ? (
                            /* WHOLESALE SPECIFIC SECTIONS */
                            <>
                                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 animate-in slide-in-from-left-4 duration-500">
                                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <ShieldCheck size={16} /> Business Credentials
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="LEGAL ENTITY NAME"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                                value={formData.entityName}
                                                onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="TAX ID / REGISTRATION"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                                value={formData.taxId}
                                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative md:col-span-2">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="url"
                                                placeholder="CORPORATE WEBSITE"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 animate-in slide-in-from-left-6 duration-500">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <MapPin size={16} /> Operational Branches
                                        </h3>
                                        <button type="button" onClick={addBranch} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.branches.map((branch) => (
                                            <div key={branch.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                                <input
                                                    placeholder="BRANCH NAME"
                                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-400"
                                                    value={branch.name}
                                                    onChange={(e) => handleBranchChange(branch.id, 'name', e.target.value)}
                                                />
                                                <input
                                                    placeholder="PHYSICAL ADDRESS"
                                                    className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-400"
                                                    value={branch.address}
                                                    onChange={(e) => handleBranchChange(branch.id, 'address', e.target.value)}
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        placeholder="CITY"
                                                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-indigo-400"
                                                        value={branch.city}
                                                        onChange={(e) => handleBranchChange(branch.id, 'city', e.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeBranch(branch.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : (
                            /* INDIVIDUAL SPECIFIC SECTIONS (Now using Indigo/Slate) */
                            <>
                                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 animate-in slide-in-from-right-4 duration-500">
                                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <UserCheck size={16} /> Personal Identification
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="relative md:col-span-2">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="FULL LEGAL NAME"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                                value={formData.contactName}
                                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                            />
                                        </div>
                                        <div className="relative">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="ID / PASSPORT NO."
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                placeholder="OCCUPATION"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 space-y-6 animate-in slide-in-from-right-6 duration-500">
                                    <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Home size={16} /> Fulfillment Address
                                    </h3>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-6 text-slate-300" size={18} />
                                        <textarea
                                            rows="3"
                                            placeholder="PRIMARY SHIPPING & BILLING RESIDENCE"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 outline-none resize-none"
                                            value={formData.personalAddress}
                                            onChange={(e) => setFormData({ ...formData, personalAddress: e.target.value })}
                                        />
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    {/* 3. SHARED SIDEBAR */}
                    <div className="space-y-8">
                        <section className="p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl transition-all duration-500 bg-slate-900 shadow-indigo-100">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-indigo-400">
                                <UserCheck size={16} /> {isWholesale ? "Primary Liaison" : "Connectivity Nodes"}
                            </h3>
                            <div className="space-y-4">
                                {isWholesale && (
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            placeholder="CONTACT FULL NAME"
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:text-slate-900 transition-all outline-none"
                                            value={formData.contactName}
                                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        placeholder="DIRECT EMAIL"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:text-slate-900 transition-all outline-none"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        placeholder="PHONE NUMBER"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:bg-white focus:text-slate-900 transition-all outline-none"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <label className="text-[10px] font-black uppercase tracking-widest mb-3 block text-indigo-400">Custodian Assignment</label>
                                <select
                                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-white/20 transition-all"
                                    value={formData.assignedAgent}
                                    onChange={(e) => setFormData({ ...formData, assignedAgent: e.target.value })}
                                >
                                    {salesAgents.map(agent => (
                                        <option key={agent} value={agent} className="text-slate-900">{agent}</option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <button
                            type="submit"
                            className={`w-full py-6 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 hover:-translate-y-1 ${isWholesale
                                    ? 'bg-emerald-500 shadow-emerald-100 hover:bg-emerald-600'
                                    : 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700'
                                }`}
                        >
                            Authorize {isWholesale ? "Entity" : "Client"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}