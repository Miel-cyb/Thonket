'use client';

import { useState, useMemo } from "react";
import { Search, Plus, Layers } from "lucide-react";

export default function ProductCatalog({
    products = [],
    categories = [],
    onSelectProduct
}) {
    // Internal state for filtering logic
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    // Memoized filtering logic for performance
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                activeCategory === "All" ||
                p.category === activeCategory ||
                p.categoryId === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, activeCategory]);

    return (
        <div className="flex gap-6 overflow-hidden h-full p-1">

            {/* 1. DYNAMIC CATEGORY SIDEBAR */}
            <div className="w-64 bg-white border border-slate-200 rounded-[2rem] flex flex-col overflow-hidden shadow-sm shrink-0">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Layers size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departments</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                    <CategoryItem
                        label="All Products"
                        active={activeCategory === "All"}
                        onClick={() => setActiveCategory("All")}
                    />

                    {categories.map(cat => (
                        <div key={cat._id || cat.id} className="space-y-1">
                            <CategoryItem
                                label={cat.name}
                                active={activeCategory === (cat._id || cat.id)}
                                onClick={() => setActiveCategory(cat._id || cat.id)}
                            />
                            {cat.children?.map(sub => (
                                <CategoryItem
                                    key={sub._id || sub.id}
                                    label={sub.name}
                                    isChild
                                    active={activeCategory === (sub._id || sub.id)}
                                    onClick={() => setActiveCategory(sub._id || sub.id)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. PRODUCT DATA HUB */}
            <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">

                {/* SEARCH HEADER */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
                            placeholder="Search by SKU or Product Name..."
                        />
                    </div>
                </div>

                {/* TABLE TERMINAL */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10">
                            <tr className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Product Description</th>
                                <th className="px-6 py-4 text-right">Base Price</th>
                                <th className="px-6 py-4 text-right">Stock</th>
                                <th className="px-6 py-4 w-16"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => {
                                const variants = p.pricing?.base || [];
                                const primaryVariant = variants[0];
                                const displayPrice = primaryVariant?.basePrice || 0;
                                const currency = primaryVariant?.currency || "GHS";

                                return (
                                    <tr
                                        key={p._id || p.id}
                                        onClick={() => onSelectProduct(p)}
                                        className="group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 bg-slate-50 rounded-l-2xl border-y border-l border-slate-100 group-hover:bg-indigo-50/50 transition-all">
                                            <span className="font-mono text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md">
                                                {p.sku || (p._id || p.id).slice(-6).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight line-clamp-1">{p.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{p.brand || 'General Stock'}</p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50 text-right">
                                            <p className="text-sm font-black text-slate-900 tabular-nums">
                                                {currency} {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4 bg-slate-50 border-y border-slate-100 group-hover:bg-indigo-50/50 text-right">
                                            <span className={`text-xs font-black tabular-nums ${p.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                                {p.stock !== undefined ? p.stock.toLocaleString() : "—"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 bg-slate-50 border-y border-r border-slate-100 rounded-r-2xl group-hover:bg-indigo-50/50 text-right">
                                            <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
                                                <Plus size={16} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest">No matching products found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CategoryItem({ label, active, onClick, isChild = false }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${isChild ? "pl-8 opacity-70 scale-95" : ""
                } ${active
                    ? "bg-slate-900 text-white shadow-md ring-4 ring-slate-900/10"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
        >
            <span className="truncate">{label}</span>
            {active && <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />}
        </button>
    );
}