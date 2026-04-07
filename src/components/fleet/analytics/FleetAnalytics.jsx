'use client';

import { BarChart3, PieChart, Activity, Zap, Target, TrendingUp } from 'lucide-react';
import TaskCompletionChart from './TaskCompletionChart';
import VehicleUsageChart from './VehicleUsageChart';

export default function FleetAnalytics({ tasks = [], vehicles = [] }) {
    // Compute logical stats
    const totalTasks = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status !== 'completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    const taskData = [
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
    ];

    const vehicleData = vehicles.map(v => ({
        name: v.name,
        usage: v.usage || 0,
    }));

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">

            {/* ANALYTICS HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl shadow-lg shadow-slate-200">
                        <Activity size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Operational Intelligence
                        </h2>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            Fleet Analytics
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Live Feed</span>
                </div>
            </div>

            <div className="p-8 space-y-8">

                {/* KPI TOP BAR */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard
                        label="Task Velocity"
                        value={`${completionRate}%`}
                        icon={<Target size={16} />}
                        trend="+12% vs LY"
                        color="text-indigo-600"
                        bg="bg-indigo-50"
                    />
                    <KPICard
                        label="Utilization"
                        value={`${vehicles.length} Units`}
                        icon={<Zap size={16} />}
                        trend="Active Now"
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />
                    <KPICard
                        label="Efficiency"
                        value="Optimal"
                        icon={<TrendingUp size={16} />}
                        trend="Normal Params"
                        color="text-emerald-600"
                        bg="bg-emerald-50"
                    />
                </div>

                {/* VISUALIZATION GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Task Completion Section */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 hover:bg-white transition-all duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <PieChart size={16} className="text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Status Distribution</span>
                        </div>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <TaskCompletionChart data={taskData} />
                        </div>
                    </div>

                    {/* Vehicle Usage Section */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 hover:bg-white transition-all duration-500">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 size={16} className="text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unit Duty Cycles</span>
                        </div>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <VehicleUsageChart data={vehicleData} />
                        </div>
                    </div>

                </div>
            </div>

            {/* SYSTEM FOOTER */}
            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Last Index Update: {new Date().toLocaleTimeString()}
                </p>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                    Download PDF Manifest
                </button>
            </div>
        </div>
    );
}

function KPICard({ label, value, icon, trend, color, bg }) {
    return (
        <div className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-[8px] font-black uppercase tracking-tighter ${color}`}>{trend}</p>
            </div>
        </div>
    );
}