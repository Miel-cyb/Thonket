'use client';

import { Search, Plus, AlertTriangle, Layers, Filter } from "lucide-react";

export default function ProductCatalog({
    products,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    onSelectProduct
}) {
    // In FMCG, this list is usually huge.
    const categories = [
        "All", "Beverages", "Snacks & Biscuits", "Grains & Flours", 
        "Oils & Fats", "Hygiene", "Dairy", "Canned Goods", "Confectionery",
        "Home Care", "Pet Food", "Baby Care"
    ];

    return (
        <div className="flex-[3] flex gap-6 overflow-hidden">
            
            {/* 1. DYNAMIC CATEGORY SIDEBAR (Scales for 100s of categories) */}
            <div className="w-64 bg-white border border-slate-200 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Layers size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departments</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
                    {categories.map(c => (
                        <button
                            key={c}
                            onClick={() => setActiveCategory(c)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tight transition-all ${
                                activeCategory === c
                                    ? "bg-slate-900 text-white shadow-lg"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            <span>{c}</span>
                            {activeCategory === c && <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. PRODUCT DATA HUB */}
            <div className="flex-1 flex flex-col gap-4 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                
                {/* Search Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            placeholder="Search by SKU, Barcode, or Brand..."
                        />
                    </div>
                </div>

                {/* FMCG High-Density Table */}
                <div className="flex-1 overflow-y-auto px-4 pb-6">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <th className="px-6 py-3">SKU / UPC</th>
                                <th className="px-6 py-3">Product Description</th>
                                <th className="px-6 py-3 text-right">Wholesale Price</th>
                                <th className="px-6 py-3 text-right">Onhand</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr
                                    key={p.id}
                                    onClick={() => onSelectProduct(p)}
                                    className="group cursor-pointer"
                                >
                                    <td className="px-6 py-4 bg-slate-50 rounded-l-2xl border-y border-l border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all">
                                        <span className="font-mono text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{p.sku}</span>
                                    </td>
                                    
                                    <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{p.name}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{p.category}</p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 text-right">
                                        <p className="text-sm font-black text-slate-900 tabular-nums">
                                            ${p.basePrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <span className={`text-xs font-black tabular-nums ${p.stock < 100 ? 'text-red-500' : 'text-slate-700'}`}>
                                                {p.stock?.toLocaleString()}
                                            </span>
                                            {p.stock < 100 && (
                                                <span className="text-[8px] font-black text-red-400 uppercase">Critical</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 bg-slate-50 border-y border-r border-slate-100 rounded-r-2xl group-hover:bg-indigo-50/50 group-hover:border-indigo-100 text-right">
                                        <button className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
                                            <Plus size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Context */}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <div className="h-px w-24 bg-slate-100" />
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">End of Active Buffer</p>
                        <button className="px-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                            Query Database for More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}