'use client';

import React, { useMemo } from 'react';
import { 
    Truck, 
    Package, 
    Hash, 
    Activity, 
    ChevronRight,
    Boxes,
    ClipboardList,
    Layers,
    BarChart3,
    ArrowUpRight
} from 'lucide-react';

export default function DriverPickupOverview({
    pickup = {},
    orders = [],
}) {
    // Advanced Analytics focused on Order/Item composition
    const stats = useMemo(() => {
        const totalOrders = orders.length;
        
        // Detailed unit and item breakdown
        const totalUnits = orders.reduce((sum, order) => {
            return sum + (order.items || []).reduce((acc, item) => acc + item.quantity, 0);
        }, 0);

        const totalSkus = orders.reduce((acc, order) => {
            const skus = (order.items || []).map(item => item.sku || item.id);
            return new Set([...acc, ...skus]);
        }, new Set()).size;

        return { totalOrders, totalUnits, totalSkus };
    }, [orders]);

    return (
        <div className="w-full bg-white lg:bg-transparent rounded-[2.5rem] p-6 lg:p-0">
            <div className="flex flex-col space-y-8">
                
                {/* --- TOP ROW: IDENTITY & CORE STATS --- */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    
                    {/* ASSET IDENTITY */}
                    <div className="flex items-center gap-6">
                        <div className="relative group shrink-0">
                            <div className="h-20 w-20 bg-slate-950 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:-translate-y-1">
                                <Truck className="text-white" size={36} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 flex h-6 w-6">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-600 border-[3px] border-white"></span>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                                    <Activity size={12} /> Live Load
                                </div>
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-2">
                                    <Hash size={14} className="text-slate-300" /> 
                                    {pickup?.id || 'RUN-001'}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                                {pickup?.vehicleName || 'Fleet Unassigned'}
                                <ChevronRight size={24} className="text-slate-200 hidden md:block" />
                            </h1>
                        </div>
                    </div>

                    {/* ANALYTICS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 grow max-w-4xl">
                        
                        {/* TOTAL ORDERS */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Assigned Orders</p>
                                <p className="text-2xl font-black text-slate-950">{stats.totalOrders}</p>
                            </div>
                        </div>

                        {/* UNIT VOLUME */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300">
                            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Boxes size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Total Units</p>
                                <p className="text-2xl font-black text-slate-950">{stats.totalUnits}</p>
                            </div>
                        </div>

                        {/* PRODUCT DIVERSITY */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 flex items-center gap-5 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Layers size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">Product Lines</p>
                                <p className="text-2xl font-black text-slate-950">{stats.totalSkus}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM ROW: SECONDARY ANALYTICS & STATUS --- */}
                <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-950 rounded-[2rem] p-2 pr-6">
                    <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4 grow">
                        <BarChart3 className="text-blue-400" size={20} />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Load Density Analysis</span>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[75%] rounded-full shadow-[0_0_10px_#3b82f6]" />
                                </div>
                                <span className="text-xs font-black text-white">75% Capacity</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8 py-2">
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Manifest Sync</p>
                            <p className="text-xs font-black text-white">READY FOR DEPARTURE</p>
                        </div>
                        <div className="h-10 w-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}