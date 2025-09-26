// components/KPISection.jsx
import React from "react";

const KPISection = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white shadow-lg rounded-lg p-5 mb-6 ${className}`}>
            <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

export default KPISection;
