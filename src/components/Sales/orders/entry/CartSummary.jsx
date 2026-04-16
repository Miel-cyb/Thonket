'use client';

import React, { useState, useEffect } from 'react';
import {
    Trash2, Plus, Minus, CreditCard, Banknote,
    ShieldAlert, ChevronLeft, XOctagon, Receipt,
    Boxes, ChevronRight, User, MapPin, Navigation
} from "lucide-react";
import MapPickerModal from "../../../Map/MapPickerModal";

export default function CartSummary({
    cart, total, paymentMethod, setPaymentMethod,
    selectedCustomer, onUpdateQty, onRemove,
    onCreateOrder, onBack, onCancel,
    onUpdateLocation
}) {
    const [isMapOpen, setIsMapOpen] = useState(false);

    // Local state to ensure the UI updates the "Execute" button instantly
    const [localCoords, setLocalCoords] = useState(selectedCustomer?.coordinates);

    // Sync local state if the selectedCustomer prop changes from the parent
    useEffect(() => {
        setLocalCoords(selectedCustomer?.coordinates);
    }, [selectedCustomer?.coordinates]);

    const totalUnits = cart.reduce((acc, item) => acc + item.qty, 0);
    const taxAmount = total * 0.05;
    const grandTotal = total + taxAmount;

    const customerLocation = selectedCustomer?.location || selectedCustomer?.address;

    // Updated check: look at both the prop and the local state
    const hasCoordinates = (selectedCustomer?.coordinates?.lat && selectedCustomer?.coordinates?.lng) ||
        (localCoords?.lat && localCoords?.lng);

    const handleConfirmLocation = (data) => {
        // Update local UI immediately so the 'Execute' button enables
        setLocalCoords(data.coordinates);

        if (onUpdateLocation) {
            onUpdateLocation(data);
        }
        setIsMapOpen(false);
    };

    return (
        <div className="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-slate-300 overflow-hidden">

            {/* 1. HEADER */}
            <div className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Modify
                    </button>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">Manifest Review</h2>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Ref: #INV-{new Date().getTime().toString().slice(-5)}</p>
                    </div>
                </div>

                {selectedCustomer && (
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1 pr-4 rounded-full shadow-sm">
                        <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                            <User size={14} />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-900 uppercase leading-none">{selectedCustomer.name}</p>
                            <div className="flex items-center gap-1 text-emerald-600">
                                <MapPin size={10} />
                                <p className="text-[9px] font-bold truncate max-w-[120px] uppercase">
                                    {customerLocation || "No Location"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-100">
                    <XOctagon size={14} /> Abort
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex flex-1 overflow-hidden">

                {/* 2. LEFT: ITEM MANIFEST */}
                <div className="flex-[1.6] flex flex-col bg-slate-50/30 border-r border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between py-4 px-10 shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation Details</span>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                            <Boxes size={12} /> {totalUnits} Units
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-10 pb-8 custom-scrollbar space-y-2">
                        {cart.map(item => (
                            <div key={item.cartId} className="group flex items-center bg-white rounded-2xl border border-slate-200 p-4 transition-all hover:border-indigo-200 shadow-sm hover:shadow-md">
                                <div className="flex-1">
                                    <p className="text-[8px] font-black text-indigo-500 uppercase mb-0.5">{item.sku} • {item.variantName}</p>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-tight">{item.name}</h4>
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100 mx-6">
                                    <button onClick={() => onUpdateQty(item.cartId, -1)} className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-red-500 transition-all"><Minus size={12} /></button>
                                    <span className="font-black text-xs w-6 text-center tabular-nums">{item.qty}</span>
                                    <button onClick={() => onUpdateQty(item.cartId, 1)} className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all"><Plus size={12} /></button>
                                </div>

                                <div className="w-28 text-right font-black text-slate-900 text-xs tabular-nums">
                                    GHS {(item.price * item.qty).toLocaleString()}
                                </div>

                                <button onClick={() => onRemove(item.cartId)} className="ml-4 p-2 text-slate-200 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. RIGHT: LOGISTICS & ACTION */}
                <div className="flex-1 bg-white flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                        {/* 📍 GEOGRAPHIC ROUTING */}
                        <div className={`rounded-3xl p-5 border transition-all ${hasCoordinates ? 'bg-indigo-50/30 border-indigo-100' : 'bg-emerald-50/30 border-emerald-100 border-dashed'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`flex items-center gap-2 ${hasCoordinates ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                    <Navigation size={14} strokeWidth={3} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Geo-Routing</span>
                                </div>
                                {hasCoordinates && <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">Locked</span>}
                            </div>

                            {hasCoordinates ? (
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-white rounded-2xl border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                                        <MapPin className="text-indigo-600" size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Target Coordinates</p>
                                        <p className="text-[10px] font-mono font-bold text-slate-700 truncate">
                                            {localCoords?.lat?.toFixed(5) || selectedCustomer?.coordinates?.lat?.toFixed(5)},
                                            {localCoords?.lng?.toFixed(5) || selectedCustomer?.coordinates?.lng?.toFixed(5)}
                                        </p>
                                        <button onClick={() => setIsMapOpen(true)} className="text-[9px] font-black text-indigo-600 uppercase mt-1 hover:underline">
                                            Re-pin on Map
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setIsMapOpen(true)} className="w-full py-4 flex flex-col items-center justify-center gap-2 group transition-colors hover:bg-emerald-100/50 rounded-2xl">
                                    <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <MapPin size={18} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-emerald-700 tracking-tight">Set Map Drop-off</span>
                                </button>
                            )}
                        </div>

                        {/* SETTLEMENT */}
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Settlement</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setPaymentMethod("cash")} className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                    <Banknote size={18} />
                                    <span className="font-black text-[9px] uppercase tracking-tighter">Cash/Transfer</span>
                                </button>
                                <button onClick={() => setPaymentMethod("credit")} className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'credit' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                    <CreditCard size={18} />
                                    <span className="font-black text-[9px] uppercase tracking-tighter">Net 30 Credit</span>
                                </button>
                            </div>
                        </div>

                        {/* TOTALS */}
                        <div className="pt-4 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <span>Subtotal</span>
                                <span className="text-slate-900">GHS {total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                <span>Processing (5%)</span>
                                <span className="text-slate-900">GHS {taxAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. ACTION FOOTER */}
                    <div className="p-6 bg-slate-50 border-t border-slate-200 shrink-0">
                        <div className="mb-4">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-0.5">Total Due</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
                                <span className="text-lg mr-1 text-slate-300 font-bold">GHS</span>
                                {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <button
                            disabled={!selectedCustomer || !hasCoordinates || cart.length === 0}
                            onClick={onCreateOrder}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Receipt size={18} strokeWidth={3} />
                            Execute Order
                            <ChevronRight size={18} strokeWidth={3} />
                        </button>

                        {!hasCoordinates && (
                            <div className="mt-3 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
                                <ShieldAlert size={14} className="animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-tighter">Awaiting Map Geo-Tag</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MapPickerModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={handleConfirmLocation}
                initialLocation={selectedCustomer?.coordinates || localCoords}
            />
        </div>
    );
}