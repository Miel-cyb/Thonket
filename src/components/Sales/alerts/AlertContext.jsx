// features/salesAgent/components/alerts/AlertsContext.jsx
import React, { createContext, useContext, useState } from "react";
import AlertsContainer from "./AlertsContainer";

const AlertsContext = createContext();

export const AlertsProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const addAlert = ({ type, title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();
        const newAlert = { id, type, title, message, duration };
        setAlerts((prev) => [...prev, newAlert]);

        // Auto-remove after duration
        setTimeout(() => removeAlert(id), duration);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <AlertsContext.Provider value={{ addAlert, removeAlert }}>
            {children}
            <AlertsContainer alerts={alerts} onDismiss={removeAlert} />
        </AlertsContext.Provider>
    );
};

export const useAlerts = () => {
    const context = useContext(AlertsContext);
    if (!context) {
        throw new Error("useAlerts must be used within AlertsProvider");
    }
    return context;
};