'use client';

export default function EscalationQueue({ orders, onSelect }) {
    return (
        <div className="bg-white rounded-3xl border p-4 space-y-2">
            {orders.map(o => (
                <div
                    key={o._id}
                    onClick={() => onSelect(o)}
                    className="p-3 border rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                    <p className="font-bold">{o.customerName}</p>
                    <p className="text-xs text-slate-500">
                        Escalated from Finance
                    </p>
                </div>
            ))}
        </div>
    );
}