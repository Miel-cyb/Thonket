import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Plus, ShoppingBag, Package, ChevronRight, Tag, ArrowLeft, Save,
    AlertTriangle, ArrowLeftCircle, Grid, GitMerge, FolderSearch, FileX, Layers, Search, RefreshCw
} from 'lucide-react';

// Subcomponents
import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem.jsx';
import { StatCard } from '../components/OperationsDashboard/setup/catalog/StatCard.jsx';
import { AddProductForm } from '../components/OperationsDashboard/setup/catalog/AddProductForm.jsx';
import { API_ENDPOINTS } from '../utils/urls';

// =====================================================
// UTILS: CATEGORY TREE BUILDERS
// =====================================================
const buildCategoryTree = (arr) => {
    if (!Array.isArray(arr)) return {};
    const tree = {};
    for (let i = 0; i < arr.length; i++) {
        const cat = arr[i];
        if (!cat?.name) continue;
        const children = Array.isArray(cat.children) ? cat.children : [];
        tree[cat.name] = children.length > 0 ? buildCategoryTree(children) : {};
    }
    return tree;
};

// =====================================================
// COMPONENT: MAIN PRODUCTS PAGE
// =====================================================
const ProductsPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [categoryTree, setCategoryTree] = useState({});
    const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);

    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    const API_BASE = API_ENDPOINTS.CATEGORIES;
    const PRODUCT_BASE = API_ENDPOINTS.PRODUCTS;
    const loadingTimer = useRef(null);

    // 1. Fetch Categories
    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/hierarchy/all`);
            const raw = Array.isArray(data) ? data : (data?.data || []);
            setCategories(raw);
            setCategoryTree(buildCategoryTree(raw));
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    }, [API_BASE]);

    // 2. Fetch Products
    const fetchProducts = useCallback(async (params = {}) => {
        try {
            if (loadingTimer.current) clearTimeout(loadingTimer.current);
            setLoading(true);
            const start = Date.now();

            const { data } = await axios.get(`${PRODUCT_BASE}/catalog`, { params });
            const raw = Array.isArray(data) ? data : (data?.data || []);

            console.log(`this is the product list `, data)

            setProducts(raw);

            const elapsed = Date.now() - start;
            loadingTimer.current = setTimeout(() => setLoading(false), Math.max(0, 400 - elapsed));
        } catch (err) {
            setLoading(false);
            console.error("Failed to fetch products:", err);
        }
    }, [PRODUCT_BASE]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 3. Sync Selection to API (With Debounce)
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchProducts({
                categoryId: selectedCategoryObj?._id || undefined,
                search: searchQuery || undefined
            });
        }, 300);
        return () => clearTimeout(delay);
    }, [selectedCategoryObj, searchQuery, fetchProducts]);

    // =====================================================
    // CORE LOGIC: CREATE / UPDATE API
    // =====================================================
    const handleSaveProduct = async (formData) => {
        // console.log('has this request been made ?', formData);
        // Fallback to activeProduct reference if direct payload is omitted
        const productPayload = formData || activeProduct;

        if (!productPayload.name || !productPayload.categoryId) {
            alert("Product name and Category are required.");
            return;
        }

        try {
            setLoading(true);
            const isNew = !productPayload._id;

            const payload = {
                name: productPayload.name,
                categoryId: productPayload.categoryId,
                variants: (productPayload.variants || []).map(v => ({
                    ...v,
                    stock: Number(v.stock || 0),
                    price: Number(v.price || 0)
                }))
            };

            if (isNew) {
                await axios.post(`${PRODUCT_BASE}/product-variant`, payload);
            } else {
                await axios.patch(`${PRODUCT_BASE}/product-variant/${productPayload._id}`, payload);
            }

            setActiveProduct(null);
            fetchProducts({ categoryId: selectedCategoryObj?._id || undefined });
            alert("Product saved successfully!");
        } catch (err) {
            console.error("Save Error:", err);
            alert(err.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setActiveProduct({
            name: '',
            categoryId: selectedCategoryObj?._id || '',
            categoryTree: selectedCategoryObj ? [selectedCategoryObj.name] : [],
            variants: [{
                id: crypto.randomUUID(),
                name: 'Standard',
                sku: '',
                stock: 0,
                price: 0,
                uom: 'pcs'
            }]
        });
    };

    const handlePageBack = () => window.history.back();
    const handleNavigatePrices = () => navigate('/products/pricing');

    // =====================================================
    // METRICS COMPILATION HOOK
    // =====================================================
    const catalogStats = useMemo(() => {
        let totalVariants = 0;
        let unassignedCount = 0;
        let missingVariantsCount = 0;
        const mappedCategories = new Set();

        products.forEach(p => {
            const variantLength = p.variants?.length || 0;
            totalVariants += variantLength;

            if (variantLength === 0) {
                missingVariantsCount++;
            }

            if (p.categoryId) {
                mappedCategories.add(p.categoryId);
            } else {
                unassignedCount++;
            }
        });

        return {
            totalProducts: products.length,
            totalSkus: totalVariants,
            categoriesCovered: mappedCategories.size,
            unassignedProducts: unassignedCount,
            noVariants: missingVariantsCount
        };
    }, [products]);

    return (
        <div className="h-screen bg-slate-50 flex flex-col text-slate-800 font-sans overflow-hidden antialiased">

            {/* HEADER */}
            <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm shrink-0 z-10">
                <div className="flex items-center gap-5">
                    <button
                        onClick={handlePageBack}
                        className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-200"
                        title="Go Back"
                    >
                        <ArrowLeftCircle size={24} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900">
                                <span className="text-indigo-600 font-extrabold">Products</span>
                            </h1>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Wholesale Products Page
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                            <Search size={18} />
                        </span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Quick lookup by item name..."
                            className="pl-11 pr-4 py-2.5 border rounded-xl w-80 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50 border-slate-200 text-slate-900 font-medium placeholder-slate-400 transition-all"
                        />
                    </div>

                    {/* Prices Button */}
                    <button
                        onClick={handleNavigatePrices}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                        <Tag size={17} className="text-slate-500" /> Prices
                    </button>

                    {/* Add Product Button */}
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-100 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {/* SIDEBAR */}
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-6 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Layers size={16} className="text-slate-400" />
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Classification Tree</h4>
                            </div>
                            {selectedCategoryObj && (
                                <button
                                    onClick={() => setSelectedCategoryObj(null)}
                                    className="text-xs text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-y-auto flex-1 p-3 space-y-1">
                            {categories.length > 0 ? (
                                categories.map(cat => (
                                    <CategoryItem
                                        key={cat._id}
                                        item={cat}
                                        onSelect={setSelectedCategoryObj}
                                        selectedId={selectedCategoryObj?._id}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    No categories mapped.
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    {!activeProduct ? (
                        <div className="max-w-7xl mx-auto space-y-8">

                            {/* REFACTORED STATS CARD MATRIX */}
                            <div className="flex flex-wrap items-stretch justify-start gap-6 w-full">
                                <StatCard
                                    icon={Package}
                                    label="Total Catalog Items"
                                    value={catalogStats.totalProducts}
                                    color="from-indigo-500 to-blue-600 text-white"
                                    detail="Active View"
                                    originality />
                                <StatCard
                                    icon={GitMerge}
                                    label="Active Sellable SKUs"
                                    value={catalogStats.totalSkus}
                                    color="from-cyan-500 to-blue-500 text-white"
                                    detail="Live Matrices"
                                />
                                <StatCard
                                    icon={Grid}
                                    label="Live Clusters Mapped"
                                    value={catalogStats.categoriesCovered}
                                    color="from-emerald-400 to-teal-600 text-white"
                                    detail="Classified"
                                />
                                <StatCard
                                    icon={FolderSearch}
                                    label="Orphaned Items"
                                    value={catalogStats.unassignedProducts}
                                    color={catalogStats.unassignedProducts > 0 ? "from-amber-400 to-orange-500 text-white" : "from-slate-100 to-slate-200 text-slate-400"}
                                    detail={catalogStats.unassignedProducts > 0 ? "Fix Tracking" : "Perfect Structure"}
                                />
                                <StatCard
                                    icon={FileX}
                                    label="Incomplete Records"
                                    value={catalogStats.noVariants}
                                    color={catalogStats.noVariants > 0 ? "from-rose-400 to-red-600 text-white" : "from-slate-100 to-slate-200 text-slate-400"}
                                    detail={catalogStats.noVariants > 0 ? "Missing Price" : "Complete"}
                                />
                            </div>

                            {/* BLOCK HEADER CONTEXT */}
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {selectedCategoryObj ? `Catalog / ${selectedCategoryObj.name}` : "Global Inventory Master List"}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium">Click on any master record card below to configure internal package rules, SKUs, and wholesale prices.</p>
                                </div>
                                <div className="text-sm font-medium text-slate-400">
                                    Showing {products.length} Rows
                                </div>
                            </div>

                            {/* PRODUCTS LIST GRID */}
                            {loading ? (
                                <div className="flex flex-col justify-center items-center h-72 gap-3 bg-white border rounded-2xl">
                                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                                    <span className="text-sm text-slate-500 font-medium">Synchronizing inventory matrix...</span>
                                </div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {products.map(p => (
                                        <div
                                            key={p._id}
                                            onClick={() => setActiveProduct(p)}
                                            className="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-lg hover:shadow-slate-100/80 cursor-pointer transition-all group flex flex-col justify-between h-36"
                                        >
                                            <h4 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {p.name}
                                            </h4>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                                    {p.variants?.length || 0} Variants
                                                </span>
                                                <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto mt-6">
                                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                    <h4 className="text-base font-bold text-slate-800 mb-1">No products found</h4>
                                    <p className="text-sm text-slate-500 font-medium px-6">
                                        There are no listings matching your selection. Clear filters or create a new row entry above to start mapping metadata.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-200">

                            {/* ACTIVE PRODUCT CONTROL BOARD */}
                            <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                <button
                                    onClick={() => setActiveProduct(null)}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
                                >
                                    <ArrowLeft size={16} /> Close Form
                                </button>

                                <div className="flex flex-col items-center">
                                    <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Operational Mode</span>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        {activeProduct._id ? 'Modify Existing Entry' : 'New Core Catalog Assignment'}
                                    </h3>
                                </div>
                            </div>

                            {/* CORE REFACTOR: ADDPRODUCTFORM WORKSPACE */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                                <AddProductForm
                                    initialData={activeProduct}
                                    categories={categories}
                                    loading={loading}
                                    onCancel={() => setActiveProduct(null)}
                                    onSave={handleSaveProduct}
                                />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;