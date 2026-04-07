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
    Weight,
    Info
} from 'lucide-react';

export default function DeployTaskModal({ 
    isOpen, 
    onClose, 
    orders = [], 
    vehicles = [], 
    onDeploy 
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedDriver, setSelectedDriver] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedOrders([]);
            setSelectedVehicle('');
            setSelectedDriver('');
        }
    }, [isOpen]);

    const availableOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return orders.filter(o => {
            const matchesStatus = o.status === 'pending';
            const searchLower = searchTerm.toLowerCase();
            return matchesStatus && (
                o.customerName?.toLowerCase().includes(searchLower) ||
                o.address?.toLowerCase().includes(searchLower) ||
                o.id?.toString().includes(searchLower)
            );
        });
    }, [orders, searchTerm]);

    const toggleOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === availableOrders.length && availableOrders.length > 0) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(availableOrders.map(o => o.id));
        }
    };

    const isReady = selectedOrders.length > 0 && selectedVehicle !== '' && selectedDriver !== '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-7xl h-[92vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                
                {/* HEADER SECTION */}
                <header className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="bg-indigo-600 p-2.5 rounded-xl text-white">
                            <Layers size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 leading-tight">Create Dispatch Batch</h2>
                            <p className="text-xs text-slate-500 font-medium">Assign pending orders to fleet units and drivers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Filter by ID, client, or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm w-96 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden bg-slate-50">
                    
                    {/* LEFT PANEL: ORDER INVENTORY */}
                    <section className="flex-1 flex flex-col border-r border-slate-200 bg-white">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                                    <input
                                        type="checkbox"
                                        id="master-select"
                                        className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                                        checked={availableOrders.length > 0 && selectedOrders.length === availableOrders.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label htmlFor="master-select" className="text-xs font-bold text-slate-700 cursor-pointer uppercase tracking-wider">
                                        Select All ({availableOrders.length})
                                    </label>
                                </div>
                                {selectedOrders.length > 0 && (
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                        {selectedOrders.length} Selected
                                    </span>
                                )}
                            </div>
                            <button className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-slate-800 transition-colors">
                                <ArrowUpDown size={14} /> Sort By Priority
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 xl:grid-cols-2 gap-4 content-start">
                            {availableOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => toggleOrder(order.id)}
                                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                                        selectedOrders.includes(order.id)
                                            ? 'border-indigo-600 bg-indigo-50/20 shadow-sm'
                                            : 'border-slate-100 bg-white hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${selectedOrders.includes(order.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-900 leading-none mb-1">{order.customerName}</p>
                                                <p className="text-[11px] font-medium text-slate-500 uppercase">ID: #{order.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">{order.type || 'Standard'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Navigation size={12} className="shrink-0" />
                                            <p className="text-[11px] font-medium truncate max-w-[180px]">{order.address}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                            <Weight size={12} /> 12.5kg
                                        </div>
                                    </div>

                                    {selectedOrders.includes(order.id) && (
                                        <CheckCircle2 size={18} className="absolute -top-2 -right-2 text-indigo-600 bg-white rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* RIGHT PANEL: ALLOCATION ENGINE */}
                    <aside className="w-[420px] flex flex-col bg-slate-50 overflow-y-auto">
                        <div className="p-8 space-y-8 flex-1">
                            
                            {/* Step 1: Vehicle */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">01. Select Vehicle</h3>
                                    {selectedVehicle && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>}
                                </div>
                                <div className="space-y-2">
                                    {vehicles.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVehicle(v.name)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                                                selectedVehicle === v.name
                                                    ? 'bg-white border-indigo-600 shadow-sm'
                                                    : 'bg-white border-transparent hover:border-slate-200'
                                            }`}
                                        >
                                            <div className={`p-2.5 rounded-lg ${v.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <Truck size={18} />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-bold text-slate-900 uppercase">{v.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Capacity: 450kg / 12m³</p>
                                            </div>
                                            {selectedVehicle === v.name && <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Step 2: Driver */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">02. Assign Driver</h3>
                                <div className="relative">
                                    <select
                                        value={selectedDriver}
                                        onChange={(e) => setSelectedDriver(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Choose an available operator...</option>
                                        <option value="Kwame">Kwame (Primary - Zone A)</option>
                                        <option value="Ama">Ama (Secondary - Zone B)</option>
                                        <option value="Kojo">Kojo (Heavy Lift Certified)</option>
                                    </select>
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" />
                                </div>
                            </section>

                            {/* Step 3: Analysis */}
                            <section className={`p-6 rounded-2xl transition-all border-2 ${isReady ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-dashed border-slate-200'}`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isReady ? 'text-indigo-400' : 'text-slate-400'}`}>03. Dispatch Analysis</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-xs font-bold ${isReady ? 'text-slate-400' : 'text-slate-300'}`}>Total Payload</span>
                                        <span className={`text-xl font-black ${isReady ? 'text-white' : 'text-slate-200'}`}>{selectedOrders.length} <span className="text-xs font-medium">Orders</span></span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-xs font-bold ${isReady ? 'text-slate-400' : 'text-slate-300'}`}>Route Logic</span>
                                        <span className={`text-[11px] font-black uppercase tracking-wider ${isReady ? 'text-emerald-400' : 'text-slate-200'}`}>
                                            {isReady ? 'Auto-Optimized' : 'Pending...'}
                                        </span>
                                    </div>
                                    
                                    {!isReady && (
                                        <div className="mt-4 flex items-center gap-2 text-slate-400 text-[10px] font-bold bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <Info size={14} /> Complete steps 1 & 2 to calculate route
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* FOOTER ACTIONS */}
                        <footer className="p-8 bg-white border-t border-slate-200 flex flex-col gap-4">
                            <button
                                disabled={!isReady}
                                onClick={handleDeploy}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
                            >
                                Confirm & Initialize Dispatch ({selectedOrders.length})
                                <ChevronRight size={18} />
                            </button>
                            <button onClick={onClose} className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                                Cancel & Discard Batch
                            </button>
                        </footer>
                    </aside>
                </div>
            </div>
        </div>
    );
}