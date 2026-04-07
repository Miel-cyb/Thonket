'use client';

import {
    Navigation,
    UserPlus,
    Info,
    Fuel,
    MapPin,
    Package,
    Clock,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';

export default function VehicleCard({ vehicle, onView, onAssignDriver }) {

    const getStatusConfig = () => {
        switch (vehicle.status) {
            case 'active':
                return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: 'In Transit', ghost: 'bg-emerald-50' };
            case 'idle':
                return { color: 'text-amber-600', bg: 'bg-amber-500', label: 'Idle / Ready', ghost: 'bg-amber-50' };
            case 'issue':
                return { color: 'text-red-600', bg: 'bg-red-500', label: 'Maintenance', ghost: 'bg-red-50' };
            default:
                return { color: 'text-slate-400', bg: 'bg-slate-400', label: 'Offline', ghost: 'bg-slate-50' };
        }
    };

    const status = getStatusConfig();

    return (
        <div className="group bg-white border border-slate-200 rounded-[2rem] p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">

            {/* HEADER: UNIT & STATUS */}
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            Unit_{vehicle.id?.toString().padStart(2, '0')}
                        </span>
                        <div className={`h-1.5 w-1.5 rounded-full ${status.bg} ${vehicle.status === 'active' ? 'animate-pulse' : ''}`} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                        {vehicle.name}
                    </h3>
                </div>
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${status.ghost} ${status.color} border border-current/10`}>
                    {status.label}
                </span>
            </div>

            {/* ROUTE & LOCATION TRACKING */}
            <div className="bg-slate-50 rounded-2xl p-3 mb-4 border border-slate-100">
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div className="w-0.5 h-6 bg-slate-200" />
                        <MapPin size={12} className="text-slate-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Current Route</p>
                        <p className="text-[11px] font-black text-slate-700 truncate uppercase">
                            {vehicle.currentLocation || 'Depot Center A'} → {vehicle.destination || 'Terminal 4'}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '65%' }} />
                            </div>
                            <span className="text-[9px] font-black text-indigo-600">65%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ASSIGNED ITEMS / MANIFEST (The "Multiple Things" for the day) */}
            <div className="mb-5 space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Package size={12} /> Daily Assignments
                    </p>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {vehicle.items?.length || 0} Tasks
                    </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {/* Showing a preview of items/tasks assigned for the day */}
                    {(vehicle.items || ['Morning Delivery', 'Warehouse Pickup', 'Express Drop']).map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <CheckCircle2 size={10} className={i === 0 ? "text-emerald-500" : "text-slate-300"} />
                            <span className="text-[10px] font-bold text-slate-600 tracking-tight">{item}</span>
                        </div>
                    ))}
                    <button className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* OPERATOR & FUEL ROW */}
            <div className="flex items-center justify-between gap-4 mb-5 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Navigation size={14} className="rotate-45" />
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">Operator</p>
                        <p className="text-[11px] font-black text-slate-700 uppercase">
                            {vehicle.driverName || 'Unassigned'}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                        <Fuel size={12} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-700">{vehicle.usage || 0}%</span>
                    </div>
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${vehicle.usage < 20 ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{ width: `${vehicle.usage || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
                <button
                    onClick={() => onView?.(vehicle.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
                >
                    <Info size={14} />
                    Inspect Asset
                </button>

                <button
                    onClick={() => onAssignDriver?.(vehicle.id)}
                    className="px-4 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-2xl hover:border-emerald-500 hover:text-emerald-600 transition-all active:scale-95 shadow-sm"
                >
                    <UserPlus size={16} />
                </button>
            </div>
        </div>
    );
}