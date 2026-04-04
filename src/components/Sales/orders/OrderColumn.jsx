'use client';
import OrderCard from './OrderCard';

export default function OrderColumn({ title, orders, statusColor, onView, onFollowUp }) {
    return (
        <div className="flex-1 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex flex-col gap-3">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={{ ...order, statusColor }}
                        onView={onView}
                        onFollowUp={onFollowUp}
                    />
                ))}
            </div>
        </div>
    );
}