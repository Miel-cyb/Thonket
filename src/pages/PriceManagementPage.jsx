import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const ITEMS_PER_PAGE = 12;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const organizationId = "ORG-DEFAULT";

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.CATEGORIES}/${organizationId}/hierarchy/all`);
            const resData = response.data;
            console.log(resData)
            setCategories(Array.isArray(resData) ? resData : (resData?.data || []));
        } catch (err) {
            console.error("Category Fetch Error", err);
        }
    }, [organizationId]);

    const fetchPriceCatalog = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_ENDPOINTS.PRICES}/organization/${organizationId}/catalog`);
            const resData = response.data;

            let rawItems = [];
            const payload = resData?.data || resData;
            console.log(payload);

            if (Array.isArray(payload)) {
                const isVariantStructure = payload.some(item => item.productId && typeof item.productId === 'object');

                if (isVariantStructure) {
                    const productMap = {};
                    payload.forEach(variant => {
                        const prodInfo = variant.productId;
                        const prodId = prodInfo?._id || 'unknown';

                        if (!productMap[prodId]) {
                            const rawCat = prodInfo?.categoryId;
                            const catId = typeof rawCat === 'object' ? rawCat?._id : (rawCat || '');
                            const catName = typeof rawCat === 'object' ? rawCat?.name : '';

                            productMap[prodId] = {
                                _id: prodId,
                                name: prodInfo?.name || 'Unnamed Product',
                                slug: prodInfo?.slug || '',
                                description: prodInfo?.description || '',
                                categoryId: catId,
                                categoryName: catName,
                                category: rawCat || null,
                                brand: prodInfo?.brand || '',
                                isActive: prodInfo?.isActive ?? true,
                                organizationId: prodInfo?.organizationId || organizationId,
                                createdAt: prodInfo?.createdAt || '',
                                updatedAt: prodInfo?.updatedAt || '',
                                __v: prodInfo?.__v ?? 0,
                                variants: []
                            };
                        }
                        productMap[prodId].variants.push(variant);
                    });
                    rawItems = Object.values(productMap);
                } else {
                    rawItems = payload;
                }
            } else if (Array.isArray(payload?.products)) {
                rawItems = payload.products;
            } else if (Array.isArray(payload?.variants)) {
                const productMap = {};
                payload.variants.forEach(variant => {
                    const prodInfo = variant.productId;
                    const prodId = prodInfo?._id || 'unknown';

                    if (!productMap[prodId]) {
                        const rawCat = prodInfo?.categoryId;
                        const catId = typeof rawCat === 'object' ? rawCat?._id : (rawCat || '');
                        const catName = typeof rawCat === 'object' ? rawCat?.name : '';

                        productMap[prodId] = {
                            _id: prodId,
                            name: prodInfo?.name || 'Unnamed Product',
                            slug: prodInfo?.slug || '',
                            description: prodInfo?.description || '',
                            categoryId: catId,
                            categoryName: catName,
                            category: rawCat || null,
                            brand: prodInfo?.brand || '',
                            isActive: prodInfo?.isActive ?? true,
                            organizationId: prodInfo?.organizationId || organizationId,
                            createdAt: prodInfo?.createdAt || '',
                            updatedAt: prodInfo?.updatedAt || '',
                            __v: prodInfo?.__v ?? 0,
                            variants: []
                        };
                    }
                    productMap[prodId].variants.push(variant);
                });
                rawItems = Object.values(productMap);
            }

            setAllProducts(rawItems);
        } catch (err) {
            console.error("Catalog Sync Error", err);
        } finally {
            setLoading(false);
        }
    }, [organizationId]);

    useEffect(() => {
        fetchCategories();
        fetchPriceCatalog();
    }, [fetchCategories, fetchPriceCatalog]);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [selectedCategoryObj, searchQuery]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const productCatId = typeof product.categoryId === 'object' ? product.categoryId?._id : product.categoryId;
            const productCategoryObjId = typeof product.category === 'object' ? product.category?._id : product.category;
            const selectedCatId = selectedCategoryObj?._id;

            const matchesCategory = selectedCatId
                ? productCatId === selectedCatId || productCategoryObjId === selectedCatId
                : true;

            const cleanQuery = searchQuery.trim().toLowerCase();
            const matchesSearch = cleanQuery
                ? product.name?.toLowerCase().includes(cleanQuery) ||
                product.brand?.toLowerCase().includes(cleanQuery) ||
                product.categoryName?.toLowerCase().includes(cleanQuery) ||
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
            let productHasAllPricesConfigured = p.isActive;

            if (variants.length > 0) {
                variants.forEach(variant => {
                    totalSKUs++;
                    const variantPrices = variant.prices || [];
                    const hasVariantPrice = variantPrices.some(vp => Number(vp.basePrice) > 0);

                    if (hasVariantPrice) {
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
                missingPricesCount++;
                productHasAllPricesConfigured = false;
            }

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
                        placeholder="Search SKU, name, category or brand..."
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
                                                onSelect={(prod) => navigate(`/price/${prod._id}`, { state: { product: prod } })}
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