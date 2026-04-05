'use client';

import {
    Trash2, Plus, Minus, CreditCard, Banknote,
    Truck, ShieldAlert, ChevronLeft,
    XOctagon, Receipt, Boxes,
    ChevronRight, Download
} from "lucide-react";

export default function CartSummary({
    cart, total, paymentMethod, setPaymentMethod,
    selectedCustomer, onUpdateQty, onRemove,
    onCreateOrder, onBack, onCancel
}) {
    const totalUnits = cart.reduce((acc, item) => acc + item.qty, 0);
    const taxAmount = total * 0.05;
    const grandTotal = total + taxAmount;
    const estWeight = (totalUnits * 1.5).toFixed(1);

    return (
        <div className="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-slate-300 overflow-hidden">

            {/* 1. HEADER (Fixed) */}
            <div className="px-10 py-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-8">
                    <button onClick={onBack} className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-bold text-[11px] uppercase tracking-widest">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Catalog
                    </button>
                    <div className="h-10 w-px bg-slate-200" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Manifest Review</h2>
                </div>
                <button onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-red-500 bg-red-50 hover:bg-red-100 transition-all font-black text-[11px] uppercase tracking-widest border border-red-100">
                    <XOctagon size={16} /> Abort
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* 2. LEFT: SCROLLABLE MANIFEST */}
                <div className="flex-[1.8] overflow-y-auto p-10 custom-scrollbar border-r border-slate-100">
                    {/* ... (Keep your existing cart.map logic here) ... */}
                    {cart.map(item => (
                        <div key={item.cartId} className="group flex items-center bg-white rounded-2xl border border-slate-100 p-5 mb-3">
                            <div className="flex-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase">{item.sku}</p>
                                <h4 className="font-black text-slate-900 uppercase">{item.name}</h4>
                                <span className="text-[10px] font-bold text-indigo-600">{item.variant}</span>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <button onClick={() => onUpdateQty(item.cartId, -1)} className="p-1 hover:text-indigo-600"><Minus size={14} /></button>
                                <span className="font-black w-8 text-center">{item.qty}</span>
                                <button onClick={() => onUpdateQty(item.cartId, 1)} className="p-1 hover:text-indigo-600"><Plus size={14} /></button>
                            </div>
                            <div className="w-24 text-right font-black ml-8">
                                ${(item.price * item.qty).toLocaleString()}
                            </div>
                            <button onClick={() => onRemove(item.cartId)} className="ml-4 p-2 text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                    ))}
                </div>

                {/* 3. RIGHT: SUMMARY WITH PINNED FOOTER */}
                <div className="flex-1 bg-slate-50 flex flex-col">
                    {/* Top Section: Scrollable if content is long */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl">
                            <div className="flex items-center gap-3 mb-4 text-indigo-400">
                                <Truck size={18} /> <span className="text-[10px] font-black uppercase">Logistics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[9px] text-slate-400 uppercase">Payload</p><p className="text-xl font-black">{totalUnits} Units</p></div>
                                <div><p className="text-[9px] text-slate-400 uppercase">Tonnage</p><p className="text-xl font-black">{estWeight} KG</p></div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Subtotal</span><span className="text-slate-900">${total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Tax (5.0%)</span><span className="text-slate-900">${taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-right text-[10px] font-black text-indigo-600 uppercase tracking-widest">Grand Total</p>
                                <p className="text-right text-5xl font-black text-slate-900 tracking-tighter">${grandTotal.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setPaymentMethod("cash")} className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase transition-all ${paymentMethod === 'cash' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Wire Transfer</button>
                            <button onClick={() => setPaymentMethod("credit")} className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase transition-all ${paymentMethod === 'credit' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>Net 30 Credit</button>
                        </div>
                    </div>

                    {/* FIXED ACTION BUTTON: This part never moves */}
                    <div className="p-8 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                        {!selectedCustomer && (
                            <div className="flex items-center justify-center gap-2 mb-4 text-amber-600 animate-pulse">
                                <ShieldAlert size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Select Customer Profile</span>
                            </div>
                        )}
                        <button
                            disabled={!selectedCustomer || cart.length === 0}
                            onClick={onCreateOrder}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Receipt size={20} />
                            Execute Order
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}