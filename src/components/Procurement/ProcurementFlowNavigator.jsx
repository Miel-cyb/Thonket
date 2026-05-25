import React from "react";
import {
    ClipboardList,
    Truck,
    Package,
    CheckCircle,
    ArrowRight,
} from "lucide-react";

// PROCUREMENT FLOW NAVIGATOR - PREMIUM STEP NAVIGATION BAR
export default function ProcurementFlowNavigator({
    activeStage,
    setActiveStage,
}) {
    const stages = [
        { id: "requests", label: "Requests", icon: ClipboardList, color: "slate" },
        { id: "approved", label: "Approved", icon: CheckCircle, color: "emerald" },
        { id: "transit", label: "In Transit", icon: Truck, color: "blue" },
        { id: "receiving", label: "Receiving", icon: Package, color: "amber" },
        { id: "completed", label: "Completed", icon: CheckCircle, color: "emerald" },
    ];

    const getActiveStyles = (color) => {
        const map = {
            slate: "bg-slate-900 text-white shadow-md",
            emerald: "bg-emerald-600 text-white shadow-md",
            blue: "bg-blue-600 text-white shadow-md",
            amber: "bg-amber-500 text-white shadow-md",
        };
        return map[color] || map.slate;
    };

    const getInactiveStyles = () =>
        "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300";

    return (
        <div className="w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">

            <div className="flex items-center gap-2 overflow-x-auto px-5 py-3">

                {/* FLOW START INDICATOR */}
                <div className="hidden md:flex items-center gap-2 pr-2 text-xs text-slate-400">
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                        Flow
                    </span>
                    <ArrowRight size={14} />
                </div>

                {stages.map((stage, index) => {
                    const isActive = activeStage === stage.id;

                    return (
                        <React.Fragment key={stage.id}>

                            <button
                                onClick={() => setActiveStage(stage.id)}
                                className={`
                                    group flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-semibold transition-all duration-200
                                    ${isActive ? getActiveStyles(stage.color) : getInactiveStyles()}
                                `}
                            >
                                <stage.icon
                                    size={14}
                                    className={isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}
                                />

                                <span>{stage.label}</span>

                                {/* ACTIVE DOT */}
                                {isActive && (
                                    <span className="ml-1 h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                                )}
                            </button>

                            {/* Connector Line */}
                            {index < stages.length - 1 && (
                                <div className="hidden md:block h-px w-6 bg-slate-200" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}