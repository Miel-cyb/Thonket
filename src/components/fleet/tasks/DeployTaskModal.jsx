'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    X,
    ChevronRight,
    Truck,
    User,
    Navigation,
    Layers,
    Search,
    CheckCircle2,
    Package,
    ArrowUpDown,
    Info,
    Weight
} from 'lucide-react';

export default function DeployTaskModal({ 
    isOpen, 
    onClose, 
    orders = [], 
    vehicles = [], 
    onDeploy 
}) {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');

    // --- Cleanup on Modal Toggle ---
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedOrders([]);
            setSelectedVehicle('');
            setSelectedDriver('');
        }
    }, [isOpen]);

    // --- Search & Filter Logic ---
    const availableOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        
        return orders.filter(o => {
            const matchesStatus = o.status === 'pending';
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                (o.customerName?.toLowerCase().includes(searchLower)) ||
                (o.address?.toLowerCase().includes(searchLower)) ||
                (o.id?.toString().includes(searchLower));
            
            return matchesStatus && matchesSearch;
        });
    }, [orders, searchTerm]);

    // --- Action Handlers ---
    const toggleOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId) 
                : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === availableOrders.length && availableOrders.length > 0) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(availableOrders.map(o => o.id));
        }
    };

    const handleDeploy = () => {
        if (!isReady) return;
        onDeploy({
            orderIds: selectedOrders,
            vehicle: selectedVehicle,
            driver: selectedDriver
        });
        onClose();
    };

    const isReady = selectedOrders.length > 0 && selectedVehicle !== '' && selectedDriver !== '';

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white w-full max-w-7xl h-[92vh] rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col scale-in-center">

                {/* TOP COMMAND BAR */}
                <header className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Warehouse Dispatch</h2>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Batch Processing & Fleet Allocation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Client Name, ID or Area..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 w-96 transition-all outline-none"
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden bg-slate-50">
                    {/* LEFT PANEL: ORDER INVENTORY */}
                    <main className="flex-1 flex flex-col border-r border-slate-200 bg-white">
                        <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                                    <input
                                        type="checkbox"
                                        id="select-all-orders"
                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        checked={availableOrders.length > 0 && selectedOrders.length === availableOrders.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="select-all-orders" className="text-xs font-bold text-slate-600 uppercase cursor-pointer">
                                        Select All ({availableOrders.length})
                                    </label>
                                </div>
                                {selectedOrders.length > 0 && (
                                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                                        {selectedOrders.length} Ready for Batch
                                    </span>
                                )}
                            </div>
                            <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                                <ArrowUpDown size={14} /> Sort By Priority
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-4 content-start">
                            {availableOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => toggleOrder(order.id)}
                                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${
                                        selectedOrders.includes(order.id)
                                            ? 'border-indigo-600 bg-indigo-50/20 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                selectedOrders.includes(order.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <Package size={18} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 leading-tight">{order.customerName}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Order ID #{order.id}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${order.type === 'Priority' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {order.type || 'Standard'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
                                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 font-medium">
                                            <Navigation size={12} className="text-slate-300" /> {order.address}
                                        </p>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Weight size={12}/> 12.5kg</span>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Info size={12}/> 2 Boxes</span>
                                        </div>
                                    </div>

                                    {selectedOrders.includes(order.id) && (
                                        <CheckCircle2 size={18} className="absolute -top-2 -right-2 text-indigo-600 bg-white rounded-full" />
                                    )}
                                </div>
                            ))}
                            {availableOrders.length === 0 && (
                                <div className="col-span-full py-20 text-center">
                                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Package size={32} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No pending orders found</p>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* RIGHT PANEL: FLEET DECISION ENGINE */}
                    <aside className="w-[420px] flex flex-col bg-slate-50 overflow-y-auto">
                        <div className="p-8 space-y-8 flex-1">
                            {/* Vehicle Selection */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">01. Fleet Unit</label>
                                    {selectedVehicle && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase"><CheckCircle2 size={12}/> Vehicle Ready</span>}
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {vehicles.map(v => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => setSelectedVehicle(v.name)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full ${
                                                selectedVehicle === v.name
                                                    ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100'
                                                    : 'bg-white border-transparent hover:border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 text-left">
                                                <div className={`p-2.5 rounded-lg ${v.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Truck size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">{v.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Cap: 450kg / 12m³</p>
                                                </div>
                                            </div>
                                            {selectedVehicle === v.name && <div className="h-2 w-2 rounded-full bg-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Driver Selection */}
                            <div className="space-y-4">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">02. Assigned Operator</label>
                                <div className="relative">
                                    <select
                                        value={selectedDriver}
                                        onChange={(e) => setSelectedDriver(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-12 py-4 text-sm font-bold text-slate-700 outline-none appearance-none focus:border-indigo-600 transition-all cursor-pointer"
                                    >
                                        <option value="">Select available driver...</option>
                                        <option value="Kwame">Kwame (Region A - Express)</option>
                                        <option value="Ama">Ama (General Fleet)</option>
                                        <option value="Kojo">Kojo (Heavy Capacity Specialist)</option>
                                    </select>
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none rotate-90" />
                                </div>
                            </div>

                            {/* LOGISTICS SUMMARY CARD */}
                            <div className={`p-6 rounded-3xl transition-all border-2 flex flex-col gap-4 ${
                                isReady ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-white border-dashed border-slate-200'
                            }`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-widest ${isReady ? 'text-indigo-400' : 'text-slate-400'}`}>03. Dispatch Analysis</h4>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-[10px] font-bold uppercase ${isReady ? 'text-slate-500' : 'text-slate-300'}`}>Total Payload</span>
                                        <span className={`text-2xl font-black ${isReady ? 'text-white' : 'text-slate-200'}`}>{selectedOrders.length} <span className="text-xs font-medium">Items</span></span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-[10px] font-bold uppercase ${isReady ? 'text-slate-500' : 'text-slate-300'}`}>Route Logic</span>
                                        <span className={`text-[11px] font-black uppercase tracking-widest ${isReady ? 'text-emerald-400' : 'text-slate-200'}`}>
                                            {isReady ? 'Optimized' : 'Awaiting Data'}
                                        </span>
                                    </div>
                                    {isReady && (
                                        <div className="pt-4 mt-2 border-t border-white/10 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ready for immediate departure</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FINAL ACTIONS FOOTER */}
                        <footer className="p-8 bg-white border-t border-slate-100 flex flex-col gap-4">
                            <button
                                type="button"
                                disabled={!isReady}
                                onClick={handleDeploy}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                Confirm Dispatch ({selectedOrders.length}) <ChevronRight size={16} />
                            </button>
                            <button 
                                type="button"
                                onClick={onClose} 
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors py-2"
                            >
                                Discard Batch
                            </button>
                        </footer>
                    </aside>
                </div>
            </div>
        </div>
    );
}