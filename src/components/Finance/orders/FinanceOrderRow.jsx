'use client';

import { AlertTriangle } from "lucide-react";

export default function FinanceOrderRow({ order, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex justify-between items-center p-4 rounded-2xl border hover:bg-slate-50 cursor-pointer"
        >
            <div>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-xs text-slate-400">
                    {order.totalAmount} • {order.paymentType}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {order.risk === "high" && (
                    <AlertTriangle className="text-red-500" size={16} />
                )}
                <span className="text-xs font-bold uppercase">
                    {order.stage}
                </span>
            </div>
        </div>
    );
}