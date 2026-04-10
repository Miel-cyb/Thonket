import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    Plus, ShoppingBag, Package, ChevronRight, Tag, ArrowLeft, Save,
    BarChart3, AlertTriangle, ArrowLeftCircle, Folder, FolderOpen
} from 'lucide-react';

import { BulkProductRow } from '../components/OperationsDashboard/setup/catalog/BulkProductRow.jsx';
import { StatCard } from '../components/OperationsDashboard/setup/catalog/StatCard.jsx';
import { CategoryItem } from '../components/OperationsDashboard/setup/catalog/CategoryItem.jsx';
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
            setProducts(raw);

            const elapsed = Date.now() - start;
            loadingTimer.current = setTimeout(() => setLoading(false), Math.max(0, 400 - elapsed));
        } catch (err) {
            setLoading(false);
        }
    }, [PRODUCT_BASE]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // 3. Sync Selection to API
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
    const handleSaveProduct = async () => {
        // Validation check for the payload
        if (!activeProduct.name || !activeProduct.categoryId) {
            alert("Product name and Category are required.");
            return;
        }

        try {
            setLoading(true);
            const isNew = !activeProduct._id;

            const payload = {
                name: activeProduct.name,
                categoryId: activeProduct.categoryId, // Attached from the dropdown selection
                variants: activeProduct.variants.map(v => ({
                    ...v,
                    stock: Number(v.stock),
                    price: Number(v.price || 0)
                }))
            };

            if (isNew) {
                await axios.post(`${PRODUCT_BASE}/product-variant`, payload);
            } else {
                await axios.patch(`${PRODUCT_BASE}/product-variant/${activeProduct._id}`, payload);
            }

            setActiveProduct(null);
            fetchProducts();
            alert("Product saved successfully!");
        } catch (err) {
            console.error("Save Error:", err);
            alert(err.response?.data?.message || "Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        // Pre-fill category if a user has one selected in the sidebar
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

    const stats = useMemo(() => {
        let stock = 0, low = 0, skus = 0;
        products.forEach(p => {
            skus += (p.variants?.length || 0);
            p.variants?.forEach(v => {
                stock += (v.stock || 0);
                if ((v.stock || 0) < 10) low++;
            });
        });
        return { total: products.length, skus, stock, low };
    }, [products]);

    return (
        <div className="h-screen bg-[#F8FAFC] flex flex-col text-slate-900 font-sans overflow-hidden">

            {/* HEADER */}
            <header className="h-20 bg-white border-b px-8 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handlePageBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-all"
                    >
                        <ArrowLeftCircle size={28} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight">Inventory<span className="text-indigo-600">OS</span></h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">FMCG Wholesale</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="px-4 py-2.5 border rounded-xl w-72 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-lg shadow-indigo-100 transition-transform active:scale-95"
                    >
                        <Plus size={16} /> New Product
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-80 bg-white border-r flex flex-col shrink-0">
                    <div className="p-5 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</h4>
                            {selectedCategoryObj && (
                                <button
                                    onClick={() => setSelectedCategoryObj(null)}
                                    className="text-[10px] text-indigo-600 font-bold hover:underline"
                                >
                                    RESET
                                </button>
                            )}
                        </div>
                        <div className="bg-slate-50/50 p-2 rounded-xl border border-slate-200 overflow-y-auto flex-1">
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

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    {!activeProduct ? (
                        <div className="max-w-7xl mx-auto">
                            <div className="flex gap-6 mb-10 overflow-x-auto pb-2">
                                <StatCard icon={Package} label="Products" value={stats.total} color="bg-indigo-600 text-white" />
                                <StatCard icon={Tag} label="SKUs" value={stats.skus} color="bg-blue-500 text-white" />
                                <StatCard icon={BarChart3} label="Total Stock" value={stats.stock} color="bg-emerald-500 text-white" />
                                <StatCard icon={AlertTriangle} label="Low Stock" value={stats.low} color="bg-rose-500 text-white" />
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {products.map(p => (
                                        <div key={p._id} onClick={() => setActiveProduct(p)} className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50 cursor-pointer transition-all group">
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">{p.name}</h4>
                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{p.variants?.length || 0} Variants</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                                    <Package className="mx-auto text-slate-300 mb-4" size={48} />
                                    <p className="text-slate-500 font-medium">No products found in this category.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <button
                                    onClick={() => setActiveProduct(null)}
                                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
                                >
                                    <ArrowLeft size={18} /> Back to Catalog
                                </button>
                                <button
                                    onClick={handleSaveProduct}
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-50 disabled:opacity-50"
                                >
                                    <Save size={16} /> {activeProduct._id ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>

                            {/* Passing rawCategories here enables the dropdown inside BulkProductRow */}
                            <BulkProductRow
                                product={activeProduct}
                                rawCategories={categories}
                                onUpdate={setActiveProduct}
                                onRemove={() => setActiveProduct(null)}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;