'use client';

import { useState, useMemo, useEffect } from "react";
import { ArrowRight, ChevronLeft, AlertCircle, X, CheckCircle2, Trash2 } from "lucide-react";
import CustomerSelector from "./CustomerSelector";
import ProductCatalog from "./ProductCatalog";
import CartSummary from "./CartSummary";
import VariantModal from "./VariantModal";

export default function OrderEntryForm({ onCancel, onCreateOrder, customers, agent }) {
    const [step, setStep] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState([]);
    const [configuringProduct, setConfiguringProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const products = [
        { id: 1, name: "Premium Sunflower Oil", category: "Cooking Oil", basePrice: 45.00, sku: "OIL-772", variants: ["Case (12 x 1L)", "Bulk Jerrycan (20L)"], stock: 120 },
        { id: 2, name: "Long Grain White Rice", category: "Grains", basePrice: 22.50, sku: "RCE-102", variants: ["Bale (10 x 2kg)", "50kg Industrial Bag"], stock: 500 },
        { id: 3, name: "Carbonated Soft Drink", category: "Beverages", basePrice: 14.80, sku: "BEV-443", variants: ["Shrink Wrap (24 x 330ml)", "Crate (12 x 1.5L)"], stock: 850 },
        { id: 4, name: "Condensed Milk", category: "Dairy", basePrice: 62.00, sku: "DRY-901", variants: ["Carton (48 Tins)", "Half Carton (24 Tins)"], stock: 210 },
    ];

    // Commercial Guard: Prevent accidental data loss
    useEffect(() => {
        if (cart.length > 0) {
            const handleBeforeUnload = (e) => {
                e.preventDefault();
                e.returnValue = '';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [cart.length]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const search = searchQuery.toLowerCase();
            return (p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search)) &&
                (activeCategory === "All" || p.category === activeCategory);
        });
    }, [searchQuery, activeCategory]);

    const resetOrder = () => {
        if (window.confirm("CRITICAL: This will purge all line items from the current manifest. Proceed?")) {
            setCart([]);
            setStep(1);
        }
    };

    const addToCart = (product, variant, initialQty = 1) => {
        const cartId = `${product.id}-${variant}`;
        setCart(prev => {
            const exists = prev.find(i => i.cartId === cartId);
            if (exists) {
                return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + initialQty } : i);
            }
            return [...prev, {
                cartId, productId: product.id, name: product.name, variant, price: product.basePrice, qty: initialQty, sku: product.sku
            }];
        });
        setConfiguringProduct(null);
    };

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    return (
        <div className="h-screen flex flex-col bg-[#F1F5F9] overflow-hidden">

            {/* CONDITIONAL HEADER: Only show on Step 1. Step 2 has its own high-vis header. */}
            {step === 1 && (
                <header className={`px-10 py-5 bg-white border-b border-slate-200 shrink-0 z-[100] transition-opacity ${configuringProduct ? 'opacity-20 pointer-events-none' : ''}`}>
                    <div className="max-w-[1800px] mx-auto flex items-center gap-10">
                        <button onClick={onCancel} className="group p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                            <X size={24} />
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

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-hidden relative">
                {step === 1 ? (
                    <div className="h-full overflow-y-auto custom-scrollbar p-10 pb-44">
                        <div className="max-w-[1800px] mx-auto">
                            <ProductCatalog
                                products={filteredProducts}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                                onSelectProduct={setConfiguringProduct}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-full p-6 lg:p-10 animate-in fade-in zoom-in-95 duration-300">
                        <CartSummary
                            cart={cart}
                            total={total}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            selectedCustomer={selectedCustomer}
                            onUpdateQty={(id, d) => setCart(prev => prev.map(i => i.cartId === id ? { ...i, qty: Math.max(1, i.qty + d) } : i))}
                            onRemove={(id) => setCart(prev => prev.filter(i => i.cartId !== id))}
                            onCreateOrder={() => onCreateOrder({
                                customer: selectedCustomer,
                                items: cart,
                                total,
                                paymentMethod,
                                timestamp: new Date().toISOString()
                            })}
                            onBack={() => setStep(1)}
                            onCancel={onCancel}
                        />
                    </div>
                )}
            </main>

            {/* FLOATING ACTION PILL (Commercial Footer) */}
            {step === 1 && cart.length > 0 && (
                <div className="fixed bottom-12 left-0 right-0 z-[110] flex justify-center pointer-events-none">
                    <div className="max-w-[1800px] w-full px-12 flex justify-end items-center pointer-events-auto">
                        <div className="flex items-center gap-5 animate-in slide-in-from-bottom-12 duration-500 ease-out">

                            <button
                                onClick={resetOrder}
                                className="h-16 w-16 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-[2rem] flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
                                title="Clear Manifest"
                            >
                                <Trash2 size={24} />
                            </button>

                            <button
                                onClick={() => setStep(2)}
                                className={`group flex items-center h-20 pl-10 pr-4 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all bg-slate-900 hover:bg-indigo-600 hover:-translate-y-2 active:translate-y-0`}
                            >
                                <div className="flex flex-col text-left mr-12">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Current Valuation</span>
                                    <span className="text-3xl font-black text-white tabular-nums tracking-tighter">
                                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 bg-white/10 group-hover:bg-white/20 h-14 px-8 rounded-[1.8rem] transition-colors border border-white/5">
                                    <span className="text-white font-black uppercase text-sm tracking-widest">
                                        Review Manifest ({cart.length})
                                    </span>
                                    <ArrowRight size={22} className="text-white group-hover:translate-x-2 transition-transform" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL OVERLAY */}
            {configuringProduct && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setConfiguringProduct(null)} />
                    <div className="relative z-10 w-full max-w-xl shadow-2xl scale-in-center">
                        <VariantModal
                            product={configuringProduct}
                            onClose={() => setConfiguringProduct(null)}
                            onSelectVariant={addToCart}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}