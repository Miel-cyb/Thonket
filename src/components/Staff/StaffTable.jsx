import { Edit3, Shield, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export default function StaffTable({ staff, onEdit }) {
    // Helper to format the role-specific metric
    const renderMetric = (analytics) => {
        if (!analytics) return "N/A";
        
        const { current, target, unit, type } = analytics;
        const percentage = Math.min(Math.round((current / target) * 100), 100);

        return (
            <div className="flex flex-col gap-1.5 min-w-[140px]">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {analytics.label}
                    </span>
                    <span className="text-xs font-black text-slate-700">
                        {type === 'currency' ? `$${(current/1000).toFixed(1)}k` : current} 
                        <span className="text-slate-400 font-medium mx-0.5">/</span> 
                        {type === 'currency' ? `$${(target/1000).toFixed(1)}k` : `${target} ${unit}`}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/30">
                        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Member</th>
                        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Clearance & Role</th>
                        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Analytics</th>
                        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {staff.map((s) => (
                        <tr key={s.id} className="hover:bg-indigo-50/30 transition-all group">
                            {/* Member Profile */}
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm group-hover:scale-110 transition-transform">
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm leading-none">{s.name}</p>
                                        <p className="text-xs text-slate-400 mt-1.5 font-medium">{s.email}</p>
                                    </div>
                                </div>
                            </td>

                            {/* RBAC Details */}
                            <td className="px-8 py-5">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5">
                                        <Shield size={12} className={
                                            s.accessLevel === 'SuperUser' ? 'text-purple-500' : 'text-slate-400'
                                        } />
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${
                                            s.accessLevel === 'SuperUser' ? 'text-purple-600' : 'text-slate-500'
                                        }`}>
                                            {s.accessLevel}
                                        </span>
                                    </div>
                                    <span className="inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-bold">
                                        {s.role}
                                    </span>
                                </div>
                            </td>

                            {/* The Analytics Gap Fix */}
                            <td className="px-8 py-5">
                                {renderMetric(s.analytics)}
                            </td>

                            {/* Status & Last Activity */}
                            <td className="px-8 py-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`h-1.5 w-1.5 rounded-full ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                        <span className="text-xs font-bold text-slate-700">{s.status}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Last: {new Date(s.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </td>

                            {/* Action Button */}
                            <td className="px-8 py-5 text-right">
                                <button 
                                    onClick={() => onEdit(s)}
                                    className="inline-flex items-center justify-center h-9 w-9 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm rounded-xl transition-all"
                                >
                                    <Edit3 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}