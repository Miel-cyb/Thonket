import React from 'react';
import {
    Calendar,
    Truck,
    Hash,
    Warehouse,
    Building2,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronDown,
    Check
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
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
                    dot: 'bg-emerald-500',
                    icon: CheckCircle2
                };
            case 'Discrepancy':
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
                    dot: 'bg-amber-500',
                    icon: AlertTriangle
                };
            case 'Inspection':
            case 'Reconciliation':
                return {
                    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
                    dot: 'bg-indigo-500',
                    icon: Clock
                };
            default: // Receiving / Default
                return {
                    bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
                    dot: 'bg-blue-500',
                    icon: Clock
                };
        }
    };

    const currentStatusStyle = getStatusStyle(po.status);
    const StatusIcon = currentStatusStyle.icon;
    const currentStepIndex = WORKFLOW_STAGES.indexOf(po.status);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 md:p-6 space-y-6">
            {/* --- TOP ROW: PO ID, Supplier & Workflow Controller --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                {/* PO Metadata Header */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                            {po.id || 'PO-UNKNOWN'}
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${currentStatusStyle.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${currentStatusStyle.dot} animate-pulse`} />
                            <StatusIcon className="w-3.5 h-3.5" />
                            {po.status || 'Pending'}
                        </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Supplier: <span className="font-semibold text-slate-800">{po.supplier || 'N/A'}</span>
                    </p>
                </div>

                {/* Workflow Phase Selection Switcher */}
                <div className="flex items-center gap-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl p-1.5 pl-3 shrink-0 shadow-xs">
                    <label htmlFor="workflow-phase" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                        Workflow Phase:
                    </label>
                    <div className="relative flex items-center">
                        <select
                            id="workflow-phase"
                            value={po.status || 'Receiving'}
                            onChange={(e) => onStatusChange?.(e.target.value)}
                            className="appearance-none bg-white border border-slate-300/80 text-slate-800 text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-xs hover:border-slate-400 transition"
                        >
                            {WORKFLOW_STAGES.map((stage, idx) => (
                                <option key={stage} value={stage}>
                                    {idx + 1}. {stage}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* --- VISUAL STEPPER / PROGRESS INDICATOR --- */}
            <div className="hidden sm:block pt-1">
                <div className="grid grid-cols-5 gap-3">
                    {WORKFLOW_STAGES.map((stage, index) => {
                        const isCurrent = po.status === stage;
                        const isPast = index < currentStepIndex;

                        return (
                            <div key={stage} className="flex flex-col gap-2 group">
                                <div className="relative flex items-center">
                                    <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100">
                                        <div
                                            className={`h-full transition-all duration-500 ease-out ${isCurrent
                                                ? 'bg-indigo-600'
                                                : isPast
                                                    ? 'bg-emerald-500'
                                                    : 'bg-slate-200/80'
                                                }`}
                                        />
                                    </div>
                                    {/* Indicator Node Badge */}
                                    <div
                                        className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold transition-all ${isCurrent
                                            ? 'bg-indigo-600 border-white text-white ring-2 ring-indigo-500/20'
                                            : isPast
                                                ? 'bg-emerald-500 border-white text-white'
                                                : 'bg-white border-slate-300 text-slate-400'
                                            }`}
                                    >
                                        {isPast ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : index + 1}
                                    </div>
                                </div>
                                <span
                                    className={`text-xs tracking-tight transition-colors ${isCurrent
                                        ? 'text-indigo-600 font-bold'
                                        : isPast
                                            ? 'text-slate-700 font-medium'
                                            : 'text-slate-400 font-medium'
                                        }`}
                                >
                                    {stage}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- LOGISTICS DETAILS GRID --- */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 font-medium block">Expected Delivery</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.expectedDate || 'N/A'}
                    </span>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 font-medium block">Carrier</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.carrier || 'Unassigned'}
                    </span>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 font-medium block">Tracking Number</span>
                    <span className="font-semibold font-mono text-slate-800 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {po.trackingNo || 'N/A'}
                    </span>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 space-y-1 hover:bg-slate-50 transition-colors">
                    <span className="text-slate-400 font-medium block">Assigned Bay</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                        <Warehouse className="w-3.5 h-3.5 text-indigo-500" />
                        {po.dockNumber || 'Bay 0'}
                    </span>
                </div>
            </div>
        </div>
    );
}