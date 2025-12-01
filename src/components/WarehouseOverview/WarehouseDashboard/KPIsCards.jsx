// src/components/WarehouseDashboard/KPIsCards.jsx
import React from 'react';
import { Eye, Truck, Package, CheckCircle } from 'lucide-react';

const KPIsCards = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const packedOrders = orders.filter(o => ['Packed', 'Dispatched'].includes(o.status)).length;
  const dispatchedOrders = orders.filter(o => o.status === 'Dispatched').length;

  const kpis = [
    { title: "Total Orders", value: totalOrders, icon: <Eye /> },
    { title: "Pending Orders", value: pendingOrders, icon: <Truck /> },
    { title: "Packed Orders", value: packedOrders, icon: <Package /> },
    { title: "Dispatched Orders", value: dispatchedOrders, icon: <CheckCircle /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            {React.cloneElement(kpi.icon, { className: "text-purple-600" })}
          </div>
          <div>
            <p className="text-gray-500 text-sm">{kpi.title}</p>
            <p className="text-2xl font-bold">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIsCards;
