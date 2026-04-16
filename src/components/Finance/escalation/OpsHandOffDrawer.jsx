'use client';

export default function OpsHandoffDrawer({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="fixed right-0 top-0 w-[400px] h-full bg-white shadow-xl p-6">
            <h2 className="font-bold">Ops Review</h2>

            <p className="mt-4 text-sm">
                Finance Escalation Reason:
            </p>

            <p className="text-slate-600 text-sm">
                {order.escalationReason}
            </p>

            <button
                onClick={onClose}
                className="mt-6 bg-black text-white p-2 rounded-xl"
            >
                Close
            </button>
        </div>
    );
}