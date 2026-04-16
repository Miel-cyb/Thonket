'use client';

import { X, Check, XCircle, Send } from "lucide-react";

export default function FinanceDecisionModal({
    order,
    onClose,
    onApprove,
    onReject,
    onForward
}) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

            <div className="bg-white w-[600px] rounded-3xl p-6 space-y-4">

                <div className="flex justify-between">
                    <h2 className="text-lg font-bold">Finance Review</h2>
                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <div>
                    <p className="font-bold">{order.customerName}</p>
                    <p className="text-sm text-slate-500">
                        Risk: {order.risk} | Credit: {order.creditScore}
                    </p>
                </div>

                <div className="flex gap-2 pt-4">
                    <button
                        onClick={() => onApprove(order)}
                        className="flex-1 bg-green-600 text-white p-2 rounded-xl"
                    >
                        <Check size={16} /> Approve
                    </button>

                    <button
                        onClick={() => onReject(order)}
                        className="flex-1 bg-red-600 text-white p-2 rounded-xl"
                    >
                        <XCircle size={16} /> Reject
                    </button>

                    <button
                        onClick={() => onForward(order)}
                        className="flex-1 bg-blue-600 text-white p-2 rounded-xl"
                    >
                        <Send size={16} /> Forward
                    </button>
                </div>

            </div>
        </div>
    );
}