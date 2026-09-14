'use client';

import { useState, useMemo } from "react";
import { Search, Plus, Layers, Package, Check } from "lucide-react";

export default function ProductCatalog({
    products = [],
    categories = [],
    onSelectProduct,
    searchQuery: externalSearchQuery,
    setSearchQuery: externalSetSearchQuery,
    activeCategory: externalActiveCategory,
    setActiveCategory: externalSetActiveCategory
}) {
    const [internalSearch, setInternalSearch] = useState("");
    const [internalCategory, setInternalCategory] = useState("All");

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
    const setSearchQuery = externalSetSearchQuery || setInternalSearch;

    const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalCategory;
    const setActiveCategory = externalSetActiveCategory || setInternalCategory;

    // Calculate product counts per category for better visual context
    const categoryCounts = useMemo(() => {
        const counts = { All: products.length };
        products.forEach(p => {
            const pCatId = p.categoryId || p.category?._id || p.category;
            if (pCatId) {
                counts[pCatId] = (counts[pCatId] || 0) + 1;
            }
        });
        return counts;
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const search = searchQuery.toLowerCase();
            const matchesSearch =
                p.name?.toLowerCase().includes(search) ||
                p.sku?.toLowerCase().includes(search) ||
                p.slug?.toLowerCase().includes(search);

            const pCatId = p.categoryId || p.category?._id || p.category;
            const matchesCategory =
                activeCategory === "All" ||
                pCatId === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, activeCategory]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full p-2 overflow-hidden font-sans antialiased text-slate-900 bg-slate-100/50">
            {/* Sidebar / Categories */}
            <aside className="w-full lg:w-72 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl flex flex-col overflow-hidden shadow-xs shrink-0">
                <div className="p-5 border-b border-slate-100/80 flex items-center gap-3 bg-slate-50/60">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-2xs">
                        <Layers size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog</p>
                        <h3 className="text-base font-bold text-slate-800 tracking-tight">Departments</h3>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5 custom-scrollbar">
                    <CategoryItem
                        label="All Products"
                        count={categoryCounts["All"]}
                        active={activeCategory === "All"}
                        onClick={() => setActiveCategory("All")}
                    />

                    {categories.map(cat => {
                        const catId = cat._id || cat.id;
                        const isParentActive = activeCategory === catId;
                        const catCount = categoryCounts[catId] || 0;

                        return (
                            <div key={catId} className="space-y-1">
                                <CategoryItem
                                    label={cat.name}
                                    count={catCount}
                                    active={isParentActive}
                                    onClick={() => setActiveCategory(catId)}
                                />
                                {cat.children?.map(sub => {
                                    const subId = sub._id || sub.id;
                                    const subCount = categoryCounts[subId] || 0;
                                    return (
                                        <CategoryItem
                                            key={subId}
                                            label={sub.name}
                                            count={subCount}
                                            isChild
                                            active={activeCategory === subId}
                                            onClick={() => setActiveCategory(subId)}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
                {/* Search Bar Header */}
                <div className="p-5 border-b border-slate-100/80 bg-slate-50/40 flex items-center justify-between gap-4">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-2xl font-normal text-base focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none shadow-2xs text-slate-800 placeholder:text-slate-400"
                            placeholder="Search by SKU, Product Name, or Slug..."
                        />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-3.5 bg-slate-100/80 border border-slate-200/60 rounded-2xl text-xs font-semibold text-slate-600 shrink-0">
                        <Package size={16} className="text-slate-400" />
                        <span>{filteredProducts.length} items shown</span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-y-auto px-5 pb-6 custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10">
                            <tr className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                                <th className="px-5 py-3">SKU / Ref</th>
                                <th className="px-5 py-3">Product Description</th>
                                <th className="px-5 py-3 text-right">Base Price</th>
                                <th className="px-5 py-3 text-right">Stock</th>
                                <th className="px-5 py-3 w-16 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => {
                                const variants = p.pricing?.base || [];
                                const primaryVariant = variants[0];
                                const displayPrice = primaryVariant?.basePrice ?? primaryVariant?.price ?? 0;
                                const currency = primaryVariant?.currency || "GHS";

                                return (
                                    <tr
                                        key={p._id || p.id}
                                        onClick={() => onSelectProduct(p)}
                                        className="group cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <td className="px-5 py-4 bg-slate-50/70 rounded-l-2xl border-y border-l border-slate-200/60 group-hover:bg-indigo-50/30 group-hover:border-indigo-200/60 transition-colors">
                                            <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1 rounded-md shadow-2xs">
                                                {p.sku || p.slug || (p._id || p.id).slice(-6).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 bg-slate-50/70 border-y border-slate-200/60 group-hover:bg-indigo-50/30 group-hover:border-indigo-200/60 transition-colors">
                                            <div className="space-y-0.5">
                                                <p className="text-base font-semibold text-slate-800 tracking-tight line-clamp-1 group-hover:text-indigo-950 transition-colors">{p.name}</p>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{p.brand || p.categoryName || 'General Stock'}</p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 bg-slate-50/70 border-y border-slate-200/60 group-hover:bg-indigo-50/30 group-hover:border-indigo-200/60 transition-colors text-right">
                                            <p className="text-base font-bold text-slate-900 tabular-nums">
                                                <span className="text-xs font-medium text-slate-400 mr-1">{currency}</span>
                                                {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 bg-slate-50/70 border-y border-slate-200/60 group-hover:bg-indigo-50/30 group-hover:border-indigo-200/60 transition-colors text-right">
                                            <span className={`text-sm font-semibold tabular-nums px-2.5 py-1 rounded-lg ${(p.stock ?? 0) < 10
                                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                                                }`}>
                                                {p.stock !== undefined ? p.stock.toLocaleString() : "—"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 bg-slate-50/70 border-y border-r border-slate-200/60 rounded-r-2xl group-hover:bg-indigo-50/30 group-hover:border-indigo-200/60 transition-colors text-center">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-2xs mx-auto">
                                                <Plus size={18} strokeWidth={2.5} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-3 shadow-2xs">
                                <Package size={36} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No matching products found</p>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search query or department filter.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function CategoryItem({ label, count, active, onClick, isChild = false }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 ${isChild ? "pl-7 text-slate-500 text-xs" : ""
                } ${active
                    ? "bg-slate-900 text-white shadow-xs font-bold scale-[1.01]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
        >
            <span className="truncate">{label}</span>
            <div className="flex items-center gap-2">
                {count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-slate-800 text-slate-300" : "bg-slate-200/60 text-slate-500"
                        }`}>
                        {count}
                    </span>
                )}
                {active && <Check size={14} className="text-indigo-400 shrink-0" />}
            </div>
        </button>
    );
}