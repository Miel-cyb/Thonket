import React from "react";

/**
 * ZoneBreakdown
 * Granular visual metric index illustrating micro-allocation pools.
 * Dynamically scales accent highlights based on inventory floor constraints.
 */
const ZoneBreakdown = ({ zones = [] }) => {
    return (
        <div className="w-full select-none">

            {/* SUBSECTION COMPONENT LABEL */}
            <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">
                Zone Allocation
            </h4>

            {/* EMPTY ARRAY FALLBACK DATA HANDLER */}
            {zones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <svg className="w-5 h-5 text-slate-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-400">No zone matrix available</span>
                </div>
            ) : (
                <div className="flex flex-col gap-3.5">
                    {zones.map((zone, index) => {
                        // Structural safety fallback variables
                        const zoneCapacity = zone.capacity <= 0 ? 100 : zone.capacity;
                        const percent = Math.min((zone.used / zoneCapacity) * 100, 100);

                        // Micro-track responsive highlighting conditions
                        const getBarColor = (p) => {
                            if (p < 60) return "bg-blue-500";
                            if (p < 85) return "bg-amber-500";
                            return "bg-rose-500";
                        };

                        return (
                            <div key={index} className="w-full group">

                                {/* METRIC METADATA RUNWAY */}
                                <div className="flex items-end justify-between mb-1">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                                            {zone.name}
                                        </span>
                                        <span className="font-mono text-[10px] font-semibold text-slate-400">
                                            ({zone.used.toLocaleString()}/{zoneCapacity.toLocaleString()})
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs font-extrabold text-slate-600">
                                        {percent.toFixed(1)}%
                                    </span>
                                </div>

                                {/* MICRO COMPACT CAPACITY BAR TRACK */}
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
                                    <div
                                        className={`h-full ${getBarColor(percent)} transition-all duration-300 ease-out rounded-full`}
                                        style={{ width: `${percent}%` }}
                                        role="progressbar"
                                        aria-valuenow={percent}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    />
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default ZoneBreakdown;