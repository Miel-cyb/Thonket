'use client';

import axios from 'axios';
import { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowRight, X, Loader2, Layers, ShoppingCart } from "lucide-react";
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
        const cartId = `${product._id}-${variant._id || variant.id}`;

        // Safely extract price and currency handling your productPrices / variant structures
        const productPriceObj = product.productPrices?.[0] || product.prices?.[0];
        const variantPriceObj = variant.prices?.[0];

        const price = variantPriceObj?.basePrice ?? variantPriceObj?.price ?? productPriceObj?.basePrice ?? variant.price ?? 0;
        const currency = variantPriceObj?.currency ?? productPriceObj?.currency ?? "GHS";

        setCart(prev => {
            const exists = prev.find(i => i.cartId === cartId);
            if (exists) {
                return prev.map(i =>
                    i.cartId === cartId
                        ? { ...i, qty: i.qty + initialQty, price }
                        : i
                );
            }
            return [...prev, {
                cartId,
                productId: product._id,
                name: product.name,
                variantName: variant.name || variant.uom,
                variantId: variant._id || variant.id,
                price,
                qty: initialQty,
                sku: variant.sku || product.slug,
                currency
            }];
        });
        setConfiguringProduct(null);
    };

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    return (
        <div className="h-full flex flex-col bg-slate-100/80 font-sans text-slate-900 overflow-hidden relative">
            {step === 1 && (
                <header className="px-6 lg:px-10 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] shrink-0 z-20 flex items-center gap-4">
                    <button
                        onClick={onCancel}
                        className="group p-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border border-slate-200/80 text-slate-400 shadow-2xs flex items-center justify-center shrink-0"
                        title="Exit Order Entry"
                    >
                        <X size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <CustomerSelector
                            customers={customers}
                            agent={agent}
                            selectedCustomer={selectedCustomer}
                            setSelectedCustomer={setSelectedCustomer}
                        />
                    </div>
                </header>
            )}

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {step === 1 ? (
                    <>
                        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-2xs shrink-0 z-10 transition-all">
                            <div className="px-6 lg:px-10 pt-4 pb-3 flex gap-2.5 overflow-x-auto no-scrollbar border-b border-slate-100 items-center">
                                <div className="flex items-center gap-1.5 mr-2 text-slate-400 font-bold text-xs uppercase tracking-wider shrink-0">
                                    <Layers size={15} className="text-indigo-600" />
                                    <span>Categories</span>
                                </div>
                                <MainCatBtn
                                    label="All Catalog"
                                    active={activeParent === "All"}
                                    onClick={() => { setActiveParent("All"); setActiveSub(null); }}
                                    count={products.length}
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
                                <div className="px-6 lg:px-10 py-3 bg-slate-50/70 flex gap-2 overflow-x-auto no-scrollbar animate-in slide-in-from-top-2 duration-300 items-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-2 shrink-0">
                                        Subcategories:
                                    </div>
                                    <SubCatBtn
                                        label={`All ${categories.find(c => c._id === activeParent)?.name || ''}`}
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

                        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-48 scroll-smooth">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                                    <div className="relative p-6 bg-white rounded-3xl shadow-xl border border-slate-200/80 flex flex-col items-center">
                                        <Loader2 className="animate-spin mb-3 text-indigo-600" size={42} />
                                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-700">Syncing Price Book</p>
                                        <p className="text-[10px] text-slate-400 mt-1">Retrieving latest inventory matrices...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-[1700px] mx-auto">
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
                    <div className="h-full p-6 lg:p-10 overflow-y-auto bg-slate-50/50">
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

                {step === 1 && cart.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-fit px-6 pointer-events-none animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <button
                            onClick={() => setStep(2)}
                            className="pointer-events-auto flex items-center gap-5 md:gap-8 bg-slate-900 text-white p-2.5 pl-8 pr-2.5 rounded-full shadow-[0_20px_50px_rgba(15,23,42,0.35)] hover:bg-indigo-600 transition-all hover:-translate-y-1.5 active:scale-95 group border border-white/15 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-3 pr-2 border-r border-white/15">
                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-inner">
                                    <ShoppingCart size={18} />
                                </div>
                                <div className="text-left py-0.5 shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] group-hover:text-white transition-colors">Manifest Total</p>
                                        <span className="px-1.5 py-0.2 bg-indigo-500 text-white text-[9px] font-black rounded-full">
                                            {cart.reduce((acc, item) => acc + item.qty, 0)} items
                                        </span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-black whitespace-nowrap tracking-tight">
                                        <span className="text-xs mr-1.5 opacity-60 font-semibold">GHS</span>
                                        {total.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 group-hover:bg-white/20 h-12 px-6 md:px-7 rounded-full flex items-center gap-4 transition-all">
                                <div className="flex flex-col items-end shrink-0">
                                    <span className="text-xs font-black uppercase tracking-wider">Review Order</span>
                                    <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Proceed to Checkout</span>
                                </div>
                                <div className="bg-white text-slate-900 rounded-full p-2.5 group-hover:translate-x-1 transition-transform shadow-md">
                                    <ArrowRight size={16} strokeWidth={3} />
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </main>

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

function MainCatBtn({ label, active, onClick, count }) {
    return (
        <button
            onClick={onClick}
            className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 shadow-2xs ${active
                ? "bg-slate-900 text-white shadow-lg scale-[1.03] ring-2 ring-slate-900/20"
                : "bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
        >
            <span>{label}</span>
            {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function SubCatBtn({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow-2xs ${active
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500"
                : "bg-white border border-slate-200/80 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
        >
            {active && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            {label}
        </button>
    );
}