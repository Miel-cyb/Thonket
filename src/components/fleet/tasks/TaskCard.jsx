'use client';

import {
    CheckCircle2,
    AlertCircle,
    Eye,
    MapPin,
    UserCircle,
    ChevronRight
} from 'lucide-react';

export default function TaskCard({ task, onComplete, onReportIssue, onViewDetails }) {

    const getStatusStyles = () => {
        switch (task.status) {
            case 'completed':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-200',
                    dot: 'bg-emerald-500'
                };
            case 'pending':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-200',
                    dot: 'bg-amber-500'
                };
            case 'delayed':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    border: 'border-red-200',
                    dot: 'bg-red-500'
                };
            default:
                return {
                    bg: 'bg-slate-50',
                    text: 'text-slate-600',
                    border: 'border-slate-200',
                    dot: 'bg-slate-400'
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

            {/* CARD HEADER: CUSTOMER & STATUS */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">
                        {task.customerName}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={12} className="shrink-0" />
                        <p className="text-[11px] font-bold truncate max-w-[180px]">
                            {task.address}
                        </p>
                    </div>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text}`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${task.status === 'pending' ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                        {task.status}
                    </span>
                </div>
            </div>

            {/* DRIVER ASSIGNMENT TAG */}
            {task.driverName && (
                <div className="flex items-center gap-2 mb-5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                    <UserCircle size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Operator: {task.driverName}
                    </span>
                </div>
            )}

            {/* ACTION FOOTER */}
            <div className="flex items-center gap-2 pt-2">
                {onComplete && task.status !== 'completed' && (
                    <button
                        onClick={() => onComplete(task.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-50"
                    >
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Resolve</span>
                    </button>
                )}

                {onReportIssue && (
                    <button
                        onClick={() => onReportIssue(task.id, `Incident: ${task.customerName}`)}
                        className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
                        title="Report Incident"
                    >
                        <AlertCircle size={18} />
                    </button>
                )}

                {onViewDetails && (
                    <button
                        onClick={() => onViewDetails(task.id)}
                        className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all active:scale-95 group/btn"
                    >
                        <Eye size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                        <ChevronRight size={14} className="opacity-40 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                )}
            </div>

            {/* DECORATIVE ELEMENT */}
            <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <CheckCircle2 size={60} strokeWidth={1} />
            </div>
        </div>
    );
}