'use client';

import { useState, useEffect } from 'react';

export default function CreateCustomerForm({ salesAgentID, customerToEdit, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'BUSINESS',
    salesAgentId: salesAgentID,
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    creditEligible: false,
    creditLimit: 0
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customerToEdit) {
      setFormData(customerToEdit);
    }
  }, [customerToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.contactInfo.address) newErrors.address = 'Address is required.';
    
    // Phone validation (basic)
    if (!formData.contactInfo.phone || !/^\d{10,}$/.test(formData.contactInfo.phone)) {
        newErrors.phone = 'A valid phone number (at least 10 digits) is required.';
    }

    // Email validation
    if (formData.contactInfo.email && !/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }

    // Credit Limit validation
    if (formData.creditEligible && (!formData.creditLimit || formData.creditLimit <= 0)) {
        newErrors.creditLimit = 'Credit limit must be a positive number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ 
          ...prev, 
          contactInfo: { ...prev.contactInfo, [field]: value } 
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {customerToEdit ? 'Edit Customer' : 'Create New Customer'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={`mt-1 p-3 w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Customer Type</label>
          <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 p-3 w-full border border-gray-300 rounded-md">
            <option>BUSINESS</option>
            <option>INDIVIDUAL</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="text" name="contactInfo.phone" id="contactInfo.phone" required value={formData.contactInfo.phone} onChange={handleChange} className={`mt-1 p-3 w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" name="contactInfo.email" id="contactInfo.email" value={formData.contactInfo.email} onChange={handleChange} className={`mt-1 p-3 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="contactInfo.address" id="contactInfo.address" value={formData.contactInfo.address} onChange={handleChange} rows="3" className={`mt-1 p-3 w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}></textarea>
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* Credit Eligible */}
        <div className="md:col-span-2 flex items-center gap-4">
          <input type="checkbox" name="creditEligible" id="creditEligible" checked={formData.creditEligible} onChange={handleChange} className="h-5 w-5 text-purple-600 border-gray-300 rounded" />
          <label htmlFor="creditEligible" className="text-sm font-medium text-gray-700">Eligible for Credit?</label>
        </div>

        {/* Credit Limit */}
        {formData.creditEligible && (
          <div className="md:col-span-2">
            <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700">Credit Limit (GHS)</label>
            <input type="number" name="creditLimit" id="creditLimit" value={formData.creditLimit} onChange={handleChange} className={`mt-1 p-3 w-full border ${errors.creditLimit ? 'border-red-500' : 'border-gray-300'} rounded-md`} />
            {errors.creditLimit && <p className="text-red-500 text-xs mt-1">{errors.creditLimit}</p>}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="py-2 px-6 rounded-md font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="py-2 px-6 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700">
          {customerToEdit ? 'Save Changes' : 'Save Customer'}
        </button>
      </div>
    </form>
  );
}
