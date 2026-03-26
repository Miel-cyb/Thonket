'use client';

import { useState } from 'react';
import UserMenu from '../UserMenu';
import PlaceOrder from './PlaceOrder';
import ViewOrders from './ViewOrders';
import ViewCustomers from './ViewCustomers';
import OrderDetails from './OrderDetails';
import {
  ShoppingCart,
  ClipboardList,
  Users,
  ArrowRight
} from 'lucide-react';

export default function SalesPage() {
  const [agentIdInput, setAgentIdInput] = useState('');
  const [salesAgentID, setSalesAgentID] = useState('');
  const [view, setView] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleContinue = () => {
    if (agentIdInput.trim()) {
      setSalesAgentID(agentIdInput.trim());
    } else {
      alert('Please enter a valid Sales Agent ID.');
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setView('viewOrderDetails');
  };

  const renderContent = () => {
    switch (view) {
      case 'placeOrder':
        return <PlaceOrder salesAgentID={salesAgentID} onBack={() => setView('dashboard')} />;
      case 'viewOrders':
        return (
          <ViewOrders
            salesAgentID={salesAgentID}
            onBack={() => setView('dashboard')}
            onSelectOrder={handleSelectOrder}
          />
        );
      case 'viewCustomers':
        return <ViewCustomers salesAgentID={salesAgentID} onBack={() => setView('dashboard')} />;
      case 'viewOrderDetails':
        return <OrderDetails orderId={selectedOrderId} onBack={() => setView('viewOrders')} />;
      default:
        return renderDashboard();
    }
  };

  const ActionCard = ({ icon: Icon, title, description, onClick }) => (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl border border-gray-200 bg-white p-6 text-left
                 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl
                        bg-purple-100 text-purple-700">
          <Icon size={24} />
        </div>
        <ArrowRight
          className="text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-purple-600"
          size={20}
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">
          Sales Dashboard
        </h2>
        <p className="mt-2 text-purple-100">
          What would you like to do today?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ActionCard
          icon={ShoppingCart}
          title="Place an Order"
          description="Create a new order for a customer."
          onClick={() => setView('placeOrder')}
        />

        <ActionCard
          icon={ClipboardList}
          title="View Orders"
          description="Review and manage all your submitted orders."
          onClick={() => setView('viewOrders')}
        />

        <ActionCard
          icon={Users}
          title="Customers"
          description="Browse and manage your customer records."
          onClick={() => setView('viewCustomers')}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Sales Portal
            </h1>
            {salesAgentID && (
              <p className="text-sm text-gray-500">
                Agent ID: {salesAgentID}
              </p>
            )}
          </div>
          <UserMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {!salesAgentID ? (
          <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-center text-2xl font-semibold text-gray-900">
              Sales Agent Verification
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Enter your Sales Agent ID to access the dashboard
            </p>

            <div className="mt-8 space-y-4">
              <input
                type="text"
                value={agentIdInput}
                onChange={(e) => setAgentIdInput(e.target.value)}
                placeholder="e.g. SA-1042"
                className="w-full rounded-xl border border-gray-300 px-4 py-3
                           focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={handleContinue}
                className="w-full rounded-xl bg-purple-600 py-3
                           font-semibold text-white transition-colors
                           hover:bg-purple-700"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
