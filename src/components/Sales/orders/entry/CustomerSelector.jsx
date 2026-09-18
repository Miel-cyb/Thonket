'use client';

import { Users, UserPlus, Search, X, Building2, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CustomerSelector({
    customers = [],
    selectedCustomer,
    setSelectedCustomer,
    onAddCustomer
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // "all" | "wholesale" | "retail"
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter customers based on search text and selected business type tab
    const filteredCustomers = customers.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.id.toString().includes(searchTerm) ||
            (c.tier && c.tier.toLowerCase().includes(searchTerm.toLowerCase()));

        const type = (c.type || c.category || '').toLowerCase();
        const isWholesale = type.includes('wholesale') || type.includes('credit');
        const isRetail = type.includes('retail') || type.includes('cash') || type.includes('individual');

        if (filterType === 'wholesale') return matchesSearch && isWholesale;
        if (filterType === 'retail') return matchesSearch && isRetail;
        return matchesSearch;
    });

    const handleSelect = (customer) => {
        setSelectedCustomer(customer);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="bg-white p-2.5 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center z-[120] w-full max-w-[1400px] mx-auto">

            {/* 1. SELECTED CUSTOMER IDENTITY CARD */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white rounded-[1.5rem] min-w-[240px] shrink-0">
                <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-[11px] font-black border border-white/10 shadow-sm overflow-hidden shrink-0">
                    {selectedCustomer?.name ? (
                        selectedCustomer.name.substring(0, 2).toUpperCase()
                    ) : (
                        <Building2 size={16} className="text-white" />
                    )}
                </div>
                <div className="overflow-hidden">
                    <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-0">
                        {selectedCustomer ? "Active Customer Profile" : "Target Account"}
                    </p>
                    <p className="text-[13px] font-black uppercase truncate leading-tight">
                        {selectedCustomer ? selectedCustomer.name : "Select Customer..."}
                    </p>
                </div>
            </div>

            {/* 2. CUSTOMER SEARCH & FILTER DROPDOWN */}
            <div className="flex-1 relative" ref={dropdownRef}>
                <div className="relative z-[130]">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        <Search size={18} className="text-slate-400" />
                    </div>

                    <input
                        type="text"
                        placeholder={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.type || 'Standard'})` : "Search by name, ID or tier..."}
                        value={searchTerm}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-[1.5rem] text-[12px] font-bold uppercase tracking-wider transition-all outline-none ${selectedCustomer
                            ? "border-indigo-200 bg-indigo-50/40 text-slate-900"
                            : "border-slate-100 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-50"
                            }`}
                    />

                    {selectedCustomer && (
                        <button
                            onClick={() => setSelectedCustomer(null)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center bg-white rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* THE SEGREGATED DROPDOWN */}
                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[500px] bg-white border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-[1.5rem] overflow-hidden z-[200] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">

                        {/* Dropdown Header & Category Tabs */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/90 space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Select Client Account</h4>
                                <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-0.5 rounded-full shadow-sm">{filteredCustomers.length} Available</span>
                            </div>

                            {/* UX Segment Filter Tabs (High Visibility) */}
                            <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1.5 rounded-xl">
                                <button
                                    onClick={() => setFilterType("all")}
                                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${filterType === "all" ? "bg-white text-slate-900 shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    All Clients
                                </button>
                                <button
                                    onClick={() => setFilterType("wholesale")}
                                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${filterType === "wholesale" ? "bg-indigo-600 text-white shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    <CreditCard size={12} /> Wholesale / Credit
                                </button>
                                <button
                                    onClick={() => setFilterType("retail")}
                                    className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${filterType === "retail" ? "bg-emerald-600 text-white shadow-md font-extrabold" : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    <Banknote size={12} /> Retail / Cash
                                </button>
                            </div>
                        </div>

                        {/* Customer List Manifest */}
                        <div className="max-h-[360px] overflow-y-auto bg-white divide-y divide-slate-100">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => {
                                    const isWholesale = (c.type || '').toLowerCase().includes('wholesale') || (c.type || '').toLowerCase().includes('credit');
                                    const isSelected = selectedCustomer?.id === c.id;

                                    return (
                                        <button
                                            key={c.id}
                                            onClick={() => handleSelect(c)}
                                            className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all group ${isSelected
                                                ? 'bg-indigo-50/90 border-l-4 border-indigo-600'
                                                : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${isSelected
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : isWholesale
                                                        ? 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white'
                                                        : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                                                    }`}>
                                                    {c.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className={`text-[13px] font-black uppercase leading-none ${isSelected ? 'text-indigo-900 font-extrabold' : 'text-slate-800 group-hover:text-indigo-700'}`}>
                                                            {c.name}
                                                        </p>
                                                        {isSelected && (
                                                            <span className="flex items-center gap-1 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                                                                <CheckCircle2 size={10} /> Selected
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                                                        ID: {c.id} • {c.email || 'No email registered'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${isWholesale
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    }`}>
                                                    {isWholesale ? 'Wholesale / Credit' : 'Retail / Cash'}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="py-12 text-center bg-white">
                                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching accounts found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. ADD CUSTOMER ACTION BUTTON */}
            <button
                onClick={onAddCustomer}
                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-md shrink-0 cursor-pointer"
            >
                <UserPlus size={16} />
                <span>Add Customer</span>
            </button>
        </div>
    );
}