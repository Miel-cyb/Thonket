'use client';

import { Users, ShieldCheck, UserCircle2, ChevronDown, Search, CreditCard, AlertCircle, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CustomerSelector({
    customers = [],
    agent,
    selectedCustomer,
    setSelectedCustomer,
    placingFor,
    setPlacingFor
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm) ||
        c.tier?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6);

    const handleSelect = (customer) => {
        setSelectedCustomer(customer);
        setIsOpen(false);
        setSearchTerm("");
    };

    const creditUsage = selectedCustomer ? (selectedCustomer.balance / (selectedCustomer.creditLimit || 1)) * 100 : 0;
    const isOverLimit = creditUsage >= 100;

    return (
        <div className="bg-white p-2.5 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row gap-3 items-stretch lg:items-center z-[120] w-full max-w-[1400px] mx-auto">

            {/* 1. AGENT IDENTITY */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900 text-white rounded-[1.5rem] min-w-[200px] shrink-0">
                <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-[11px] font-black border border-white/10 shadow-sm">
                    {agent?.name?.substring(0, 2).toUpperCase() || "AG"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest mb-0">Agent</p>
                    <p className="text-[13px] font-black uppercase truncate leading-tight">{agent?.name || "System"}</p>
                </div>
            </div>

            {/* 2. CUSTOMER SEARCH & DROPDOWN */}
            <div className="flex-1 relative" ref={dropdownRef}>
                <div className="relative z-[130]">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        {selectedCustomer ? (
                            <ShieldCheck size={20} className={isOverLimit ? 'text-red-500' : 'text-emerald-500'} />
                        ) : (
                            <Search size={18} className="text-slate-400" />
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder={selectedCustomer ? selectedCustomer.name : "Search Account Name or ID..."}
                        value={searchTerm}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-[1.5rem] text-[12px] font-bold uppercase tracking-wider transition-all outline-none ${selectedCustomer
                                ? isOverLimit ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-100 bg-emerald-50 text-slate-900"
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

                {/* THE DROPDOWN - FIXED TRANSPARENCY & CONTRAST */}
                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[450px] bg-white border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] rounded-[1.5rem] overflow-hidden z-[200] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Dropdown Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center px-6">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Wholesale Account</h4>
                            <span className="text-[9px] font-black text-white bg-indigo-600 px-2.5 py-1 rounded-full shadow-sm">{filteredCustomers.length} Hits</span>
                        </div>

                        {/* Results List */}
                        <div className="max-h-[380px] overflow-y-auto bg-white">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => handleSelect(c)}
                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-indigo-50/40 text-left transition-all border-b border-slate-50 group last:border-0"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {c.name.substring(0, 1)}
                                            </div>
                                            <div>
                                                <p className="text-[14px] font-black text-slate-800 uppercase leading-none mb-1 group-hover:text-indigo-700">{c.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">UID: {c.id} • {c.tier || 'Standard'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900 tabular-nums">${c.creditLimit?.toLocaleString()}</p>
                                            <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Credit Line</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="py-12 text-center bg-white">
                                    <Users size={32} className="mx-auto text-slate-200 mb-2" />
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No wholesale accounts found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. CREDIT UTILIZATION */}
            {selectedCustomer && (
                <div className={`px-5 py-2.5 rounded-[1.5rem] border flex items-center gap-4 min-w-[220px] shadow-sm ${isOverLimit ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                    }`}>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5 px-1">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Utilization</span>
                            <span className={`text-[12px] font-black ${isOverLimit ? 'text-red-600' : 'text-indigo-600'}`}>{Math.round(creditUsage)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-white shadow-inner">
                            <div
                                className={`h-full transition-all duration-700 ${isOverLimit ? 'bg-red-500' : 'bg-indigo-500'}`}
                                style={{ width: `${Math.min(creditUsage, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 4. SHIP-TO PROTOCOL */}
            <div className="relative shrink-0">
                <select
                    value={placingFor}
                    onChange={(e) => setPlacingFor(e.target.value)}
                    className="pl-6 pr-10 py-3.5 appearance-none bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-indigo-600 transition-all outline-none shadow-md"
                >
                    <option value="self">Standard Fulfillment</option>
                    <option value="other">Priority Dropship</option>
                    <option value="express">Emergency Logistics</option>
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
        </div>
    );
}