'use client';

import { History, Download, CheckCircle2, Clock } from 'lucide-react';
import TaskHistoryItem from './TaskHistoryItem';

export default function TaskHistory({ tasksCompleted = [] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
            
            {/* HEADER: AUDIT TRAIL STYLE */}
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                        <History size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Archival Records
                        </h2>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                            Operational History
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* STATS CHIP */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            {tasksCompleted.length} Successful Deployments
                        </span>
                    </div>

                    {/* EXPORT ACTION */}
                    <button 
                        onClick={() => console.log('Exporting Log...')}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                        title="Download CSV Log"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* SCROLLABLE LOG LIST */}
            <div className="p-6">
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {tasksCompleted.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 opacity-30">
                            <Clock size={40} className="mb-3 text-slate-300" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Historical Data Found</p>
                            <p className="text-[9px] font-bold mt-1">Logs will populate upon task resolution.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tasksCompleted.map((task) => (
                                <TaskHistoryItem key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* SUB-FOOTER: SYSTEM TIMESTAMP */}
            <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <p className="text-[9px] font-mono text-slate-300 uppercase tracking-widest">
                    Last Log Sync: {new Date().toLocaleTimeString()} // ID: LOG_TXN_{Math.floor(Math.random() * 1000)}
                </p>
            </div>
        </div>
    );
}