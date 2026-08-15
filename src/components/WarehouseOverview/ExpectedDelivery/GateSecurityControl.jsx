import React from 'react';
import { ShieldCheck, User, Truck, CheckCircle2, Clock, Phone, FileText, Building, Lock } from 'lucide-react';

// This component manages gate security and operational control based on the Inbound Delivery logistics schema.
export default function GateSecurityControl({
    form,
    setForm,
    isArrived,
    isReceiving,
    deliveryId,
    onConfirmArrival,
    onStartReceiving
}) {
    return (
        <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck
                    size={16}
                    className={
                        isReceiving
                            ? 'text-violet-500'
                            : isArrived
                                ? 'text-emerald-500'
                                : 'text-slate-400'
                    }
                />
                <span>Gate Security & Operational Control</span>
            </h3>

            {/* Section 1: Transport & Vehicle Details */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Transport & Vehicle Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Carrier / Logistics Provider
                        </label>
                        <div className="relative">
                            <Building className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.carrierName || ''}
                                onChange={(e) => setForm({ ...form, carrierName: e.target.value })}
                                placeholder="e.g. DHL Express, In-House Fleet"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Truck Registration / License Plate
                        </label>
                        <div className="relative">
                            <Truck className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.truckNumber || ''}
                                onChange={(e) => setForm({ ...form, truckNumber: e.target.value.toUpperCase() })}
                                placeholder="e.g. CA-772-XX"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Driver Information */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Driver Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Driver Full Name (Verified Operator)
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.driverName || ''}
                                onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                                placeholder="e.g. John Doe"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Driver Contact Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="tel"
                                value={form?.driverPhone || ''}
                                onChange={(e) => setForm({ ...form, driverPhone: e.target.value })}
                                placeholder="e.g. +233 24 000 0000"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Documentation & Security Check */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Documentation & Security Check
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Waybill Number
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.waybillNumber || ''}
                                onChange={(e) => setForm({ ...form, waybillNumber: e.target.value })}
                                placeholder="e.g. WB-99823"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Container / Cargo Seal Number
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.sealNumber || ''}
                                onChange={(e) => setForm({ ...form, sealNumber: e.target.value })}
                                placeholder="e.g. SL-44210"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* State Action Controls */}
            <div className="pt-2">
                {!isArrived && !isReceiving ? (
                    <button
                        type="button"
                        onClick={() => onConfirmArrival(deliveryId)}
                        disabled={!form?.driverName?.trim() || !form?.truckNumber?.trim()}
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
                    >
                        Log Gate Entry & Confirm Vehicle Arrival
                    </button>
                ) : isArrived ? (
                    <div className="bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-800/40 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Vehicle presence verified. Cleared for bay docking and receiving.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onStartReceiving(deliveryId)}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-[0.98]"
                        >
                            Initiate Offloading
                        </button>
                    </div>
                ) : (
                    <div className="bg-violet-50/80 dark:bg-violet-500/10 border border-violet-200/80 dark:border-violet-800/40 p-4 rounded-xl flex items-center space-x-3 text-xs text-violet-800 dark:text-violet-300 font-medium">
                        <Clock size={18} className="text-violet-600 dark:text-violet-400 animate-spin shrink-0" />
                        <span>Receiving in Progress: Line marshals are actively scanning and auditing incoming pallets.</span>
                    </div>
                )}
            </div>
        </div>
    );
}