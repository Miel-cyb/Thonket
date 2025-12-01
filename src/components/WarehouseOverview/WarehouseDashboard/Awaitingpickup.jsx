// components/dashboard/AwaitingPickup.jsx
import React from 'react';

const AwaitingPickup = ({ orders, drivers }) => {
  const awaitingPickupOrders = orders.filter(order => order.status === 'Packed');

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">📦 Awaiting Pickup</h2>
      <div className="space-y-3 overflow-y-auto max-h-60">
        {awaitingPickupOrders.length > 0 ? (
          awaitingPickupOrders.map((order) => {
            const driver = drivers.find(d => d.id === order.driver);
            return (
              <div
                key={order.orderId}
                className="flex flex-wrap items-center justify-between border-b last:border-0 pb-2"
              >
                <span className="text-sm font-medium">{order.orderId}</span>
                <span className="text-sm text-gray-600">{order.customerName}</span>
                <span className="text-sm text-gray-800 font-medium">
                  Assigned to: {driver ? driver.name : 'N/A'}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-600`}
                >
                  {order.status}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No orders awaiting pickup.</p>
        )}
      </div>
    </div>
  );
};

export default AwaitingPickup;
