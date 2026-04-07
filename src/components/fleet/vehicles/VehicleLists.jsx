'use client';

import React, { useState, useMemo } from 'react';
import { Truck, Activity, Plus, Search, Filter, ArrowUpRight, BarChart3, PackageCheck } from 'lucide-react';
import VehicleCard from './VehicleCard';

export default function VehicleList({ vehicles = [], onView, onAssignDriver }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // FMCG Logic: Filter by search and operational status
    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = activeFilter === 'All' ||
                (activeFilter === 'In Transit' && v.status === 'active') ||
                (activeFilter === 'Idle' && v.status === 'idle') ||
                (activeFilter === 'Maintenance' && v.status === 'issue');

            return matchesSearch && matchesStatus;
        });
    }, [vehicles, searchQuery, activeFilter]);

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col h-full transition-all duration-500">

            {/* DISTRIBUTION CONTROL HEADER */}
            <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-50">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
                            <Truck size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500 leading-none">
                                    Wholesale Distribution
                                </h2>
                                <div className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    FMCG Fleet
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                                Dispatch Console
                            </h3>
                        </div>
                    </div>

                    {/* Operational Metrics Badge */}
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl hidden md:flex items-center gap-2">
                            <PackageCheck size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase">
                                {vehicles.filter(v => v.status === 'active').length} Dispatched
                            </span>
                        </div>
                        <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 shadow-sm">
                            <BarChart3 size={14} className="text-slate-400" />
                            <span className="text-[11px] font-black text-slate-700 uppercase">
                                {vehicles.length} Total Units
                            </span>
                        </div>
                    </div>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-all duration-300"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH BY VEHICLE ID, DRIVER, OR LOAD TYPE..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500/30 transition-all outline-none placeholder:text-slate-300"
                        />
                    </div>
                    <button className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* TACTICAL STATUS STRIP */}
            <div className="px-8 py-3 bg-slate-50/50 border-y border-slate-100 flex gap-8">
                <StatusToggle
                    label="All Assets"
                    count={vehicles.length}
                    active={activeFilter === 'All'}
                    onClick={() => setActiveFilter('All')}
                />
                <StatusToggle
                    label="In Transit"
                    count={vehicles.filter(v => v.status === 'active').length}
                    active={activeFilter === 'In Transit'}
                    onClick={() => setActiveFilter('In Transit')}
                />
                <StatusToggle
                    label="At Depot"
                    count={vehicles.filter(v => v.status === 'idle').length}
                    active={activeFilter === 'Idle'}
                    onClick={() => setActiveFilter('Idle')}
                />
            </div>

            {/* SCROLLABLE LIST AREA */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#FDFDFD] custom-scrollbar">
                {filteredVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
                            <Activity size={32} className="text-slate-200" />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">No matching assets found in registry</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredVehicles.map((vehicle, idx) => (
                            <div
                                key={vehicle.id}
                                className="animate-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                                style={{ animationDelay: `${idx * 40}ms` }}
                            >
                                <VehicleCard
                                    vehicle={vehicle}
                                    onView={onView}
                                    onAssignDriver={onAssignDriver}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* FOOTER: LOGISTICS ACTIONS */}
            <div className="p-6 bg-white border-t border-slate-100">
                <button
                    onClick={() => console.log('Commissioning New Logistics Unit')}
                    className="w-full flex items-center justify-between px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 group shadow-xl shadow-slate-200 hover:shadow-indigo-100"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Add New Distribution Unit</span>
                    </div>
                    <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                </button>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4F46E2; }
            `}</style>
        </div>
    );
}

function StatusToggle({ label, count, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 transition-all relative py-1 group ${active ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
        >
            <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                {label}
            </span>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {count}
            </span>
            {active && (
                <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
        </button>
    );
}