'use client';

import FinanceOrderRow from "./FinanceOrderRow";

export default function FinanceOrderQueue({
    orders,
    onSelectOrder
}) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-2">
            {orders.map(order => (
                <FinanceOrderRow
                    key={order._id}
                    order={order}
                    onClick={() => onSelectOrder(order)}
                />
            ))}
        </div>
    );
}