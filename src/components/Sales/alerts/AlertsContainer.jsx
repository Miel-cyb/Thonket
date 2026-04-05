// features/salesAgent/components/alerts/AlertsContainer.jsx
import React from "react";
import AlertCard from "./AlertCard";

export default function AlertsContainer({ alerts, onDismiss }) {
    return (
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-4">
            {alerts.map((alert) => (
                <AlertCard
                    key={alert.id}
                    type={alert.type}
                    title={alert.title}
                    message={alert.message}
                    onDismiss={() => onDismiss(alert.id)}
                />
            ))}
        </div>
    );
}