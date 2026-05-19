'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import {
    Search, Filter, Eye, MoreHorizontal, CheckCircle2,
    AlertCircle, Package, Truck, CreditCard,
    Layers, Download, ChevronRight, Calendar, X
} from "lucide-react";

// Mock data with ISO dates
const pipelineData = [
    { id: 'ORD-101', customer: 'Global Logistics Corp', amount: '$1,200.00', status: 'Pending', date: '2026-10-24', priority: 'High' },
    { id: 'ORD-102', customer: 'Alpha Retailers', amount: '$850.00', status: 'Approved', date: '2026-10-24', priority: 'Medium' },
    { id: 'ORD-103', customer: 'Kwame Stores Ltd', amount: '$2,100.00', status: 'Processing', date: '2026-10-23', priority: 'High' },
    { id: 'ORD-104', customer: 'Linda Mart', amount: '$400.00', status: 'Issues', date: '2026-10-22', priority: 'Critical' },
    { id: 'ORD-105', customer: 'Techno Solutions', amount: '$3,400.00', status: 'Delivered', date: '2026-10-21', priority: 'Low' },
    { id: 'ORD-106', customer: 'Prestige Ventures', amount: '$1,750.00', status: 'Payment Status', date: '2026-10-18', priority: 'Medium' },
];

const statusConfig = {
    All: { color: 'bg-slate-900', bgSoft: 'bg-slate-50', text: 'text-slate-900', icon: Package },
    'Payment Status': { color: 'bg-purple-600', bgSoft: 'bg-purple-50', text: 'text-purple-700', icon: CreditCard },
    Approved: { color: 'bg-indigo-600', bgSoft: 'bg-indigo-50', text: 'text-indigo-700', icon: CheckCircle2 },
    Processing: { color: 'bg-blue-500', bgSoft: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
    Delivered: { color: 'bg-emerald-600', bgSoft: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
    Issues: { color: 'bg-red-600', bgSoft: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
};

const formatUIDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = String(date.getFullYear()).slice(-2);
    return `${day} ${month} ${year}`;
};

export default function OrderPipeline() {
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [timeHorizon, setTimeHorizon] = useState('all');
    const [startDate, setStartDate] = useState('2026-10-15');
    const [endDate, setEndDate] = useState('2026-10-24');

    // UI state for the popup picker
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const pickerRef = useRef(null);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOrders = useMemo(() => {
        const anchorToday = new Date('2026-10-24');

        return pipelineData.filter(order => {
            let targetStatus = order.status;
            if (targetStatus === 'Pending') {
                targetStatus = 'Payment Status';
            }

            const matchesTab = activeTab === 'All' || targetStatus === activeTab;
            const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());

            const orderDate = new Date(order.date);
            let matchesTime = true;

            if (timeHorizon === 'today') {
                matchesTime = orderDate.toDateString() === anchorToday.toDateString();
            } else if (timeHorizon === 'week') {
                const oneWeekAgo = new Date(anchorToday);
                oneWeekAgo.setDate(anchorToday.getDate() - 7);
                matchesTime = orderDate >= oneWeekAgo && orderDate <= anchorToday;
            } else if (timeHorizon === 'custom') {
                const startBound = startDate ? new Date(startDate) : null;
                const endBound = endDate ? new Date(endDate) : null;

                if (startBound) startBound.setHours(0, 0, 0, 0);
                if (endBound) endBound.setHours(23, 59, 59, 999);

                if (startBound && orderDate < startBound) matchesTime = false;
                if (endBound && orderDate > endBound) matchesTime = false;
            }

            return matchesTab && matchesSearch && matchesTime;
        });
    }, [activeTab, searchQuery, timeHorizon, startDate, endDate]);

    const timeHorizonLabel = useMemo(() => {
        if (timeHorizon === 'all') return 'All Time';
        if (timeHorizon === 'today') return 'Today';
        if (timeHorizon === 'week') return 'Past Week';
        if (timeHorizon === 'custom') return `${formatUIDate(startDate)} - ${formatUIDate(endDate)}`;
        return 'Select Timeframe';
    }, [timeHorizon, startDate, endDate]);

    return (
        <div className="flex flex-col h-[880px] w-full max-w-7xl mx-auto bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300">

            {/* 1. HEADER / NAVIGATION */}
            <div className="px-6 md:px-10 pt-8 pb-5 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white z-20 shrink-0">
                <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-slate-200/40">
                    {Object.keys(statusConfig).map((status) => {
                        const Icon = statusConfig[status].icon;
                        const isActive = activeTab === status;
                        return (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setActiveTab(status)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 ${isActive
                                    ? `${statusConfig[status].color} text-white shadow-md shadow-slate-200 scale-[1.02]`
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                                    }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {status}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto min-w-0">
                    <div className="relative flex-1 xl:w-72 group min-w-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all truncate"
                        />
                    </div>
                    <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-purple-600 transition-all shadow-md shadow-slate-100 shrink-0">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* TIME-HORIZON SUB-HEADER */}
            <div className="px-6 md:px-10 pb-5 border-b border-slate-100 flex items-center justify-between bg-white relative z-30 shrink-0">
                <div className="relative" ref={pickerRef}>
                    <button
                        onClick={() => setIsPickerOpen(!isPickerOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100/80 text-slate-800 border border-slate-200/80 font-bold rounded-xl text-xs md:text-sm shadow-sm transition-all"
                    >
                        <Calendar size={15} className="text-purple-600" />
                        <span>Timeframe: <span className="text-purple-700 ml-1 font-extrabold">{timeHorizonLabel}</span></span>
                    </button>

                    {isPickerOpen && (
                        <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800">Select Range horizon</h3>
                                <button onClick={() => setIsPickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-1.5 mb-4">
                                <button
                                    onClick={() => { setTimeHorizon('all'); setIsPickerOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${timeHorizon === 'all' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    All Time
                                </button>
                                <button
                                    onClick={() => { setTimeHorizon('today'); setIsPickerOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 ${timeHorizon === 'today' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                                    Today
                                </button>
                                <button
                                    onClick={() => { setTimeHorizon('week'); setIsPickerOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg ${timeHorizon === 'week' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    Past 7 Days
                                </button>
                            </div>

                            <div className="pt-3 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Custom Boundaries</label>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-slate-500 w-10">From</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setTimeHorizon('custom');
                                            }}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-slate-500 w-10">To</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => {
                                                setEndDate(e.target.value);
                                                setTimeHorizon('custom');
                                            }}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold text-slate-700 outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block">
                    Temporal Horizon Filtering Protocol
                </span>
            </div>

            {/* 2. ALIGNED TABLE HEADER */}
            <div className="grid grid-cols-12 px-8 md:px-14 py-4 bg-slate-50 border-b border-slate-200/60 text-[11px] md:text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 select-none">
                <div className="col-span-2">Ref. ID</div>
                <div className="col-span-4 md:col-span-3">Designation / Entity</div>
                <div className="col-span-3 md:col-span-2 text-center">Net Valuation</div>
                <div className="col-span-3 text-center">Operational State</div>
                <div className="hidden md:block col-span-2 text-right pr-4">Utility Actions</div>
            </div>

            {/* 3. SCROLLABLE DATA STREAM */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-white [scrollbar-width:thin] scrollbar-thumb-slate-200">
                {filteredOrders.length > 0 ? (
                    <div className="space-y-2">
                        {filteredOrders.map((order) => {
                            let displayStatus = order.status;
                            if (displayStatus === 'Pending') displayStatus = 'Payment Status';

                            const config = statusConfig[displayStatus] || statusConfig.All;
                            return (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-12 items-center px-4 md:px-8 py-4 bg-white hover:bg-slate-50/60 rounded-2xl transition-all group relative border border-slate-100 shadow-sm hover:border-slate-200"
                                >
                                    <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full ${config.color} opacity-40 group-hover:opacity-100 transition-all duration-300`} />

                                    <div className="col-span-2">
                                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md group-hover:text-purple-600 transition-colors">
                                            #{order.id.split('-')[1]}
                                        </span>
                                    </div>

                                    <div className="col-span-4 md:col-span-3 flex items-center gap-3 min-w-0">
                                        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-purple-50 border border-purple-100/40 flex items-center justify-center text-sm font-bold text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                                            {order.customer.charAt(0)}
                                        </div>
                                        <div className="min-w-0 truncate">
                                            <p className="text-sm font-bold text-slate-900 tracking-tight truncate mb-0.5">{order.customer}</p>
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                {formatUIDate(order.date)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-2 text-center">
                                        <span className="text-sm font-black text-slate-900 tracking-tight">{order.amount}</span>
                                    </div>

                                    <div className="col-span-3 flex justify-center">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-transparent ${config.bgSoft} ${config.text} whitespace-nowrap`}>
                                            <span className="relative flex h-2 w-2">
                                                {displayStatus === 'Processing' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>}
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`}></span>
                                            </span>
                                            <span className="hidden sm:inline">{displayStatus}</span>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex col-span-2 justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        <button className="p-1.5 hover:bg-white hover:border-slate-200 border border-transparent shadow-sm rounded-xl text-slate-400 hover:text-purple-600 transition-all">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-1.5 hover:bg-white hover:border-slate-200 border border-transparent shadow-sm rounded-xl text-slate-400 hover:text-purple-600 transition-all">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <Layers size={44} className="text-slate-200 mb-3 animate-pulse" />
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Zero Data Density</h4>
                        <p className="text-xs text-slate-400 text-center max-w-xs">Adjust active lifecycle stages or temporal ranges to repopulate pipeline stream.</p>
                    </div>
                )}
            </div>

            {/* 4. OPERATIONAL FOOTER */}
            <div className="px-6 md:px-10 py-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Stream: <span className="text-slate-900 font-extrabold">{filteredOrders.length} Records</span>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider hover:text-purple-700 transition-colors">
                        <Download size={14} /> Manifest.csv
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                        <ChevronRight size={16} className="rotate-180" />
                    </button>
                    <div className="px-3 py-1.5 bg-slate-900 rounded-xl text-[10px] font-bold tracking-wider text-white">
                        PAGE 01 / 01
                    </div>
                    <button className="p-1.5 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}