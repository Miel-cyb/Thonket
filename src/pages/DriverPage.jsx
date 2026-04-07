'use client';

import React from 'react';
import { LayoutGrid, Map as MapIcon, ClipboardList, MessageSquare, History as HistoryIcon, Bell } from 'lucide-react';

import DriverQuickActions from '../components/fleet/drivers/DriverQuickActions';
import DriverTaskList from '../components/fleet/drivers/DriverTaskList';
import DriverAlerts from '../components/fleet/drivers/DriverAlerts';
import DriverMap from '../components/fleet/drivers/DriverMap';
import DriverChat from '../components/fleet/drivers/DriverChat';
import DriverHistory from '../components/fleet/drivers/DriverHistory';

export default function DriverDashboard({
    tasks = [],
    alerts = [],
    messages = [],
    vehicles = [],
    onCompleteTask,
    onReportIssue,
    onSendMessage
}) {
    // Logic: Filter only tasks assigned to THIS driver
    const driverTasks = tasks.filter(t => t.assignedToDriver);
    const activeTasks = driverTasks.filter(t => t.status !== 'completed');
    const completedTasks = driverTasks.filter(t => t.status === 'completed');

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">

            {/* 1. TOP TIER: STATUS & QUICK ACTIONS */}
            <header className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
                <div className="xl:col-span-4 space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        Driver Console <span className="text-indigo-600">.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Unit Status: Active // Signal Strength: Optimal
                    </p>
                </div>

                <div className="xl:col-span-8">
                    <DriverQuickActions />
                </div>
            </header>

            {/* 2. SHIFT SUMMARY STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Tasks', value: activeTasks.length, icon: <ClipboardList size={14} />, color: 'text-indigo-600' },
                    { label: 'Completed', value: completedTasks.length, icon: <LayoutGrid size={14} />, color: 'text-emerald-600' },
                    { label: 'Alerts', value: alerts.length, icon: <Bell size={14} />, color: 'text-amber-600' },
                    { label: 'Messages', value: messages.length, icon: <MessageSquare size={14} />, color: 'text-blue-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm flex items-center gap-4">
                        <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>{stat.icon}</div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{stat.label}</p>
                            <p className="text-lg font-black text-slate-900 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. PRIMARY OPERATIONAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: WORK & COMMS (5/12) */}
                <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">

                    {/* TASK LIST - The most interactive part */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <ClipboardList size={18} className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Current Assignment</h2>
                        </div>
                        <DriverTaskList
                            tasks={activeTasks}
                            onCompleteTask={onCompleteTask}
                            onReportIssue={onReportIssue}
                        />
                    </section>

                    {/* ALERTS & CHIP - Grouped together as "Support" */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                        <DriverAlerts alerts={alerts} />
                        <DriverChat messages={messages} onSendMessage={onSendMessage} />
                    </div>
                </div>

                {/* RIGHT: NAVIGATION (7/12) */}
                <div className="lg:col-span-7 order-1 lg:order-2">
                    <section className="sticky top-24 space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <MapIcon size={18} className="text-slate-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Route Navigation</h2>
                        </div>
                        <div className="h-[500px] lg:h-[700px] w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200 bg-slate-100">
                            <DriverMap tasks={activeTasks} vehicles={vehicles} />
                        </div>
                    </section>
                </div>

            </div>

            {/* 4. FOOTER: HISTORY SECTION */}
            <section className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 px-2 mb-6">
                    <HistoryIcon size={18} className="text-slate-400" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Recent Logs</h2>
                </div>
                <DriverHistory tasks={completedTasks} />
            </section>
        </div>
    );
}