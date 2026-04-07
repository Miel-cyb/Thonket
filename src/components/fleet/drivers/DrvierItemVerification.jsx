'use client';

import { useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function DriverItemVerification({ tasks = [], isVerified, onVerify }) {

    // 🔥 Calculate total items
    const totalItems = useMemo(() => {
        return tasks.reduce((sum, task) => {
            const taskTotal = (task.items || []).reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            return sum + taskTotal;
        }, 0);
    }, [tasks]);

    return (
        <div className="bg-white p-6 rounded-3xl space-y-6 border border-slate-100">

            <div className="flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Item Verification
                </h2>
                <span className="text-xs text-slate-400">
                    Total Items
                </span>
            </div>

            {/* TOTAL COUNT */}
            <div className="text-center">
                <p className="text-4xl font-black text-indigo-600">
                    {totalItems}
                </p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Items to Deliver
                </p>
            </div>

            {/* VERIFY BUTTON */}
            <button
                onClick={onVerify}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all ${isVerified
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
            >
                {isVerified ? (
                    <>
                        <CheckCircle2 size={18} />
                        Verified
                    </>
                ) : (
                    'Confirm Item Count'
                )}
            </button>

        </div>
    );
}