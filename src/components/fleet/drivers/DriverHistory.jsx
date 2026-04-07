'use client';

import { CheckCircle2, Calendar, MapPin, Hash, ArrowUpRight } from 'lucide-react';

export default function DriverHistory({ tasks = [] }) {

    // Sort tasks by completion (mock assumption: latest first)
    const sortedTasks = [...tasks].reverse();

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">

            {/* HEADER */}
            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            Archived Ops
                        </h2>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                            Mission History
                        </h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Resolved</p>
                    <p className="text-lg font-black text-slate-900">{tasks.length}</p>
                </div>
            </div>

            {/* TIMELINE FEED */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="relative border-l-2 border-slate-100 ml-3 pl-8 space-y-8">
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map((task, index) => (
                            <div key={task.id || index} className="relative group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500 shadow-sm group-hover:scale-125 transition-transform" />

                                <div className="bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 p-5 rounded-3xl transition-all duration-300 group-hover:shadow-xl group-hover:shadow-slate-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Hash size={12} className="text-slate-400" />
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                                    Task-Ref: {task.id || 'N/A'}
                                                </span>
                                            </div>
                                            <h4 className="text-md font-black text-slate-900 uppercase tracking-tight">
                                                {task.customerName}
                                            </h4>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg">
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Success</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white rounded-lg border border-slate-100 text-slate-400">
                                                <MapPin size={12} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 truncate uppercase">
                                                {task.location || 'Zone Delta'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-white rounded-lg border border-slate-100 text-slate-400">
                                                <Calendar size={12} />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase">
                                                {task.completedAt || '07 APR 26'}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="mt-4 flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        View manifest <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center opacity-20">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Historical Data</p>
                        </div>
                    )}
                </div>
            </div>

            {/* SUMMARY FOOTER */}
            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span>Performance Rating: 98%</span>
                    <span>Verified by Admin</span>
                </div>
            </div>
        </div>
    );
}