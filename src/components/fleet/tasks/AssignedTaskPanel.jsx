'use client';

import { ClipboardList, LayoutList, Target, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';

export default function AssignedTasksPanel({
    tasks = [],
    onComplete,
    onReportIssue,
    onViewDetails,
    userRole,
    userName
}) {

    // Logic: Filter tasks based on the authenticated driver's name
    const visibleTasks = userRole === 'driver'
        ? tasks.filter(task => task.driverName === userName)
        : tasks;

    // Derived Stats for the Header
    const activeCount = visibleTasks.filter(t => t.status === 'in-progress').length;
    const pendingCount = visibleTasks.filter(t => t.status === 'pending').length;

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">

            {/* TACTICAL HEADER */}
            <div className="px-8 py-6 bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                                Assignment Protocol
                            </h2>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                {userRole === 'driver' ? 'My Daily Manifest' : 'Fleet Assignments'}
                            </h3>
                        </div>
                    </div>

                    {/* Badge Count */}
                    <div className="px-3 py-1 bg-slate-900 rounded-full">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {visibleTasks.length} NODES
                        </span>
                    </div>
                </div>

                {/* MINI STATUS BAR */}
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {activeCount} Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {pendingCount} Pending
                        </span>
                    </div>
                </div>
            </div>

            {/* SCROLLABLE TASK LIST */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 scrollbar-hide">
                {visibleTasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-30 italic">
                        <LayoutList size={48} className="mb-4 text-slate-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Manifest Empty</p>
                        <p className="text-[9px] font-bold mt-1">Awaiting Dispatch Instruction...</p>
                    </div>
                ) : (
                    visibleTasks.map(task => (
                        <div key={task.id} className="transition-all hover:-translate-y-1">
                            <TaskCard
                                task={task}
                                onComplete={onComplete}
                                onReportIssue={onReportIssue}
                                onViewDetails={onViewDetails}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* FOOTER ACTIONS / SUMMARY */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Target size={14} className="text-indigo-600" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {userName ? `Operator: ${userName}` : 'Global View'}
                    </p>
                </div>
                {visibleTasks.length > 0 && (
                    <p className="text-[9px] font-mono text-slate-300">UPLINK_STABLE // 200_OK</p>
                )}
            </div>
        </div>
    );
}