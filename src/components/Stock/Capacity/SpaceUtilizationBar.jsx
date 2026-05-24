import React from "react";

/**
 * SpaceUtilizationBar
 * Real-time hardware/facility capacity meter widget.
 * Dynamically shifts semantic tones based on structural fill limits.
 */
const SpaceUtilizationBar = ({ used = 0, total = 100 }) => {
    // Safety check to prevent dividing by zero or producing infinite ratios
    const validTotal = total <= 0 ? 100 : total;
    const percentage = Math.min((used / validTotal) * 100, 100);

    // Color theme evaluator map layer for threshold warnings
    const getStatusTheme = () => {
        if (percentage < 60) {
            return {
                bg: "bg-emerald-500",
                text: "text-emerald-700",
                track: "bg-emerald-50",
            };
        }
        if (percentage < 85) {
            return {
                bg: "bg-amber-500",
                text: "text-amber-700",
                track: "bg-amber-50",
            };
        }
        return {
            bg: "bg-rose-500",
            text: "text-rose-700",
            track: "bg-rose-50",
        };
    };

    const theme = getStatusTheme();

    return (
        <div className="w-full bg-white p-3 rounded-lg border border-gray-200 shadow-sm select-none">

            {/* TOP INFOBAR HEADER DISPLAY */}
            <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                    Space Utilization
                </span>
                <span className={`font-mono font-extrabold ${theme.text}`}>
                    {percentage.toFixed(1)}%
                </span>
            </div>

            {/* FLUID METRIC TRACKWAY PROGRESS BAR */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/30">
                <div
                    className={`h-full ${theme.bg} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                />
            </div>

            {/* BOTTOM METADATA RECONCILIATION SUMMARY */}
            <div className="flex items-center justify-between mt-1.5 text-[11px] font-medium text-gray-400">
                <span>Capacity Threshold</span>
                <span className="font-mono text-gray-600 font-bold">
                    {used.toLocaleString()} <span className="font-normal text-gray-400">/</span> {validTotal.toLocaleString()} units
                </span>
            </div>

        </div>
    );
};

export default SpaceUtilizationBar;