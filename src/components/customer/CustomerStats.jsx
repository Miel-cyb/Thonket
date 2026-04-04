import { Users, Building2, UserCircle, CreditCard, TrendingUp } from "lucide-react";

export default function CustomersStats({ customers }) {
    const total = customers.length;
    const businesses = customers.filter(c => c.type === "business").length;
    const individuals = customers.filter(c => c.type === "individual").length;

    const totalCredit = customers
        .filter(c => c.type === "business")
        .reduce((sum, c) => sum + (c.creditUsed || 0), 0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Accounts"
                value={total}
                sub="Active base"
                icon={<Users size={18} />}
                color="indigo"
            />
            <StatCard
                title="Business Units"
                value={businesses}
                sub={`${Math.round((businesses / total) * 100 || 0)}% share`}
                icon={<Building2 size={18} />}
                color="blue"
            />
            <StatCard
                title="Private Clients"
                value={individuals}
                sub="Retail base"
                icon={<UserCircle size={18} />}
                color="emerald"
            />
            <StatCard
                title="Credit Exposure"
                value={`$${(totalCredit / 1000).toFixed(1)}k`}
                sub="Outstanding"
                icon={<CreditCard size={18} />}
                color="amber"
            />
        </div>
    );
}

function StatCard({ title, value, sub, icon, color }) {
    const theme = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
    };

    return (
        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${theme[color].split(' ').slice(1).join(' ')}`}>
                        <span className={theme[color].split(' ')[0]}>{icon}</span>
                    </div>
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