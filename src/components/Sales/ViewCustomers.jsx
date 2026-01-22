'use client';

import { useState, useEffect, useCallback } from 'react';
import CreateCustomerForm from './CreateCustomerForm';
import AddMemberForm from './AddMemberForm';
import CustomerDetails from './CustomerDetails'; // Import the new component

const API_URL = 'https://thonket-sales-order-system.onrender.com'; // Corrected API URL

export default function ViewCustomers({ salesAgentID, onBack }) {
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'details', 'create', or 'edit'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null); // Changed to store ID
  const [addingMemberTo, setAddingMemberTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    if (!salesAgentID) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/customers?salesAgentId=${salesAgentID}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError('Failed to fetch customers. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [salesAgentID]);

  useEffect(() => {
    if (view === 'list') {
        fetchCustomers();
    }
  }, [view, fetchCustomers]);

  const handleSaveCustomer = async (customerData) => {
    const isEditing = !!customerData._id;
    const url = isEditing ? `${API_URL}/customers/${customerData._id}` : `${API_URL}/customers`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} customer.`);

      setView('list'); // Return to the list view after saving

    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`${API_URL}/customers/${customerId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete customer.');
        
        setCustomers(prev => prev.filter(c => c._id !== customerId));
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  const handleMemberAdded = () => {
    // No need to re-fetch here, the details view handles its own data
    // If the modal was on the list view, we would re-fetch
    if (view === 'list') {
        fetchCustomers();
    }
  };
  
  // Functions to switch views
  const showListView = () => setView('list');
  const showDetailsView = (id) => { setSelectedCustomerId(id); setView('details'); };
  const showEditView = (id) => { setSelectedCustomerId(id); setView('edit'); };
  const showCreateView = () => { setSelectedCustomerId(null); setView('create'); };


  if (view === 'details') {
      return <CustomerDetails customerId={selectedCustomerId} onBack={showListView} />
  }

  if (view === 'create' || view === 'edit') {
    const customerToEdit = view === 'edit' ? customers.find(c => c._id === selectedCustomerId) : null;
    return (
        <CreateCustomerForm 
            salesAgentID={salesAgentID} 
            customerToEdit={customerToEdit}
            onCancel={showListView}
            onSave={handleSaveCustomer}
        />
    )
  }

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Dashboard
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Customer List</h2>
        <button 
            onClick={showCreateView}
            className="py-2 px-5 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          + Create New
        </button>
      </div>
      
      {loading && <p>Loading customers...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Contact Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.type}</td>
                    <td className="py-3 px-4">{customer.contactInfo.phone || customer.contactInfo.email}</td>
                    <td className="py-3 px-4 flex gap-3 items-center">
                        <button onClick={() => showDetailsView(customer._id)} className="text-indigo-600 hover:underline text-sm font-semibold">View</button>
                        <button onClick={() => showEditView(customer._id)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                        <button onClick={() => handleDeleteCustomer(customer._id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                        {customer.type === 'BUSINESS' && (
                          <button onClick={() => setAddingMemberTo(customer._id)} className="text-green-600 hover:underline text-sm font-semibold">Add Member</button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}

      {addingMemberTo && (
        <AddMemberForm 
            customerId={addingMemberTo}
            onCancel={() => setAddingMemberTo(null)}
            onSuccess={handleMemberAdded}
        />
      )}
    </div>
  );
}
