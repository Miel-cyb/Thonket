'use client';
import { Eye, MessageCircle } from 'lucide-react';

export default function OrderCard({ order, onView, onFollowUp }) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{order.customer}</p>
                <p className="text-gray-500 text-sm">{order.amount}</p>
            </div>

            <div className="text-sm text-gray-500">{order.id}</div>

            <div className="flex justify-between items-center mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                    {order.status}
                </span>
                <div className="flex gap-2">
                    <button onClick={() => onView(order)} className="p-1 text-gray-400 hover:text-purple-600">
                        <Eye size={16} />
                    </button>
                    <button onClick={() => onFollowUp(order)} className="p-1 text-gray-400 hover:text-purple-600">
                        <MessageCircle size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}