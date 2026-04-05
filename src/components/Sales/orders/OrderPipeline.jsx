'use client';

import { useState, useMemo } from "react";
import {
    Search, Filter, Eye, MoreHorizontal, CheckCircle2,
    AlertCircle, Clock, Package, Truck,
    Layers, Download, ChevronRight
} from "lucide-react";

const pipelineData = [
    { id: 'ORD-101', customer: 'Global Logistics Corp', amount: '$1,200.00', status: 'Pending', date: 'Oct 24', priority: 'High' },
    { id: 'ORD-102', customer: 'Alpha Retailers', amount: '$850.00', status: 'Approved', date: 'Oct 24', priority: 'Medium' },
    { id: 'ORD-103', customer: 'Kwame Stores Ltd', amount: '$2,100.00', status: 'Processing', date: 'Oct 23', priority: 'High' },
    { id: 'ORD-104', customer: 'Linda Mart', amount: '$400.00', status: 'Issues', date: 'Oct 22', priority: 'Critical' },
    { id: 'ORD-105', customer: 'Techno Solutions', amount: '$3,400.00', status: 'Delivered', date: 'Oct 21', priority: 'Low' },
];

const statusConfig = {
    All: { color: 'bg-slate-900', bgSoft: 'bg-slate-50', text: 'text-slate-900', icon: Package },
    Pending: { color: 'bg-amber-500', bgSoft: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    Approved: { color: 'bg-indigo-600', bgSoft: 'bg-indigo-50', text: 'text-indigo-700', icon: CheckCircle2 },
    Processing: { color: 'bg-blue-500', bgSoft: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
    Delivered: { color: 'bg-emerald-600', bgSoft: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
    Issues: { color: 'bg-red-600', bgSoft: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
};

export default function OrderPipeline() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = useMemo(() => {
        return pipelineData.filter(order => {
            const matchesTab = activeTab === 'All' || order.status === activeTab;
            const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    return (
        <div className="flex flex-col h-[780px] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300">

            {/* 1. HEADER / NAVIGATION - INCREASED SCALE */}
            <div className="px-10 py-7 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white z-10">
                <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-full overflow-x-auto no-scrollbar border border-slate-100">
                    {Object.keys(statusConfig).map((status) => {
                        const Icon = statusConfig[status].icon;
                        const isActive = activeTab === status;
                        return (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.12em] transition-all duration-300 ${isActive
                                    ? `${statusConfig[status].color} text-white shadow-lg shadow-slate-200 scale-105`
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white"
                                    }`}
                            >
                                <Icon size={14} />
                                {status}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH PROTOCOLS..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] font-bold uppercase tracking-widest outline-none focus:ring-4 ring-indigo-50 transition-all"
                        />
                    </div>
                    <button className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* 2. ALIGNED TABLE HEADER - CORRECTED RATION */}
            <div className="grid grid-cols-12 px-14 py-5 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                <div className="col-span-2">Ref. ID</div>
                <div className="col-span-3">Designation / Entity</div>
                <div className="col-span-2 text-center">Net Valuation</div>
                <div className="col-span-2 text-center">Operational State</div>
                <div className="col-span-2 text-center">System Stamp</div>
                <div className="col-span-1 text-right pr-4">Utility</div>
            </div>

            {/* 3. SCROLLABLE DATA STREAM */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-white scrollbar-thin scrollbar-thumb-slate-200">
                {filteredOrders.length > 0 ? (
                    <div className="space-y-2">
                        {filteredOrders.map((order) => {
                            const config = statusConfig[order.status] || statusConfig.All;
                            return (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-12 items-center px-8 py-5 hover:bg-slate-50 rounded-[2rem] transition-all group relative border border-transparent hover:border-slate-100 hover:translate-x-1"
                                >
                                    {/* STATUS ACCENT - POSITIONED TO PREVENT GAPS */}
                                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-full ${config.color} opacity-10 group-hover:opacity-100 transition-all duration-500`} />

                                    {/* ID */}
                                    <div className="col-span-2">
                                        <span className="text-[12px] font-mono font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                                            #{order.id.split('-')[1]}
                                        </span>
                                    </div>

                                    {/* Customer / Entity */}
                                    <div className="col-span-3 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-all">
                                            {order.customer.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{order.customer}</p>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Verified Protocol</span>
                                        </div>
                                    </div>

                                    {/* Valuation */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-[14px] font-black text-slate-900 tracking-tighter">{order.amount}</span>
                                    </div>

                                    {/* Operational State */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent group-hover:border-current/10 ${config.bgSoft} ${config.text}`}>
                                            <span className={`relative flex h-2.5 w-2.5`}>
                                                {order.status === 'Processing' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>}
                                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.color}`}></span>
                                            </span>
                                            {order.status}
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="col-span-2 text-center">
                                        <p className="text-[11px] font-black text-slate-700 uppercase">{order.date} OCT 24</p>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">09:42 AM</p>
                                    </div>

                                    {/* Actions / Utility */}
                                    <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <Layers size={56} className="text-slate-100 mb-6" />
                        <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.2em] mb-2">Zero Data Density</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adjust filters to re-populate stream</p>
                    </div>
                )}
            </div>

            {/* 4. OPERATIONAL FOOTER */}
            <div className="px-10 py-6 border-t border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        Live Stream: <span className="text-slate-900">{filteredOrders.length} Records</span>
                    </div>
                    <button className="hidden md:flex items-center gap-2.5 text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:text-indigo-700 transition-colors">
                        <Download size={16} /> Manifest.csv
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <div className="px-5 py-2.5 bg-slate-900 rounded-xl text-[10px] font-black tracking-[0.25em] text-white">
                        PAGE 01 / 01
                    </div>
                    <button className="p-2.5 border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}