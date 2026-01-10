import React, { useState, useEffect } from 'react';
import OrderApproval from '@/components/OperationsDashboard/OrderApproval';
import DriverTracking from '@/components/OperationsDashboard/DriverTracking';
import Alerts from '@/components/OperationsDashboard/Alerts';
import AnalyticsDashboard from '@/components/OperationsDashboard/Analytics';
import { calculatePriority } from '@/utils/calc';

const OperationsPage = ({ products, reports }) => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('approval');

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      let data = await response.json();

      data = data.map(order => calculatePriority(order));

      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApproveOrder = async (orderId) => {
    const orderToApprove = orders.find((order) => order.orderId === orderId);
    if (!orderToApprove) return;

    try {
      setOrders(orders.filter(o => o.orderId !== orderId));

      await fetch('/api/warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderToApprove),
      });

      await fetch(`/api/orders/${orderToApprove.id}`, {
        method: 'DELETE',
      });

      console.log(`Order ${orderId} approved and sent to warehouse.`);
    } catch (error) {
      console.error('Error approving order:', error);
      setOrders(orders);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Operations Dashboard</h1>

        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          <button
            className={`pb-2 font-semibold ${activeTab === 'approval' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('approval')}
          >
            Order Approval
          </button>
          <button
            className={`pb-2 font-semibold ${activeTab === 'tracking' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('tracking')}
          >
            Driver Tracking
          </button>
          <button
            className={`pb-2 font-semibold ${activeTab === 'alerts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </button>
          <button
            className={`pb-2 font-semibold ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'approval' && <OrderApproval initialOrders={orders} onApproveOrder={handleApproveOrder} />}
        {activeTab === 'tracking' && <DriverTracking orders={orders} />}
        {activeTab === 'alerts' && <Alerts products={products} reports={reports} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}

      </div>
    </div>
  );
};

export default OperationsPage;
