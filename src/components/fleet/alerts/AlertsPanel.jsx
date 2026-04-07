'use client';

import { BellRing, ShieldAlert, Trash2, Zap } from 'lucide-react';
import AlertItem from './AlertItem';

export default function AlertsPanel({ alerts = [], onDismissAlert, onClearAll }) {

    // Logic: Identify if there are any high-priority issues to trigger the panel's "Alert State"
    const hasCritical = alerts.some(a => a.severity === 'critical' || a.type === 'critical');

    return (
        <div className={`bg-white border rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col h-full transition-colors duration-500 ${hasCritical ? 'border-red-100' : 'border-slate-200'}`}>

            {/* TACTICAL HEADER */}
            <div className={`px-6 py-5 border-b flex justify-between items-center ${hasCritical ? 'bg-red-50/50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shadow-sm ${hasCritical ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'}`}>
                        {hasCritical ? <ShieldAlert size={18} /> : <BellRing size={18} />}
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Live Monitoring
                        </h2>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            System Alerts
                        </h3>
                    </div>
                </div>

                {/* COUNT & CLEAR ACTION */}
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                            {alerts.length} SIGNAL{alerts.length !== 1 ? 'S' : ''}
                        </span>
                    </div>
                    {alerts.length > 0 && (
                        <button
                            onClick={onClearAll}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Clear All Signals"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* ALERT FEED */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20 scrollbar-hide">
                {alerts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 opacity-30 text-center">
                        <div className="p-4 bg-slate-100 rounded-full mb-3 text-slate-400">
                            <Zap size={24} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">All Systems Nominal</p>
                        <p className="text-[9px] font-bold mt-1">No active interference detected.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <AlertItem
                                    alert={alert}
                                    onDismiss={onDismissAlert}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* STATUS FOOTER */}
            <div className="px-6 py-3 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${hasCritical ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        Telemetry: {hasCritical ? 'Attention Required' : 'Stable'}
                    </span>
                </div>
                <p className="text-[8px] font-mono text-slate-300">SENS_ID: AUTO_77</p>
            </div>
        </div>
    );
}