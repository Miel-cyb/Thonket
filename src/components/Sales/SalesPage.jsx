'use client';

import { useState } from 'react';
import UserMenu from '../UserMenu';
import PlaceOrder from './PlaceOrder';
import ViewOrders from './ViewOrders';
import ViewCustomers from './ViewCustomers';
import OrderDetails from './OrderDetails'; // Import OrderDetails

export default function SalesPage() {
  const [agentIdInput, setAgentIdInput] = useState('');
  const [salesAgentID, setSalesAgentID] = useState('');
  const [view, setView] = useState('dashboard'); // dashboard, placeOrder, viewOrders, viewCustomers, viewOrderDetails
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
        return <ViewOrders salesAgentID={salesAgentID} onBack={() => setView('dashboard')} onSelectOrder={handleSelectOrder} />;
      case 'viewCustomers':
        return <ViewCustomers salesAgentID={salesAgentID} onBack={() => setView('dashboard')} />;
      case 'viewOrderDetails':
        return <OrderDetails orderId={selectedOrderId} onBack={() => setView('viewOrders')} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            What would you like to do today?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Place an Order Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Place an Order</h3>
                <p className="text-gray-500 mb-4">Create a new order for a customer.</p>
                <button onClick={() => setView('placeOrder')} className="w-full py-2 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Go
                </button>
            </div>

            {/* View All Orders Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">View All Orders</h3>
                <p className="text-gray-500 mb-4">See the history of all orders you have placed.</p>
                <button onClick={() => setView('viewOrders')} className="w-full py-2 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Go
                </button>
            </div>

            {/* View All Customers Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 1.803M15 21a9 9 0 00-9-9" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">View Customers</h3>
                <p className="text-gray-500 mb-4">Browse and manage your customer list.</p>
                <button onClick={() => setView('viewCustomers')} className="w-full py-2 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                  Go
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 sm:p-10">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, Sales Agent {salesAgentID && `(${salesAgentID})`}
        </h1>
        <UserMenu />
      </header>

      <div className="max-w-4xl mx-auto">
        {!salesAgentID ? (
            <div className="mb-8 p-8 bg-white rounded-2xl shadow-lg text-center">
                <label htmlFor="agentIdInput" className="block text-lg font-medium text-gray-800 mb-4">
                    Please enter your Sales Agent ID to continue
                </label>
                <input
                    type="text"
                    id="agentIdInput"
                    value={agentIdInput}
                    onChange={(e) => setAgentIdInput(e.target.value)}
                    placeholder="e.g., SA12345"
                    className="w-full max-w-sm mx-auto p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                    onClick={handleContinue}
                    className="mt-5 w-full max-w-sm mx-auto py-3 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                    Continue
                </button>
            </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
