// features/salesAgent/components/alerts/AlertCard.jsx
import React from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

const typeConfig = {
    success: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    error: { color: "bg-red-100 text-red-700", icon: XCircle },
    info: { color: "bg-blue-100 text-blue-700", icon: Info },
    warning: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
};

export default function AlertCard({ type = "info", title, message, onDismiss }) {
    const config = typeConfig[type] || typeConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={clsx(
                "flex items-start justify-between gap-4 w-96 rounded-xl p-4 shadow-lg border-l-4",
                config.color
            )}
        >
            <div className="flex items-start gap-3">
                <Icon size={24} />
                <div className="flex flex-col">
                    <span className="font-semibold">{title}</span>
                    <span className="text-sm">{message}</span>
                </div>
            </div>
            <button onClick={onDismiss}>
                <X size={16} />
            </button>
        </div>
    );
}