'use client';

import {
    ShoppingCart,
    Clock,
    Truck,
    AlertCircle,
} from 'lucide-react';

const kpis = [
    { id: 1, title: 'Total Orders', value: 128, icon: ShoppingCart, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
    { id: 2, title: 'Pending Approval', value: 14, icon: Clock, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 3, title: 'Delivered Orders', value: 102, icon: Truck, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { id: 4, title: 'Issues Reported', value: 5, icon: AlertCircle, iconBg: 'bg-red-50', iconColor: 'text-red-600' },
];

export default function KPISection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                    <div
                        key={kpi.id}
                        className="flex items-center gap-4.5 p-5 bg-white rounded-2xl border border-slate-200/70 shadow-[0_2px_8px_-3px_rgba(15,23,42,0.02)] min-w-0 w-full"
                    >
                        {/* Consistent Sized Icon Badge */}
                        <div className={`p-3 rounded-xl shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                            <Icon size={22} className="stroke-[2.25]" />
                        </div>

                        {/* Data Stack */}
                        <div className="min-w-0 flex-1">
                            <p className="font-bold uppercase text-[10px] tracking-wider text-slate-400 block truncate leading-tight">
                                {kpi.title}
                            </p>
                            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 block truncate leading-tight">
                                {kpi.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}