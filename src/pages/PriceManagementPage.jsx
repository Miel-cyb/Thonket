import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
    ArrowLeftCircle, Search, Save, Package,
    ArrowLeft, Percent, BarChart3,
    Activity, ShieldCheck, Globe, Layers
} from 'lucide-react';

import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem.jsx';
import { PriceVariantRow } from '../components/OperationsDashboard/setup/price/PriceVariantRow';
import { StatCard } from '../components/OperationsDashboard/setup/catalog/StatCard.jsx';
import { API_ENDPOINTS } from '../utils/urls';

const PriceManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    // 1. Fetch Categories & Products
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.CATEGORIES}/hierarchy/all`);
            setCategories(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) { console.error("Category Fetch Error", err); }
    }, []);

    const fetchProducts = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRODUCTS}/catalog`, { params });
            setProducts(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts({
                categoryId: selectedCategoryObj?._id || undefined,
                search: searchQuery || undefined
            });
        }, 300);
        return () => clearTimeout(delay);
    }, [selectedCategoryObj, searchQuery, fetchProducts]);

    // 2. Calculated Statistics
    const priceStats = useMemo(() => {
        let totalNetVal = 0;
        let totalDiscountImpact = 0;
        let variantCount = 0;
        let activeTiers = 0;

        products.forEach(p => {
            p.variants?.forEach(v => {
                const base = Number(v.price?.basePrice || 0);
                const discVal = Number(v.discount?.value || 0);
                const isPercent = v.discount?.discountType === "PERCENTAGE";

                const net = isPercent ? base - (base * (discVal / 100)) : base - discVal;

                totalNetVal += net;
                totalDiscountImpact += isPercent ? (base * (discVal / 100)) : discVal;
                variantCount++;
                if (v.tierPrices?.length > 0) activeTiers += v.tierPrices.length;
            });
        });

        return {
            avgNetPrice: variantCount ? (totalNetVal / variantCount).toFixed(2) : "0.00",
            totalSavings: totalDiscountImpact.toLocaleString(),
            bulkTiers: activeTiers,
            currency: products[0]?.variants[0]?.price?.currency || "GHS"
        };
    }, [products]);

    // 3. PERSISTENCE LOGIC
    const handleUpdatePrices = async () => {
        if (!activeProduct) return;
        try {
            setLoading(true);
            await axios.post(`${API_ENDPOINTS.PRICES}/bulk-update`, {
                productId: activeProduct._id,
                variants: activeProduct.variants
            });
            alert("Pricing models synced successfully.");
        } catch (err) {
            alert("Error syncing models: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 4. CORE UPDATE HANDLER (Fixed Tier Bug)
    const handleVariantUpdate = (variantIdx, model, patch) => {
        const newVariants = [...activeProduct.variants];
        const currentVariant = newVariants[variantIdx];

        // Logic Change: If patch is an array (like tierPrices), override directly. 
        // If it's an object (like price/discount), merge it.
        const updatedContent = Array.isArray(patch)
            ? patch
            : { ...currentVariant[model], ...patch };

        newVariants[variantIdx] = {
            ...currentVariant,
            [model]: updatedContent
        };

        setActiveProduct({ ...activeProduct, variants: newVariants });
    };

    return (
        <div className="h-screen bg-[#F8FAFC] flex flex-col text-slate-900 overflow-hidden font-sans">
            <header className="h-20 bg-white border-b px-8 flex items-center justify-between shadow-sm shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <ArrowLeftCircle size={28} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight">Enterprise<span className="text-indigo-600">Pricing</span></h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Model-Based Strategy</p>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search SKU or Model..."
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-80 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white border-r flex flex-col shrink-0">
                    <div className="p-5 flex flex-col h-full">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Market Hierarchy</h4>
                        <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100 flex-1 overflow-y-auto custom-scrollbar">
                            {categories.map(cat => (
                                <CategoryItem
                                    key={cat._id}
                                    item={cat}
                                    onSelect={setSelectedCategoryObj}
                                    selectedId={selectedCategoryObj?._id}
                                />
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto">
                        {/* ANALYTICS PANEL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={Activity} label="Avg Net Yield" value={`${priceStats.currency} ${priceStats.avgNetPrice}`} color="bg-emerald-600 text-white shadow-emerald-100" />
                            <StatCard icon={Percent} label="Discount Impact" value={`${priceStats.currency} ${priceStats.totalSavings}`} color="bg-rose-500 text-white shadow-rose-100" />
                            <StatCard icon={Layers} label="Active Tiers" value={priceStats.bulkTiers} color="bg-indigo-600 text-white shadow-indigo-100" />
                            <StatCard icon={Globe} label="Currency" value={priceStats.currency} color="bg-slate-900 text-white shadow-slate-200" />
                        </div>

                        {!activeProduct ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in">
                                {products.map(p => (
                                    <div
                                        key={p._id}
                                        onClick={() => setActiveProduct(p)}
                                        className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50">
                                                <Package size={18} className="text-slate-400 group-hover:text-indigo-600" />
                                            </div>
                                            <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
                                                {p.variants?.length || 0} SKUs
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-800 mb-1">{p.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.categoryName}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                                    <button onClick={() => setActiveProduct(null)} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-indigo-600 uppercase transition-colors">
                                        <ArrowLeft size={16} /> Exit Editor
                                    </button>
                                    <div className="text-center">
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-tighter">{activeProduct.name}</h2>
                                        <p className="text-[9px] font-bold text-indigo-500 tracking-widest uppercase">Pricing Matrix Active</p>
                                    </div>
                                    <button
                                        onClick={handleUpdatePrices}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase shadow-xl transition-all"
                                    >
                                        <Save size={16} /> {loading ? 'Syncing...' : 'Sync Models'}
                                    </button>
                                </div>

                                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
                                    <div className="bg-slate-900 px-8 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <BarChart3 className="text-indigo-400" size={18} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Variant Control Table</span>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-slate-50">
                                        {activeProduct.variants?.map((v, idx) => (
                                            <PriceVariantRow
                                                key={v._id || idx}
                                                variant={v}
                                                onUpdate={(model, patch) => handleVariantUpdate(idx, model, patch)}
                                                onRemove={() => {
                                                    const filtered = activeProduct.variants.filter((_, i) => i !== idx);
                                                    setActiveProduct({ ...activeProduct, variants: filtered });
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PriceManagementPage;