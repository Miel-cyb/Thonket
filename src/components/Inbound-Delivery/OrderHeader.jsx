import React from 'react';
import {
    Calendar,
    Truck,
    Hash,
    Warehouse,
    Building2,
    CheckCircle2,
    Clock,
    AlertTriangle
} from 'lucide-react';

export default function OrderHeader({ activePO, onStatusChange }) {
    // Fallback safe object
    const po = activePO || {};

    // Available workflow stages
    const WORKFLOW_STAGES = [
        'Receiving',
        'Inspection',
        'Discrepancy',
        'Reconciliation',
        'Completed'
    ];

    // Status Badge & Color Theme Mapping
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed':
                return {
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    dot: 'bg-emerald-500',
                    icon: CheckCircle2
                };
            case 'Discrepancy':
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-200',
                    dot: 'bg-amber-500',
                    icon: AlertTriangle
                };
            case 'Inspection':
            case 'Reconciliation':
                return {
                    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                    dot: 'bg-indigo-500',
                    icon: Clock
                };
            default: // Receiving / Default
                return {
                    bg: 'bg-blue-50 text-blue-700 border-blue-200',
                    dot: 'bg-blue-500',
                    icon: Clock
                };
        }
    };

    const currentStatusStyle = getStatusStyle(po.status);
    const StatusIcon = currentStatusStyle.icon;
    const currentStepIndex = WORKFLOW_STAGES.indexOf(po.status);

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-6">
            {/* --- TOP ROW: PO ID, Supplier & Workflow Controller --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                {/* PO Metadata Header */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {po.id || 'PO-UNKNOWN'}
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${currentStatusStyle.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${currentStatusStyle.dot} animate-pulse`} />
                            <StatusIcon className="w-3.5 h-3.5" />
                            {po.status || 'Pending'}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Supplier: <span className="font-semibold text-slate-700">{po.supplier || 'N/A'}</span>
                    </p>
                </div>

                {/* Workflow Phase Selection Switcher */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2 shrink-0">
                    <label htmlFor="workflow-phase" className="text-xs font-semibold text-slate-600 pl-1">
                        Workflow Phase:
                    </label>
                    <select
                        id="workflow-phase"
                        value={po.status || 'Receiving'}
                        onChange={(e) => onStatusChange?.(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-slate-400 transition"
                    >
                        {WORKFLOW_STAGES.map((stage, idx) => (
                            <option key={stage} value={stage}>
                                {idx + 1}. {stage}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* --- VISUAL STEPPER / PROGRESS INDICATOR --- */}
            <div className="hidden sm:block">
                <div className="grid grid-cols-5 gap-2">
                    {WORKFLOW_STAGES.map((stage, index) => {
                        const isCurrent = po.status === stage;
                        const isPast = index < currentStepIndex;

                        return (
                            <div key={stage} className="flex flex-col gap-1.5">
                                <div className="h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
                                    <div
                                        className={`h-full transition-all duration-300 ${isCurrent
                                                ? 'bg-indigo-600'
                                                : isPast
                                                    ? 'bg-slate-400'
                                                    : 'bg-slate-200'
                                            }`}
                                    />
                                </div>
                                <span
                                    className={`text-[11px] font-medium tracking-tight ${isCurrent
                                            ? 'text-indigo-600 font-bold'
                                            : isPast
                                                ? 'text-slate-600'
                                                : 'text-slate-400'
                                        }`}
                                >
                                    {index + 1}. {stage}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- LOGISTICS DETAILS GRID --- */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 space-y-1">
                    <span className="text-slate-400 font-medium block">Expected Delivery</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.expectedDate || 'N/A'}
                    </span>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 space-y-1">
                    <span className="text-slate-400 font-medium block">Carrier</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.carrier || 'Unassigned'}
                    </span>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 space-y-1">
                    <span className="text-slate-400 font-medium block">Tracking Number</span>
                    <span className="font-semibold font-mono text-slate-800 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.trackingNo || 'N/A'}
                    </span>
                </div>

                <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-2.5 space-y-1">
                    <span className="text-slate-400 font-medium block">Assigned Bay</span>
                    <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        <Warehouse className="w-3 h-3 text-indigo-500" />
                        {po.dockNumber || 'Bay 0'}
                    </span>
                </div>
            </div>
        </div>
    );
}