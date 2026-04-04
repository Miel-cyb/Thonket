'use client';
import {
    ShoppingCart,
    Clock,
    Truck,
    AlertCircle,
} from 'lucide-react';

const kpis = [
    { id: 1, title: 'Total Orders', value: 128, icon: ShoppingCart, color: 'bg-purple-100 text-purple-700' },
    { id: 2, title: 'Pending Approval', value: 14, icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
    { id: 3, title: 'Delivered Orders', value: 102, icon: Truck, color: 'bg-green-100 text-green-700' },
    { id: 4, title: 'Issues Reported', value: 5, icon: AlertCircle, color: 'bg-red-100 text-red-700' },
];

export default function KPISection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {kpis.map(kpi => (
                <div key={kpi.id} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                    <div className={`p-4 rounded-lg ${kpi.color}`}>
                        <kpi.icon size={28} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{kpi.value}</p>
                        <p className="text-gray-500">{kpi.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}