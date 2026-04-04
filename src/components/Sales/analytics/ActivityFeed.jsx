'use client';
import { Clock } from 'lucide-react';

const activities = [
    { id: 1, message: 'Order ORD-101 created', time: '2 mins ago' },
    { id: 2, message: 'Order ORD-102 approved', time: '15 mins ago' },
    { id: 3, message: 'Customer John Doe added', time: '1 hour ago' },
    { id: 4, message: 'Order ORD-104 reported an issue', time: '3 hours ago' },
];

export default function ActivityFeed() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <ul className="space-y-2">
                {activities.map(act => (
                    <li key={act.id} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                        <Clock className="text-gray-400" size={20} />
                        <div>
                            <p className="text-gray-800">{act.message}</p>
                            <p className="text-gray-400 text-sm">{act.time}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}