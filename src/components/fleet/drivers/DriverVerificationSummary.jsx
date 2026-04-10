'use client';

import React, { useMemo } from 'react';
import {
    CheckCircle2,
    Plus,
    Minus,
    ClipboardCheck,
    ShieldCheck,
    AlertTriangle,
    X
} from 'lucide-react';

export default function DriverVerificationSummary({
    orders = [],
    onUpdateQuantity,
    onConfirmAll,
    onClose
}) {
    const masterManifest = useMemo(() => {
        const items = [];
        orders.forEach(order => {
            (order.items || []).forEach(item => {
                items.push({
                    ...item,
                    orderId: order.id,
                    customerName: order.customerName
                });
            });
        });
        return items;
    }, [orders]);

    const totalUnits = masterManifest.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const confirmedUnits = masterManifest.reduce((sum, item) => sum + (item.confirmedQuantity || 0), 0);
    const isComplete = totalUnits > 0 && confirmedUnits === totalUnits;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Modal Header - Fixed */}
            <div className="shrink-0 bg-slate-900 p-6 md:p-8 text-white relative">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">Inventory Audit</p>
                <div className="flex items-end gap-3">
                    <h2 className="text-4xl md:text-5xl font-black tabular-nums">{confirmedUnits}</h2>
                    <span className="text-xl md:text-2xl font-bold text-slate-500 mb-1">/ {totalUnits}</span>
                </div>

                <div className="mt-6 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-700 ease-out rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${totalUnits > 0 ? (confirmedUnits / totalUnits) * 100 : 0}%` }}
                    />
                </div>
            </div>

            {/* List Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 custom-scrollbar">
                {masterManifest.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                        No items found in manifest
                    </div>
                ) : (
                    masterManifest.map((item, idx) => {
                        const isDone = (item.confirmedQuantity || 0) === item.quantity;
                        return (
                            <div
                                key={`${item.orderId}-${item.id}-${idx}`}
                                className={`group flex items-center justify-between p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all 
                                    ${isDone ? 'bg-white border-emerald-500 shadow-md' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">
                                        {item.customerName}
                                    </span>
                                    <h4 className="text-sm md:text-base font-black text-slate-800 uppercase truncate leading-tight mt-1">
                                        {item.name}
                                    </h4>
                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Target: {item.quantity}</span>
                                        {isDone && (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4">
                                    <div className="flex items-center bg-slate-100 rounded-xl md:rounded-2xl p-1 border border-slate-200">
                                        <button
                                            onClick={() => onUpdateQuantity(item.orderId, item.id, Math.max(0, (item.confirmedQuantity || 0) - 1))}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-red-500 rounded-xl transition-all"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-black text-sm tabular-nums text-slate-900">
                                            {item.confirmedQuantity || 0}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.orderId, item.id, (item.confirmedQuantity || 0) + 1)}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:text-indigo-600 rounded-xl transition-all"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => onUpdateQuantity(item.orderId, item.id, isDone ? 0 : item.quantity)}
                                        className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border-2 transition-all 
                                            ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-300'}`}
                                    >
                                        {isDone ? <CheckCircle2 size={24} /> : <ClipboardCheck size={24} />}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Confirmation Footer - Fixed */}
            <div className="shrink-0 p-6 md:p-8 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
                <button
                    disabled={!isComplete}
                    onClick={onConfirmAll}
                    className={`w-full flex items-center justify-center gap-4 py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-2xl
                        ${isComplete
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <ShieldCheck size={20} className={isComplete ? "text-emerald-400" : "text-slate-300"} />
                    Complete Load Audit
                </button>

                {!isComplete && (
                    <p className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-amber-600 uppercase tracking-tight">
                        <AlertTriangle size={14} />
                        {totalUnits - confirmedUnits} Units remaining to verify
                    </p>
                )}
            </div>
        </div>
    );
}