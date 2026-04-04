import { Users, ShieldCheck, Activity, TrendingUp } from "lucide-react";

export default function StaffStats({ staff }) {
    const total = staff.length;
    const active = staff.filter(s => s.status === "Active").length;
    
    const totalCurrent = staff.reduce((sum, s) => sum + (s.analytics?.current || 0), 0);
    const totalTarget = staff.reduce((sum, s) => sum + (s.analytics?.target || 1), 0);
    const completionRate = Math.round((totalCurrent / totalTarget) * 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
                title="Total Personnel"
                value={total}
                sub="On payroll"
                icon={<Users size={18} />}
                color="indigo"
            />
            <StatCard
                title="Current Availability"
                value={active}
                sub={`${total - active} offline`}
                icon={<ShieldCheck size={18} />}
                color="emerald"
            />
            <StatCard
                title="Team Throughput"
                value={`${completionRate}%`}
                sub="Daily avg"
                icon={<Activity size={18} />}
                color="blue"
            />
        </div>
    );
}

function StatCard({ title, value, sub, icon, color }) {
    const theme = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
    };

    return (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    {/* Compact Icon Container */}
                    <div className={`p-2.5 rounded-xl ${theme[color].split(' ').slice(1).join(' ')}`}>
                        <span className={theme[color].split(' ')[0]}>{icon}</span>
                    </div>
                    {/* Slim Live Indicator */}
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">
                        <TrendingUp size={10} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Live</span>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {value}
                        </h2>
                        <span className="text-[11px] font-bold text-slate-400">
                            {sub}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}