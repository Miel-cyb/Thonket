import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added React Router Navigation Hook
import axios from 'axios';
import {
    ArrowLeftCircle, Search, Package, ChevronDown,
    ShieldCheck, Layers, ClipboardCheck, AlertTriangle, CheckCircle2, Tags
} from 'lucide-react';

import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem.jsx';
import { StatCard } from '../components/OperationsDashboard/setup/catalog/StatCard.jsx';
import { ProductPriceCard } from '../components/OperationsDashboard/setup/catalog/ProductPriceCard.jsx';
import { API_ENDPOINTS } from '../utils/urls';

const PriceManagementPage = () => {
    const navigate = useNavigate(); // 2. Initialized Router Context
    const [categories, setCategories] = useState([]);
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const ITEMS_PER_PAGE = 12;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.CATEGORIES}/hierarchy/all`);
            setCategories(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) {
            console.error("Category Fetch Error", err);
        }
    }, []);

    const fetchPriceCatalog = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRICES}/catalog`);
            setAllProducts(data?.products || []);
        } catch (err) {
            console.error("Catalog Sync Error", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchPriceCatalog();
    }, [fetchCategories, fetchPriceCatalog]);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [selectedCategoryObj, searchQuery]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesCategory = selectedCategoryObj
                ? product.categoryId === selectedCategoryObj._id || product.category?._id === selectedCategoryObj._id
                : true;

            const cleanQuery = searchQuery.trim().toLowerCase();
            const matchesSearch = cleanQuery
                ? product.name?.toLowerCase().includes(cleanQuery) ||
                product.brand?.toLowerCase().includes(cleanQuery) ||
                product.variants?.some(v => v.sku?.toLowerCase().includes(cleanQuery) || v.name?.toLowerCase().includes(cleanQuery))
                : true;

            return matchesCategory && matchesSearch;
        });
    }, [allProducts, selectedCategoryObj, searchQuery]);

    const paginatedProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount);
    }, [filteredProducts, visibleCount]);

    const hasMore = filteredProducts.length > visibleCount;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const priceStats = useMemo(() => {
        let totalSKUs = 0;
        let pricedSKUs = 0;
        let missingPricesCount = 0;
        let totalActiveTiers = 0;
        let totalActiveDiscounts = 0;
        let saleReadyProductsCount = 0;

        filteredProducts.forEach(p => {
            const variants = p.variants || [];
            const topLevelPrices = p.productPrices || [];
            let productHasAllPricesConfigured = p.isActive;

            if (variants.length > 0) {
                variants.forEach(variant => {
                    totalSKUs++;
                    const variantPrices = variant.prices || [];
                    const hasVariantPrice = variantPrices.some(vp => Number(vp.basePrice) > 0);
                    const hasFallbackPrice = topLevelPrices.some(tp => tp.scope === 'PRODUCT' && Number(tp.basePrice) > 0);

                    if (hasVariantPrice || hasFallbackPrice) {
                        pricedSKUs++;
                    } else {
                        missingPricesCount++;
                        productHasAllPricesConfigured = false;
                    }

                    if (variant.pricing?.tiers) totalActiveTiers += variant.pricing.tiers.length;
                    if (variant.pricing?.discounts) totalActiveDiscounts += variant.pricing.discounts.length;
                });
            } else {
                totalSKUs++;
                const hasProductPrice = topLevelPrices.some(tp => Number(tp.basePrice) > 0);
                if (hasProductPrice) {
                    pricedSKUs++;
                } else {
                    missingPricesCount++;
                    productHasAllPricesConfigured = false;
                }
            }

            const topLevelTiers = topLevelPrices.filter(pr => pr.scope === 'TIER' || pr.tiers)?.length || 0;
            const topLevelDiscounts = topLevelPrices.filter(pr => pr.scope === 'DISCOUNT' || pr.discount)?.length || 0;
            totalActiveTiers += topLevelTiers;
            totalActiveDiscounts += topLevelDiscounts;

            if (productHasAllPricesConfigured && totalSKUs > 0) {
                saleReadyProductsCount++;
            }
        });

        const coveragePercentage = totalSKUs > 0 ? Math.round((pricedSKUs / totalSKUs) * 100) : 0;

        return {
            pricedSKUs,
            missingPrices: missingPricesCount,
            priceCoverage: `${coveragePercentage}%`,
            activeTiers: totalActiveTiers,
            activeDiscounts: totalActiveDiscounts,
            saleReadyProducts: saleReadyProductsCount,
            coverageAlert: coveragePercentage < 100 ? "Incomplete" : "Optimal"
        };
    }, [filteredProducts]);

    return (
        <div className="h-screen bg-[#F8FAFC] flex flex-col text-slate-900 overflow-hidden font-sans">
            <header className="h-20 bg-white border-b px-8 flex items-center justify-between shadow-sm shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <ArrowLeftCircle size={28} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight">Products <span className="text-indigo-600">Pricing</span></h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Model-Based Strategy</p>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <Search size={16} className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search SKU, name or brand..."
                        className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-80 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white border-r flex flex-col shrink-0">
                    <div className="p-5 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Market Hierarchy</h4>
                            {selectedCategoryObj && (
                                <button
                                    onClick={() => setSelectedCategoryObj(null)}
                                    className="text-xs font-semibold text-indigo-600 hover:underline"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
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
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        {/* Statistical Overview Layer */}
                        <div className="flex flex-wrap gap-4 items-stretch w-full">
                            <StatCard icon={Package} label="Priced SKUs" value={priceStats.pricedSKUs} color="bg-indigo-600 text-white shadow-indigo-100" />
                            <StatCard icon={AlertTriangle} label="Missing Prices" value={priceStats.missingPrices} color="bg-amber-500 text-white shadow-amber-100" detail={priceStats.missingPrices > 0 ? "Action Req" : null} />
                            <StatCard icon={ClipboardCheck} label="Price Coverage" value={priceStats.priceCoverage} color="bg-emerald-600 text-white shadow-emerald-100" detail={priceStats.coverageAlert} />
                            <StatCard icon={Layers} label="Active Tiers" value={priceStats.activeTiers} color="bg-blue-600 text-white shadow-blue-100" />
                            <StatCard icon={Tags} label="Active Discounts" value={priceStats.activeDiscounts} color="bg-purple-600 text-white shadow-purple-100" />
                            <StatCard icon={CheckCircle2} label="Sale-Ready" value={priceStats.saleReadyProducts} color="bg-slate-900 text-white shadow-slate-200" />
                        </div>

                        <div className="space-y-8">
                            {loading && paginatedProducts.length === 0 ? (
                                <div className="flex items-center justify-center py-24 text-slate-400 text-sm font-medium">
                                    Loading Price Catalogs...
                                </div>
                            ) : paginatedProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                                    <Package size={40} className="text-slate-300 mb-2" />
                                    <p className="text-sm font-medium">No matches found matching your filters.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {paginatedProducts.map(p => (
                                             
                                            <ProductPriceCard
                                                key={p._id}
                                                product={p}
                                               
                                                // 3. Changed from state selection to real route transitions
                                                onSelect={(prod) => navigate(`/price/${prod._id}`)}
                                            />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="flex justify-center pt-4">
                                            <button
                                                onClick={handleLoadMore}
                                                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 shadow-xs text-slate-700 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                Load More Products <ChevronDown size={16} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PriceManagementPage;