'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function ViewOrders({ salesAgentID, onBack, onSelectOrder }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!salesAgentID) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/orders?salesAgentId=${salesAgentID}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError('Could not load orders. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [salesAgentID]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING_APPROVAL':
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h2>
      
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Total (GHS)</th>
                <th className="text-center py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.customer?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right">{order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => onSelectOrder(order._id)} 
                      className="text-purple-600 hover:underline font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
