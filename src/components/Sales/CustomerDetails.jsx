'use client';

import { useState, useEffect, useCallback } from 'react';
import AddBranchForm from './AddBranchForm';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function CustomerDetails({ customerId, onBack }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);

  const fetchCustomerDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/customers/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details.');
      }
      const data = await response.json();
      setCustomer(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [fetchCustomerDetails]);

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        const response = await fetch(`${API_URL}/customers/${customerId}/members/${memberId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to remove member.');
        }
        await fetchCustomerDetails();
        alert('Member removed successfully!');
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  const handleRemoveBranch = async (branchId) => {
    if (window.confirm('Are you sure you want to remove this branch?')) {
      try {
        const response = await fetch(`${API_URL}/customers/${customerId}/branches/${branchId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to remove branch.');
        }
        await fetchCustomerDetails();
        alert('Branch removed successfully!');
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  const handleBranchAdded = () => {
    setShowAddBranchModal(false);
    fetchCustomerDetails();
  }

  if (loading) return <p className="text-center p-8">Loading customer details...</p>;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!customer) return <p className="text-center p-8">No customer data found.</p>;

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Customer List
      </button>

      <div className="mb-8 border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-800">{customer.name}</h2>
        <p className="text-gray-500 capitalize mt-1">{customer.type.toLowerCase()}</p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Contact Information</h3>
          <p><strong>Email:</strong> {customer.contactInfo.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {customer.contactInfo.phone || 'N/A'}</p>
          <p><strong>Address:</strong> {customer.contactInfo.address || 'N/A'}</p>
      </div>
      
      {customer.type === 'BUSINESS' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Business Members</h3>
          {customer.members && customer.members.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {customer.members.map((member) => (
                <li key={member._id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{member.name} ({member.role})</p>
                    <p className="text-sm text-gray-600">{member.email || 'No email'} | {member.phone || 'No phone'}</p>
                  </div>
                  <button 
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-red-600 hover:underline text-sm font-semibold"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No members found for this customer.</p>
          )}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Branches</h3>
            <button onClick={() => setShowAddBranchModal(true)} className="py-2 px-5 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors">
                + Add Branch
            </button>
        </div>
        {customer.branches && customer.branches.length > 0 ? (
        <ul className="divide-y divide-gray-200">
            {customer.branches.map((branch) => (
            <li key={branch._id} className="py-4 flex justify-between items-center">
                <div>
                <p className="font-semibold">{branch.name}</p>
                <p className="text-sm text-gray-600">{branch.address} | {branch.phone || 'No phone'}</p>
                </div>
                <button 
                onClick={() => handleRemoveBranch(branch._id)}
                className="text-red-600 hover:underline text-sm font-semibold"
                >
                Remove
                </button>
            </li>
            ))}
        </ul>
        ) : (
        <p className="text-gray-500">No branches found for this customer.</p>
        )}
      </div>

      {showAddBranchModal && (
        <AddBranchForm 
            customerId={customerId}
            onCancel={() => setShowAddBranchModal(false)}
            onSuccess={handleBranchAdded}
        />
      )}
    </div>
  );
}
