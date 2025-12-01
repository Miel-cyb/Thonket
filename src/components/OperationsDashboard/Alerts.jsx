// components/Alerts.jsx
import React from "react";
import KPISection from "@/components/Analytics/KPISection";

const criticalIssues = [
    "Stock-out: Oil & Fat in Suame Warehouse",
    "Delayed delivery: Asokwa route",
    "High fuel cost: ₵17,000/week",
    "Customer churn rising: 6% last month",
];

const Alerts = () => {
    return (
        <KPISection title="Alerts / Exceptions">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-red-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Low Stock Alerts</h3>
                    <p className="text-xl font-bold">3</p>
                </div>

                <div className="bg-red-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">Late Delivery Alerts</h3>
                    <p className="text-xl font-bold">5</p>
                </div>

                <div className="bg-red-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">High Fuel Cost</h3>
                    <p className="text-xl font-bold">₵17,000/week</p>
                </div>

                <div className="bg-red-50 p-4 rounded shadow">
                    <h3 className="text-sm font-semibold mb-2">High Churn</h3>
                    <p className="text-xl font-bold">6%</p>
                </div>
            </div>

            {/* Critical Issues List */}
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-sm font-semibold mb-2">Critical Issues</h3>
                <ul className="list-disc list-inside space-y-2">
                    {criticalIssues.map((issue, index) => (
                        <li key={index} className="text-red-600 font-medium">{issue}</li>
                    ))}
                </ul>
            </div>
        </KPISection>
    );
};

export default Alerts;
