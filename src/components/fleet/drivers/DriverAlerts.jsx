'use client';

import { ShieldAlert, Clock, ChevronRight, AlertCircle, Zap } from 'lucide-react';

export default function DriverAlerts({ alerts = [] }) {
    
    const getSeverityStyles = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
                return 'border-l-red-600 bg-red-50/30 text-red-700';
            case 'warning':
                return 'border-l-amber-500 bg-amber-50/30 text-amber-700';
            default:
                return 'border-l-slate-400 bg-slate-50 text-slate-700';
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
            
            {/* ALERT HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-900">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
                        <ShieldAlert size={18} className="text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Live Telemetry
                        </h2>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase">
                            Incident Log
                        </h3>
                    </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white">{alerts.length}</span>
                </div>
            </div>

            {/* ALERT FEED */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/30">
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <div 
                            key={alert.id} 
                            className={`
                                group relative flex items-start gap-4 p-4 rounded-2xl border-l-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] bg-white
                                ${getSeverityStyles(alert.severity)}
                            `}
                        >
                            <div className="mt-1">
                                {alert.severity === 'critical' ? (
                                    <Zap size={16} className="animate-pulse" />
                                ) : (
                                    <AlertCircle size={16} />
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
                                        System Message • {alert.code || 'ERR-00'}
                                    </p>
                                    <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Clock size={10} />
                                        <span className="text-[9px] font-bold">{alert.timestamp || 'Just Now'}</span>
                                    </div>
                                </div>
                                <p className="text-sm font-black tracking-tight leading-snug">
                                    {alert.message}
                                </p>
                            </div>

                            <button className="self-center p-1.5 rounded-lg hover:bg-black/5 transition-colors">
                                <ChevronRight size={16} className="opacity-30" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 py-12">
                        <ShieldAlert size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">All Systems Nominal</p>
                    </div>
                )}
            </div>

            {/* ACTION FOOTER */}
            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.98]">
                    Clear Protocol History
                </button>
            </div>
        </div>
    );
}