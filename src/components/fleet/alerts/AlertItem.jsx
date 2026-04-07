'use client';

import { 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  X, 
  Clock 
} from 'lucide-react';

export default function AlertItem({ alert, onDismiss }) {

    // Dynamic configuration based on severity
    const getAlertConfig = () => {
        switch (alert.severity || alert.type) {
            case 'critical':
                return {
                    styles: 'bg-red-50 border-red-200 text-red-700',
                    icon: <AlertOctagon size={16} className="text-red-600" />,
                    badge: 'bg-red-600',
                    label: 'Critical'
                };
            case 'warning':
                return {
                    styles: 'bg-amber-50 border-amber-200 text-amber-700',
                    icon: <AlertTriangle size={16} className="text-amber-600" />,
                    badge: 'bg-amber-500',
                    label: 'Warning'
                };
            case 'info':
            default:
                return {
                    styles: 'bg-indigo-50 border-indigo-200 text-indigo-700',
                    icon: <Info size={16} className="text-indigo-600" />,
                    badge: 'bg-indigo-500',
                    label: 'System'
                };
        }
    };

    const config = getAlertConfig();

    return (
        <div className={`relative group border rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:shadow-md ${config.styles}`}>
            
            {/* LEFT: Severity Icon */}
            <div className="shrink-0 mt-0.5">
                {config.icon}
            </div>

            {/* MIDDLE: Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white ${config.badge}`}>
                        {config.label}
                    </span>
                    <div className="flex items-center gap-1 text-[9px] font-bold opacity-60 uppercase tracking-tighter">
                        <Clock size={10} />
                        {alert.timestamp || 'Just now'}
                    </div>
                </div>
                
                <p className="text-[12px] font-black leading-tight uppercase tracking-tight">
                    {alert.message}
                </p>
            </div>

            {/* RIGHT: Dismiss Action */}
            <button
                onClick={() => onDismiss?.(alert.id)}
                className="shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors self-start -mr-1"
                aria-label="Dismiss Alert"
            >
                <X size={14} className="opacity-50 group-hover:opacity-100" />
            </button>

            {/* DECORATIVE: Left-side accent bar */}
            <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full ${config.badge}`} />
        </div>
    );
}