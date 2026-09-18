'use client';

import { useState, useMemo } from "react";
import { Search, Layers, Package, Plus, Check, PanelLeftClose, PanelLeftOpen, Percent } from "lucide-react";

export default function ProductCatalog({
    products = [],
    categories = [],
    onSelectProduct,
    selectedProductIds = [], // Array of selected product IDs/variants
    searchQuery: externalSearchQuery,
    setSearchQuery: externalSetSearchQuery,
    activeCategory: externalActiveCategory,
    setActiveCategory: externalSetActiveCategory
}) {
    const [internalSearch, setInternalSearch] = useState("");
    const [internalCategory, setInternalCategory] = useState("All");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
    const setSearchQuery = externalSetSearchQuery || setInternalSearch;

    const activeCategory = externalActiveCategory !== undefined ? externalActiveCategory : internalCategory;
    const setActiveCategory = externalSetActiveCategory || setInternalCategory;

    // Calculate product counts per category based on categoryId or category object
    const categoryCounts = useMemo(() => {
        const counts = { All: products.length };
        products.forEach(p => {
            const pCatId = p.categoryId || p.category?._id;
            if (pCatId) {
                counts[pCatId] = (counts[pCatId] || 0) + 1;
            }
        });
        return counts;
    }, [products]);

    // Filter products strictly at the high-level product level
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const search = searchQuery.toLowerCase();
            const matchesSearch =
                p.name?.toLowerCase().includes(search) ||
                p.sku?.toLowerCase().includes(search) ||
                p.slug?.toLowerCase().includes(search) ||
                p.brand?.toLowerCase().includes(search) ||
                p.categoryName?.toLowerCase().includes(search);

            const pCatId = p.categoryId || p.category?._id;
            const matchesCategory =
                activeCategory === "All" ||
                pCatId === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, activeCategory]);

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-2rem)] max-h-[920px] p-3 overflow-hidden font-sans antialiased text-slate-900 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40">
            {/* Custom Modern Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(203, 213, 225, 0.8);
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 1);
                }
            `}</style>

            {/* Sidebar / Categories */}
            <aside
                className={`bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl flex flex-col overflow-hidden shadow-md shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full lg:w-72 opacity-100' : 'w-0 lg:w-0 opacity-0 border-none p-0 overflow-hidden'
                    }`}
            >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/80 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100/70 text-indigo-700 rounded-2xl shadow-sm">
                            <Layers size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catalog</p>
                            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Departments</h3>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                        title="Collapse Sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
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
            <main className="flex-1 flex flex-col bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-md overflow-hidden">
                {/* Search Bar Header */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3 flex-1">
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-all shadow-sm shrink-0 flex items-center gap-2 text-xs font-semibold"
                                title="Expand Sidebar"
                            >
                                <PanelLeftOpen size={18} />
                                <span className="hidden sm:inline">Departments</span>
                            </button>
                        )}
                        <div className="relative group flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl font-medium text-sm focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600 transition-all outline-none shadow-sm text-slate-900 placeholder:text-slate-400"
                                placeholder="Search products by Name, SKU, Category, Brand..."
                            />
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 bg-slate-100/90 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 shrink-0 shadow-sm">
                        <Package size={16} className="text-indigo-600" />
                        <span>{filteredProducts.length} items shown</span>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-y-2 table-fixed">
                        <colgroup>
                            <col className="w-[30%]" />
                            <col className="w-[26%]" />
                            <col className="w-[22%]" />
                            <col className="w-[12%]" />
                            <col className="w-[10%]" />
                        </colgroup>
                        <thead className="sticky top-0 bg-white/95 backdrop-blur-md z-10 shadow-sm">
                            <tr className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                <th className="px-4 py-3">Product / SKU</th>
                                <th className="px-4 py-3">Category & Attributes</th>
                                <th className="px-4 py-3 text-right">Pricing & Offers</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => {
                                const productId = p._id || p.id;
                                const isSelected = selectedProductIds.includes(productId);

                                const basePrice = p.price?.basePrice ?? p.basePrice;
                                const currency = p.price?.currency ?? p.currency ?? 'GHS';
                                const discount = p.price?.discount ?? p.discount;
                                const attributes = p.attributes || {};

                                return (
                                    <tr
                                        key={productId}
                                        onClick={() => onSelectProduct?.(p)}
                                        className={`group cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${isSelected ? 'ring-2 ring-indigo-500/50 shadow-sm' : ''
                                            }`}
                                    >
                                        {/* Product Name & SKU */}
                                        <td className={`px-4 py-3.5 rounded-l-2xl border-y border-l transition-colors align-middle truncate ${isSelected
                                            ? 'bg-indigo-50/70 border-indigo-300 group-hover:bg-indigo-100/60'
                                            : 'bg-slate-50/80 border-slate-200 group-hover:bg-indigo-50/30 group-hover:border-indigo-300'
                                            }`}>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight truncate group-hover:text-indigo-950 transition-colors">
                                                        {p.name}
                                                    </p>
                                                    {isSelected && (
                                                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-sm">
                                                            <Check size={10} strokeWidth={3} />
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-1.5 py-0.5 rounded">
                                                        {p.sku || 'No SKU'}
                                                    </span>
                                                    {p.unitOfMeasure && (
                                                        <span className="text-[11px] text-slate-500 uppercase font-medium">({p.unitOfMeasure})</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category & Attributes */}
                                        <td className={`px-4 py-3.5 border-y transition-colors align-middle truncate ${isSelected
                                            ? 'bg-indigo-50/70 border-indigo-300 group-hover:bg-indigo-100/60'
                                            : 'bg-slate-50/80 border-slate-200 group-hover:bg-indigo-50/30 group-hover:border-indigo-300'
                                            }`}>
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{p.categoryName || 'Unassigned'}</p>
                                                {Object.keys(attributes).length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {Object.entries(attributes).map(([key, val]) => (
                                                            <span key={key} className="text-[10px] font-medium bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded-md">
                                                                {key}: {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Pricing & Offers */}
                                        <td className={`px-4 py-3.5 border-y transition-colors text-right align-middle ${isSelected
                                            ? 'bg-indigo-50/70 border-indigo-300 group-hover:bg-indigo-100/60'
                                            : 'bg-slate-50/80 border-slate-200 group-hover:bg-indigo-50/30 group-hover:border-indigo-300'
                                            }`}>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-slate-900 tracking-tight">
                                                    {currency} {basePrice !== undefined ? basePrice.toLocaleString() : '—'}
                                                </p>
                                                {discount && discount.discountValue > 0 && (
                                                    <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-emerald-700">
                                                        <Percent size={11} strokeWidth={2.5} />
                                                        <span>{discount.discountValue}% OFF</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className={`px-4 py-3.5 border-y transition-colors text-center align-middle ${isSelected
                                            ? 'bg-indigo-50/70 border-indigo-300 group-hover:bg-indigo-100/60'
                                            : 'bg-slate-50/80 border-slate-200 group-hover:bg-indigo-50/30 group-hover:border-indigo-300'
                                            }`}>
                                            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg ${p.isActive
                                                ? 'bg-emerald-100/70 text-emerald-800 border border-emerald-200'
                                                : 'bg-slate-200 text-slate-600'
                                                }`}>
                                                {p.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className={`px-4 py-3.5 border-y border-r rounded-r-2xl transition-colors text-center align-middle ${isSelected
                                            ? 'bg-indigo-50/70 border-indigo-300 group-hover:bg-indigo-100/60'
                                            : 'bg-slate-50/80 border-slate-200 group-hover:bg-indigo-50/30 group-hover:border-indigo-300'
                                            }`}>
                                            {isSelected ? (
                                                <div className="h-8 w-8 rounded-xl bg-indigo-600 border border-indigo-600 flex items-center justify-center text-white transition-all shadow-sm mx-auto">
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm mx-auto">
                                                    <Plus size={14} strokeWidth={2.5} />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-3 shadow-sm">
                                <Package size={32} className="text-slate-400" />
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">No matching products found</p>
                            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or department filter.</p>
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
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all duration-200 ${isChild ? "pl-7 text-slate-600 text-xs font-medium" : ""
                } ${active
                    ? "bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md font-bold scale-[1.01]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
        >
            <span className="truncate">{label}</span>
            <div className="flex items-center gap-2">
                {count !== undefined && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                        {count}
                    </span>
                )}
                {active && <Check size={14} className="text-indigo-300 shrink-0" />}
            </div>
        </button>
    );
}