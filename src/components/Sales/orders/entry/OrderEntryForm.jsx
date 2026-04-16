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
            const matchesSearch = p.name?.toLowerCase().includes(search) || p.slug?.toLowerCase().includes(search);

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
        const cartId = `${product._id}-${variant.id}`;
        const currency = product.pricing?.base?.[0]?.currency || "GHS";

        setCart(prev => {
            const exists = prev.find(i => i.cartId === cartId);
            if (exists) {
                return prev.map(i =>
                    i.cartId === cartId
                        ? { ...i, qty: i.qty + initialQty, price: variant.price }
                        : i
                );
            }
            return [...prev, {
                cartId,
                productId: product._id,
                name: product.name,
                variantName: variant.uom,
                variantId: variant.id,
                price: variant.price,
                qty: initialQty,
                sku: product.slug,
                currency
            }];
        });
        setConfiguringProduct(null);
    };

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    return (
        <div className="h-full flex flex-col bg-[#F1F5F9] overflow-hidden">
            {step === 1 && (
                <header className="px-8 py-4 bg-white border-b border-slate-200 shrink-0 z-10">
                    <div className="max-w-[1800px] mx-auto flex items-center gap-6">
                        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                        <div className="flex-1">
                            <CustomerSelector
                                customers={customers}
                                agent={agent}
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
                        <div className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-10">
                            <div className="px-8 pt-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-50 pb-3">
                                <MainCatBtn
                                    label="All Catalog"
                                    active={activeParent === "All"}
                                    onClick={() => { setActiveParent("All"); setActiveSub(null); }}
                                />
                                {categories.map((cat) => (
                                    <MainCatBtn
                                        key={cat._id}
                                        label={cat.name}
                                        active={activeParent === cat._id}
                                        onClick={() => { setActiveParent(cat._id); setActiveSub(null); }}
                                    />
                                ))}
                            </div>

                            {subCategories.length > 0 && (
                                <div className="px-8 py-3 bg-slate-50/50 flex gap-2 overflow-x-auto no-scrollbar animate-in slide-in-from-top-1 duration-200">
                                    <SubCatBtn
                                        label={`All ${categories.find(c => c._id === activeParent)?.name}`}
                                        active={activeSub === null}
                                        onClick={() => setActiveSub(null)}
                                    />
                                    {subCategories.map((sub) => (
                                        <SubCatBtn
                                            key={sub._id}
                                            label={sub.name}
                                            active={activeSub === sub._id}
                                            onClick={() => setActiveSub(sub._id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Note the pb-48 below: this ensures the catalog doesn't get hidden behind the floating button */}
                        <div className="flex-1 overflow-y-auto p-8 pb-48">
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
                                        activeCategory={activeSub || activeParent}
                                        setActiveCategory={(id) => setActiveParent(id)}
                                        categories={categories}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full p-8 overflow-y-auto">
                        <CartSummary
                            cart={cart}
                            total={total}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            selectedCustomer={selectedCustomer}
                            onUpdateQty={(id, d) => setCart(p => p.map(i => i.cartId === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))}
                            onRemove={(id) => setCart(p => p.filter(i => i.cartId !== id))}
                            onCreateOrder={() => onCreateOrder({ customer: selectedCustomer, items: cart, total, paymentMethod })}
                            onBack={() => setStep(1)}
                            onCancel={onCancel}
                        />
                    </div>
                )}

                {/* --- CORRECTED FLOATING BUTTON SECTION --- */}
                {step === 1 && cart.length > 0 && (
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6 pointer-events-none">
                        <button
                            onClick={() => setStep(2)}
                            className="pointer-events-auto flex items-center gap-4 md:gap-8 bg-slate-900 text-white p-2 pl-8 pr-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:bg-indigo-600 transition-all hover:-translate-y-2 active:scale-95 group border border-white/10"
                        >
                            <div className="text-left py-1 shrink-0">
                                <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-0.5">Manifest Total</p>
                                <p className="text-xl md:text-2xl font-black whitespace-nowrap">
                                    <span className="text-xs mr-1.5 opacity-50">GHS</span>
                                    {total.toLocaleString()}
                                </p>
                            </div>

                            <div className="bg-white/10 group-hover:bg-white/20 h-14 px-6 md:px-8 rounded-full flex items-center gap-4 transition-colors">
                                <div className="flex flex-col items-end shrink-0">
                                    <span className="text-xs font-black uppercase tracking-widest">Review ({cart.length})</span>
                                    <span className="text-[9px] font-bold text-white/40 uppercase">Checkout</span>
                                </div>
                                <div className="bg-white text-slate-900 rounded-full p-2 group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={20} strokeWidth={3} />
                                </div>
                            </div>
                        </button>
                    </div>
                )}
                {/* --- END CORRECTED SECTION --- */}
            </main>

            {/* VARIANT CONFIGURATION MODAL */}
            {configuringProduct && (
                <VariantModal
                    product={configuringProduct}
                    onClose={() => setConfiguringProduct(null)}
                    onSelectVariant={(p, v, q) => addToCart(p, v, q)}
                />
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