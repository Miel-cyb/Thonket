'use client';

import {
    ShoppingCart,
    UserPlus,
    ClipboardList,
    AlertTriangle
} from "lucide-react";

export default function QuickActionBar({ onNavigate }) {
    const actions = [
        {
            title: "New Order",
            description: "Create order for customer",
            icon: ShoppingCart,
            color: "bg-purple-600",
            hover: "hover:bg-purple-700 hover:shadow-purple-600/20",
            focusRing: "focus-visible:ring-purple-500",
            onClick: () => onNavigate('ordering'),
        },
        {
            title: "Add Customer",
            description: "Register new customer",
            icon: UserPlus,
            color: "bg-blue-600",
            hover: "hover:bg-blue-700 hover:shadow-blue-600/20",
            focusRing: "focus-visible:ring-blue-500",
            onClick: () => onNavigate('accession'),
        },
        {
            title: "View Orders",
            description: "Check all orders",
            icon: ClipboardList,
            color: "bg-slate-800",
            hover: "hover:bg-slate-900 hover:shadow-slate-800/20",
            focusRing: "focus-visible:ring-slate-800",
            onClick: () => onNavigate(null), // Resets to Master Pipeline Matrix
        },
        {
            title: "Pending Issues",
            description: "Resolve problems",
            icon: AlertTriangle,
            color: "bg-red-600",
            hover: "hover:bg-red-700 hover:shadow-red-600/20",
            focusRing: "focus-visible:ring-red-500",
            onClick: () => onNavigate('issues'),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`group flex items-center gap-4 w-full rounded-2xl p-4.5 text-white shadow-sm transition-all duration-200 outline-none hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-left border border-transparent ${action.color} ${action.hover} focus-visible:ring-2 focus-visible:ring-offset-2 ${action.focusRing}`}
                    >
                        {/* Glossy Icon Container */}
                        <div className="bg-white/15 backdrop-blur-sm border border-white/10 p-3 rounded-xl shrink-0 shadow-inner transition-transform duration-200 group-hover:scale-105">
                            <Icon size={20} className="stroke-[2.25] text-white" />
                        </div>

                        {/* Typography Stack */}
                        <div className="min-w-0 flex-1">
                            <p className="font-bold uppercase text-[11px] tracking-wider text-white/95 leading-none">
                                {action.title}
                            </p>
                            <p className="text-[12px] text-white/80 font-medium tracking-tight truncate mt-1.5 leading-snug">
                                {action.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}