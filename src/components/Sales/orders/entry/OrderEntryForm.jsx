'use client';

import axios from 'axios';
import { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowRight, X, Trash2, Loader2, ChevronRight, Layers } from "lucide-react";
import CustomerSelector from "./CustomerSelector";
import ProductCatalog from "./ProductCatalog";
import CartSummary from "./CartSummary";
import VariantModal from "./VariantModal";
import { API_ENDPOINTS } from '../../../../utils/urls';

export default function OrderEntryForm({ onCancel, onCreateOrder, customers, agent }) {
    const [step, setStep] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [activeParent, setActiveParent] = useState("All");
    const [activeSub, setActiveSub] = useState(null);

    const [cart, setCart] = useState([]);
    const [configuringProduct, setConfiguringProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.CATEGORIES}/hierarchy/all`);
            setCategories(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) { console.error("Category Fetch Error", err); }
    }, []);

    const fetchPriceCatalog = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${API_ENDPOINTS.PRICES}/catalog`, { params });
            console.log()
            setProducts(data?.products || data?.data || []);
        } catch (err) { console.error("Catalog Sync Error", err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchPriceCatalog();
    }, [fetchCategories, fetchPriceCatalog]);

    const subCategories = useMemo(() => {
        if (activeParent === "All") return [];
        const parent = categories.find(c => c._id === activeParent);
        return parent?.children || [];
    }, [activeParent, categories]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const search = searchQuery.toLowerCase();
            const matchesSearch = p.name?.toLowerCase().includes(search) || p.sku?.toLowerCase().includes(search);

            if (!matchesSearch) return false;
            if (activeParent === "All") return true;

            const pCatId = p.categoryId || p.category?._id || p.category;

            if (activeSub) return pCatId === activeSub;

            const parent = categories.find(c => c._id === activeParent);
            const childIds = parent?.children?.map(c => c._id) || [];
            return pCatId === activeParent || childIds.includes(pCatId);
        });
    }, [searchQuery, activeParent, activeSub, products, categories]);

    const addToCart = (product, variant, initialQty = 1) => {
        const variantData = product.variants?.find(v => v._id === variant._id);
        const pricing = variantData?.pricing || {};
        const basePrice = pricing.base?.[0]?.basePrice || product.basePrice || 0;
        const cartId = `${product._id}-${variant._id}`;

        setCart(prev => {
            const exists = prev.find(i => i.cartId === cartId);
            if (exists) return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + initialQty } : i);
            return [...prev, {
                cartId, productId: product._id, name: product.name,
                variantName: variant.name, variantId: variant._id,
                price: basePrice, qty: initialQty, sku: variant.sku || product.sku
            }];
        });
        setConfiguringProduct(null);
    };

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    return (
        <div className="h-full flex flex-col bg-[#F1F5F9] overflow-hidden">
            {step === 1 && (
                <header className="px-8 py-4 bg-white border-b border-slate-200 shrink-0">
                    <div className="max-w-[1800px] mx-auto flex items-center gap-6">
                        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
                        <div className="flex-1">
                            <CustomerSelector
                                customers={customers} agent={agent}
                                selectedCustomer={selectedCustomer}
                                setSelectedCustomer={setSelectedCustomer}
                            />
                        </div>
                    </div>
                </header>
            )}

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {step === 1 ? (
                    <>
                        <div className="bg-white border-b border-slate-200 shadow-sm shrink-0">
                            {/* Level 0 Categories */}
                            <div className="px-8 pt-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-50 pb-3">
                                <MainCatBtn
                                    label="All Catalog"
                                    active={activeParent === "All"}
                                    onClick={() => { setActiveParent("All"); setActiveSub(null); }}
                                />
                                {categories.map((cat, idx) => (
                                    <MainCatBtn
                                        key={cat._id || `cat-${idx}`} // FIX: Fallback key
                                        label={cat.name}
                                        active={activeParent === cat._id}
                                        onClick={() => { setActiveParent(cat._id); setActiveSub(null); }}
                                    />
                                ))}
                            </div>

                            {/* Level 1 Categories */}
                            {subCategories.length > 0 && (
                                <div className="px-8 py-3 bg-slate-50/50 flex gap-2 overflow-x-auto no-scrollbar animate-in slide-in-from-top-1 duration-200">
                                    <SubCatBtn
                                        label={`All ${categories.find(c => c._id === activeParent)?.name}`}
                                        active={activeSub === null}
                                        onClick={() => setActiveSub(null)}
                                    />
                                    {subCategories.map((sub, idx) => (
                                        <SubCatBtn
                                            key={sub._id || `sub-${idx}`} // FIX: Fallback key
                                            label={sub.name}
                                            active={activeSub === sub._id}
                                            onClick={() => setActiveSub(sub._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 pb-40">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                                    <Loader2 className="animate-spin mb-4 text-indigo-500" size={40} />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing Price Book...</p>
                                </div>
                            ) : (
                                <div className="max-w-[1600px] mx-auto">
                                    <ProductCatalog
                                        products={filteredProducts}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        onSelectProduct={setConfiguringProduct}
                                        // Pass category state down so ProductCatalog knows what is active
                                        activeCategory={activeSub || activeParent}
                                        setActiveCategory={(id) => setActiveParent(id)}
                                        categories={categories}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full p-8"><CartSummary cart={cart} total={total} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} selectedCustomer={selectedCustomer} onUpdateQty={(id, d) => setCart(p => p.map(i => i.cartId === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))} onRemove={(id) => setCart(p => p.filter(i => i.cartId !== id))} onCreateOrder={() => onCreateOrder({ customer: selectedCustomer, items: cart, total, paymentMethod })} onBack={() => setStep(1)} onCancel={onCancel} /></div>
                )}

                {step === 1 && cart.length > 0 && (
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none px-8">
                        <button onClick={() => setStep(2)} className="pointer-events-auto flex items-center gap-6 bg-slate-900 text-white p-1.5 pl-8 pr-2 rounded-full shadow-2xl hover:bg-indigo-600 transition-all hover:-translate-y-1">
                            <div className="text-left">
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Manifest Total</p>
                                <p className="text-xl font-black">GHS {total.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/10 h-12 px-6 rounded-full flex items-center gap-3">
                                <span className="text-xs font-bold uppercase tracking-widest">Review ({cart.length})</span>
                                <ArrowRight size={18} />
                            </div>
                        </button>
                    </div>
                )}
            </main>

            {configuringProduct && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfiguringProduct(null)} />
                    <div className="relative z-10 w-full max-w-xl"><VariantModal product={configuringProduct} onClose={() => setConfiguringProduct(null)} onSelectVariant={(v, q) => addToCart(configuringProduct, v, q)} /></div>
                </div>
            )}
        </div>
    );
}

function MainCatBtn({ label, active, onClick }) {
    return (
        <button onClick={onClick} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${active ? "bg-slate-900 text-white shadow-md scale-105" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
            {label}
        </button>
    );
}

function SubCatBtn({ label, active, onClick }) {
    return (
        <button onClick={onClick} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-2 ${active ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" : "bg-white border border-slate-200 text-slate-400 hover:text-slate-600"}`}>
            {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
            {label}
        </button>
    );
}