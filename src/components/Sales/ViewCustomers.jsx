'use client';

import { useState, useEffect } from 'react';
import CreateCustomerForm from './CreateCustomerForm';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function ViewCustomers({ salesAgentID, onBack }) {
  const [customers, setCustomers] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'create', or 'edit'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from the API
  useEffect(() => {
    if (salesAgentID) {
      setLoading(true);
      fetch(`${API_URL}/customers?salesAgentId=${salesAgentID}`)
        .then(res => res.json())
        .then(data => {
          setCustomers(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch customers. Please try again later.');
          setLoading(false);
          console.error(err);
        });
    }
  }, [salesAgentID]);

  const handleSaveCustomer = async (customerData) => {
    const isEditing = view === 'edit';
    const url = isEditing ? `${API_URL}/customers/${customerData._id}` : `${API_URL}/customers`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} customer.`);

      const savedCustomer = await response.json();

      if (isEditing) {
        setCustomers(prev => prev.map(c => c._id === savedCustomer._id ? savedCustomer : c));
      } else {
        setCustomers(prev => [...prev, savedCustomer]);
      }
      
      setView('list');
      setSelectedCustomer(null);

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

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setView('edit');
  };

  if (view === 'create' || view === 'edit') {
    return (
        <CreateCustomerForm 
            salesAgentID={salesAgentID} 
            customerToEdit={selectedCustomer}
            onCancel={() => { setView('list'); setSelectedCustomer(null); }}
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
            onClick={() => setView('create')}
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">Contact Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Credit Limit</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id} className="border-b">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.contactInfo.phone || customer.contactInfo.email}</td>
                    <td className="py-3 px-4">{customer.creditEligible ? `GHS ${customer.creditLimit}` : 'N/A'}</td>
                    <td className="py-3 px-4 flex gap-4">
                        <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                        <button onClick={() => handleDeleteCustomer(customer._id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
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
