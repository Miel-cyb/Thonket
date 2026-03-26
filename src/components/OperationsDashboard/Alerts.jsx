import React, { useMemo } from 'react';
import {
    AlertTriangle,
    Package,
    MessageSquare,
    ChevronRight,
    Activity,
    History
} from 'lucide-react';

const Alerts = ({ products = [], reports = [] }) => {
    // Extract critical stock items (Stock < 10)
    const lowStock = useMemo(() => {
        return (products || [])
            .flatMap((p) => (p.sizes || []).map((s) => ({
                name: p.name,
                size: s.name,
                stock: s.stock ?? 0
            })))
            .filter((p) => p.stock < 10)
            .sort((a, b) => a.stock - b.stock)
            .slice(0, 5);
    }, [products]);

    return (
        <div className="flex flex-col gap-6">

            {/* SECTION 1: CRITICAL INVENTORY RISKS */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                            <Package size={14} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                            Inventory Risks
                        </h4>
                    </div>
                    {lowStock.length > 0 && (
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                </div>

                <div className="space-y-1.5">
                    {lowStock.length > 0 ? (
                        lowStock.map((item, i) => (
                            <div
                                key={i}
                                className="group flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`text-[10px] font-bold h-6 w-6 rounded flex items-center justify-center ${item.stock <= 2 ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {item.stock}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">Size: {item.size}</p>
                                    </div>
                                </div>
                                <ChevronRight size={12} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-[11px] text-gray-400 font-medium italic">Stock levels optimal</p>
                        </div>
                    )}
                </div>
            </section>

            {/* SECTION 2: SYSTEM KPI TRACKER */}
            <section className="bg-gray-900 rounded-2xl p-4 shadow-lg shadow-gray-200">
                <div className="flex items-center gap-2 mb-3">
                    <Activity size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live Efficiency</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">98.4%</span>
                    <span className="text-[10px] font-bold text-emerald-400">+2.1%</span>
                </div>
                <div className="mt-3 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98.4%]" />
                </div>
            </section>

            {/* SECTION 3: FIELD INTELLIGENCE FEED */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                            <MessageSquare size={14} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                            Field Intelligence
                        </h4>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                        <History size={10} /> History
                    </button>
                </div>

                <div className="relative space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                    {reports.length > 0 ? (
                        reports.slice(0, 3).map((report, i) => (
                            <div key={i} className="relative pl-6 group">
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-100" />

                                <div className="cursor-pointer group-hover:translate-x-1 transition-transform">
                                    <p className="text-[11px] font-bold text-gray-800 leading-tight">
                                        {report.title}
                                    </p>
                                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                                        {report.description}
                                    </p>
                                    <p className="text-[9px] text-gray-300 mt-1 font-bold tracking-tighter uppercase">
                                        {report.date ? new Date(report.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[11px] text-gray-400 italic pl-6 text-center">No reports filed today</p>
                    )}
                </div>
            </section>

            {/* ACTION FOOTER */}
            <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 transition-colors uppercase tracking-widest">
                Generate Full Audit
            </button>
        </div>
    );
};

export default Alerts;