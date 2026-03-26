// =============================
// FILE: /setup/shared/UsagePanel.jsx
// =============================
import React from 'react';

const UsagePanel = ({ data }) => (
    <div>
        <h3 className="font-semibold mb-3">Impact</h3>
        <p className="text-sm">Orders: {data.orders}</p>
        <p className="text-sm">Revenue: ₵{data.revenue}</p>
        <p className="text-sm">Warehouses: {data.warehouses}</p>
    </div>
);

export default UsagePanel;
