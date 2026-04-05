'use client';

import React from "react";
import ActivityItem from "./ActivityItem";

export default function ActivityFeed({ activities = [] }) {
    return (
        <div className="w-full max-w-4xl animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="h-1 w-6 bg-slate-900 rounded-full" />
                        <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">
                            System Ledger
                        </h2>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-9">
                        Real-time Protocol Monitoring
                    </p>
                </div>
                <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Nodes: {activities.length} Active
                </div>
            </div>

            <div className="relative">
                {activities.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Void // No logs detected in current cycle
                        </p>
                    </div>
                ) : (
                    <div className="relative ml-4">
                        {/* The Connecting Timeline Line */}
                        <div className="absolute left-0 top-2 bottom-2 w-[1.5px] bg-slate-100 ml-[9px]" />

                        <ul className="space-y-0">
                            {activities.map((activity, index) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    isLast={index === activities.length - 1}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}