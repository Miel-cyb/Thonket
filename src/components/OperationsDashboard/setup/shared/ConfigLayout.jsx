// =============================
// FILE: /setup/shared/ConfigLayout.jsx
// =============================
import React from 'react';

const ConfigLayout = ({ title, subtitle, sidebar, main, context, actions }) => (
    <div className="h-screen flex flex-col bg-gray-50">
        <div className="flex justify-between items-center p-4 bg-white border-b">
            <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
            <div>{actions}</div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            <div className="w-1/4 bg-white border-r overflow-y-auto">{sidebar}</div>
            <div className="w-2/4 p-6 overflow-y-auto">{main}</div>
            <div className="w-1/4 bg-gray-100 border-l p-4 overflow-y-auto">{context}</div>
        </div>
    </div>
);

export default ConfigLayout;