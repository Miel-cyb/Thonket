'use client';
import { useState, useMemo } from 'react';
import CustomerCard from './CustomerCard';
import { Layers, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function CustomerListCard({ customers = [] }) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    // Filter Logic
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'All' || c.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [search, filter, customers]);

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* 1. MASTER CONTROL HEADER */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-slate-900 text-indigo-400 rounded-[1.5rem] shadow-xl shadow-indigo-100">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h2 className="text-[22px] font-black text-slate-900 uppercase tracking-tight leading-none mb-2">
                                Entity Directory
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    {filteredCustomers.length} Verified Nodes
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="SEARCH BY NAME, EMAIL OR ID..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:ring-4 ring-indigo-50 transition-all outline-none"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                            <Download size={20} />
                        </button>
                    </div>
                </div>

                {/* Classification Toggles */}
                <div className="flex items-center gap-2 border-t border-slate-50 pt-6">
                    {['All', 'Wholesale', 'Individual'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. THE GRID CONTAINER - Locked 3x3 Structure */}
            <div className="flex-1 min-h-0 w-full">
                {filteredCustomers.length > 0 ? (
                    /* FIX: Added 'grid-cols-3' explicitly for desktop.
                       Added 'justify-items-start' to ensure cards don't center.
                       Added 'w-full' to each item to maintain column width integrity.
                    */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-start content-start animate-in fade-in duration-700">
                        {filteredCustomers.map((customer) => (
                            <div key={customer.id} className="w-full h-full flex flex-col">
                                <CustomerCard
                                    customer={customer}
                                    onViewOrders={() => { }}
                                    onContact={() => { }}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center">
                        <Search size={48} className="text-slate-200 mb-4" />
                        <span className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em]">Zero results for your query</span>
                    </div>
                )}
            </div>

            {/* 3. PAGINATION PROTOCOL */}
            <div className="flex items-center justify-between px-6 py-8 bg-white border border-slate-100 rounded-[2rem]">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Showing <span className="text-slate-900">1 - {Math.min(filteredCustomers.length, 12)}</span> of {filteredCustomers.length} Records
                </span>
                <div className="flex items-center gap-4">
                    <button className="p-3 border border-slate-200 rounded-xl text-slate-300 disabled:opacity-20 hover:bg-slate-50 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-white text-[10px] font-black">1</span>
                    </div>
                    <button className="p-3 border border-slate-200 rounded-xl text-slate-300 hover:bg-slate-50 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}