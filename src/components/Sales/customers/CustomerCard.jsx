'use client';
import { Users, Mail, ArrowUpRight, ShieldCheck, Building2, User } from 'lucide-react';

export default function CustomerCard({ customer, onViewOrders, onContact }) {
    const isWholesale = customer.type === 'Wholesale';

    return (
        <div className="group bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col gap-5 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
            {/* Classification Badge */}
            <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-[1.5rem] text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${isWholesale ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                {customer.type}
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mt-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isWholesale ? 'bg-slate-900 text-indigo-400' : 'bg-slate-50 text-slate-400'
                    }`}>
                    {isWholesale ? <Building2 size={24} /> : <User size={24} />}
                </div>
                <div className="min-w-0">
                    <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight truncate pr-16">
                        {customer.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-indigo-500">#{customer.id.toString().padStart(5, '0')}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{customer.region || 'Global'}</span>
                    </div>
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 bg-slate-50/30 -mx-6 px-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifetime Volume</span>
                    <span className="text-[15px] font-black text-slate-900">{customer.ordersCount} <span className="text-[10px] text-slate-400">SKUs</span></span>
                </div>
                <div className="flex flex-col gap-1 border-l border-slate-200 pl-4">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Credit</span>
                    <span className="text-[15px] font-black text-emerald-600">${customer.balance || '0.00'}</span>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 pt-1">
                <button
                    onClick={() => onViewOrders(customer)}
                    className="flex-[3] px-4 py-3.5 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] flex justify-center items-center gap-2 hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                >
                    Access Ledger <ArrowUpRight size={14} />
                </button>
                <button
                    onClick={() => onContact(customer)}
                    className="flex-1 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all flex justify-center items-center"
                >
                    <Mail size={18} />
                </button>
            </div>
        </div>
    );
}