'use client';

import { useState } from 'react';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function AddBranchForm({ customerId, onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Branch name is required.';
    if (!formData.address) newErrors.address = 'Branch address is required.';
    
    // Optional phone validation
    if (formData.phone && !/^\d{10,}$/.test(formData.phone)) {
        newErrors.phone = 'If provided, phone must be at least 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/customers/${customerId}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add branch.');
      }

      onSuccess();
      alert('Branch added successfully!');
      onCancel();

    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Branch</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
                <input type="text" name="name" placeholder="Branch Name" value={formData.name} onChange={handleChange} className={`p-3 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <input type="text" name="address" placeholder="Branch Address" value={formData.address} onChange={handleChange} className={`p-3 w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
                <input type="text" name="phone" placeholder="Branch Phone (Optional)" value={formData.phone} onChange={handleChange} className={`p-3 w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onCancel} className="py-2 px-6 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="py-2 px-6 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
