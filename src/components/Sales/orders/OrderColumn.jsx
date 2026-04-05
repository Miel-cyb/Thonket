'use client';
import OrderCard from './OrderCard';

export default function OrderColumn({ title, orders, statusColor, onView, onFollowUp }) {
    return (
        <div className="flex-1 flex flex-col gap-6 min-w-[340px]">
            {/* 1. COLUMN HEADER - REFINED SPACING */}
            <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-3.5">
                    {/* Dynamic status indicator dot with glow */}
                    <div className={`w-3 h-3 rounded-full ${statusColor} shadow-[0_0_12px_rgba(0,0,0,0.1)]`}
                        style={{ boxShadow: `0 0 15px ${statusColor.replace('bg-', '')}` }}
                    />
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.18em]">
                        {title}
                    </h3>
                </div>

                {/* Protocol Count Badge - Increased Font */}
                <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-3 py-1.5 rounded-xl border border-slate-200 uppercase tracking-widest leading-none">
                    {orders.length} Units
                </span>
            </div>

            {/* 2. CARD CONTAINER - UNPACKED SPACING */}
            <div className="flex flex-col gap-5 max-h-[calc(100vh-350px)] overflow-y-auto no-scrollbar pb-10 px-1">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <OrderCard
                                order={{ ...order, statusColor }}
                                onView={onView}
                                onFollowUp={onFollowUp}
                            />
                        </div>
                    ))
                ) : (
                    /* Null State for Column - Scaled for bigger text */
                    <div className="border-2 border-dashed border-slate-100 rounded-[2.5rem] py-16 flex flex-col items-center justify-center opacity-50 bg-slate-50/30">
                        <div className="w-12 h-12 rounded-full bg-slate-100 mb-4 border border-slate-200/50" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                            No Active Logs
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}