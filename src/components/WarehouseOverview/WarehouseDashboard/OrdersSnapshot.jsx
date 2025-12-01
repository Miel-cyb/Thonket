// src/components/WarehouseDashboard/OrdersSnapshot.jsx
import React from 'react';
import { ExternalLink } from "lucide-react";

const OrdersSnapshot = ({ orders, date, setActivePage }) => {

  const recentOrders = orders.slice(0, 5);

  const handleViewOrdersClick = () => {
    setActivePage('Orders');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📦 Orders Snapshot</h2>
        <button 
          className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center"
          onClick={handleViewOrdersClick}
        >
          View Orders <ExternalLink className="ml-1 h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3 overflow-y-auto max-h-60">
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div
              key={order.orderId}
              className="flex flex-wrap items-center justify-between border-b last:border-0 pb-2"
            >
              <span className="text-sm font-medium">{order.orderId}</span>
              <span className="text-sm text-gray-600">{order.customerName}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${{
                  Packed: "bg-blue-100 text-blue-600",
                  Pending: "bg-yellow-100 text-yellow-600",
                  Dispatched: "bg-green-100 text-green-600",
                }[order.status]}`}
              >
                {order.status}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No recent orders.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersSnapshot;
