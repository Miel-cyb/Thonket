// src/components/OrderManagement/OrderList.jsx
import React, { useState, useEffect } from 'react';

const OrderList = ({ orders, drivers, onUpdateStatus, onAssignDriver, onSaveDriver }) => {
  const [selectedDrivers, setSelectedDrivers] = useState({});
  const [editingDriver, setEditingDriver] = useState(null);

  useEffect(() => {
    const initialSelections = {};
    orders.forEach(order => {
      if (order.driver != null) {
        initialSelections[order.orderId] = order.driver;
      }
    });
    setSelectedDrivers(initialSelections);
  }, [orders]);

  const handleDriverSelection = (orderId, driverId) => {
    setSelectedDrivers(prev => ({ ...prev, [orderId]: driverId }));
  };

  const handleSaveDriver = (orderId) => {
    const driverId = selectedDrivers[orderId];
    if (driverId != null) {
      onSaveDriver(orderId, driverId);
    }
    setEditingDriver(null);
  };

  const handleConfirmOrder = (orderId) => {
    const driverId = selectedDrivers[orderId];
    if (driverId != null) {
      onAssignDriver(orderId, driverId);
    }
  };

  const startEditing = (order) => {
    setEditingDriver(order.orderId);
    setSelectedDrivers(prev => ({ ...prev, [order.orderId]: order.driver }));
  }

  const getAction = (order) => {
    const assignedDriver = drivers.find((d) => d.id == order.driver);

    if (editingDriver === order.orderId) {
      return (
        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => handleDriverSelection(order.orderId, e.target.value)}
            value={selectedDrivers[order.orderId] || ''}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="" disabled>
              Select a Driver
            </option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleSaveDriver(order.orderId)}
            disabled={selectedDrivers[order.orderId] == null}
            className="bg-green-500 text-white px-3 py-1 rounded-md disabled:bg-gray-400"
          >
            Save
          </button>
          <button onClick={() => setEditingDriver(null)} className="text-sm text-red-500 hover:underline">
            Cancel
          </button>
        </div>
      );
    }

    switch (order.status) {
      case 'Pending':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <select
              onChange={(e) => handleDriverSelection(order.orderId, e.target.value)}
              value={selectedDrivers[order.orderId] ?? ''}
              className="border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="" disabled>
                Assign Driver
              </option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleConfirmOrder(order.orderId)}
              disabled={selectedDrivers[order.orderId] == null}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
            >
              Confirm
            </button>
          </div>
        );
      case 'Approved':
        return (
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={() => onUpdateStatus(order.orderId, 'Packed')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark Ready for Dispatch
            </button>
            <div className="text-sm text-gray-600">
              Assigned to: {assignedDriver ? assignedDriver.name : 'N/A'}
              <button onClick={() => startEditing(order)} className="text-blue-500 hover:underline ml-2">
                (Change)
              </button>
            </div>
          </div>
        );
      case 'Packed':
        return (
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`pickup-${order.orderId}`}
                  onChange={() => onUpdateStatus(order.orderId, 'Dispatched')}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor={`pickup-${order.orderId}`} className="ml-2 text-sm text-gray-700">
                  Awaiting Pickup
                </label>
              </div>
              <div className="text-sm text-gray-600">
                Assigned to: {assignedDriver ? assignedDriver.name : 'N/A'}
                <button onClick={() => startEditing(order)} className="text-blue-500 hover:underline ml-2">
                  (Change)
                </button>
              </div>
            </div>
        );
      case 'Dispatched':
        return <p className="text-sm text-green-600 font-semibold">✓ Completed</p>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Manage Orders</h2>
      <div className="overflow-y-auto h-96">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className={`p-4 mb-4 rounded-lg border flex flex-wrap justify-between items-center gap-4 ${
              order.status === 'Dispatched' ? 'bg-gray-100 opacity-60' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <p className="font-bold">{order.orderId}</p>
              <p className="text-sm text-gray-500">{order.customerName}</p>
            </div>
            <div className="text-center flex-shrink-0">
              <p className="font-bold">{order.items.length}</p>
              <p className="text-sm text-gray-500">Items</p>
            </div>
            <div className="text-center flex-shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${{
                  Pending: 'bg-yellow-200 text-yellow-800',
                  Approved: 'bg-blue-200 text-blue-800',
                  Packed: 'bg-green-200 text-green-800',
                  Dispatched: 'bg-gray-200 text-gray-800',
                }[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex-grow flex justify-end">
              {getAction(order)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;