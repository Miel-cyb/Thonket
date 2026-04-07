'use client';

import { ListTodo, Activity, CheckCircle, Search, Filter } from 'lucide-react';
import DriverTaskCard from './DriverTaskCard';

export default function DriverTaskList({ tasks = [], onCompleteTask, onReportIssue }) {

    // Logic for the Progress Monitor
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full max-h-[800px]">

            {/* TASK LIST HEADER & PROGRESS MONITOR */}
            <div className="px-8 pt-8 pb-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                            <ListTodo size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                                Operational Queue
                            </h2>
                            <h3 className="text-xl font-black tracking-tight uppercase">
                                Assignment Manifest
                            </h3>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                {i}
                            </div>
                        ))}
                    </div>
                </div>

                {/* VISUAL PROGRESS TRACKER */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Shift Completion</p>
                        <p className="text-sm font-black italic">{progressPercent}%</p>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER BAR (Sub-header) */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex gap-3">
                <div className="relative flex-1 group">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH TASKS..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none"
                    />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            {/* SCROLLABLE TASK AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-slate-50/20">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <DriverTaskCard
                            key={task.id}
                            task={task}
                            onComplete={onCompleteTask}
                            onReportIssue={onReportIssue}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-25">
                        <Activity size={48} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Active Assignments</p>
                    </div>
                )}
            </div>

            {/* FOOTER STATS */}
            <div className="px-8 py-4 bg-white border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        {completed}/{total} Tasks Resolved
                    </span>
                </div>
                <span className="text-[9px] font-mono text-slate-300 uppercase">Sync_Active: {new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    );
}