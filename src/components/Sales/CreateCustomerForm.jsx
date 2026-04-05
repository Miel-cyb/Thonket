'use client';

import { useState, useEffect } from 'react';
import { User, Building2, Phone, Mail, MapPin, BadgeCheck, X, Save } from 'lucide-react';

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
    if (!formData.name) newErrors.name = 'Full name or Business name is required.';
    if (!formData.contactInfo.address) newErrors.address = 'Physical address is required.';

    if (!formData.contactInfo.phone || !/^\d{10,}$/.test(formData.contactInfo.phone)) {
      newErrors.phone = 'Valid phone number (min 10 digits) required.';
    }

    if (formData.contactInfo.email && !/\S+@\S+\.\S+/.test(formData.contactInfo.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.creditEligible && (!formData.creditLimit || formData.creditLimit <= 0)) {
      newErrors.creditLimit = 'Please specify a valid credit limit.';
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
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">

        {/* Header Section */}
        <div className="px-8 py-10 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
              {customerToEdit ? 'Update Profile' : 'Onboard Customer'}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
              Terminal ID: CRM-884 • Agent: {salesAgentID}
            </p>
          </div>
          <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            {formData.type === 'BUSINESS' ? <Building2 size={28} className="text-indigo-400" /> : <User size={28} className="text-indigo-400" />}
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-10">

          {/* Identity Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                <User size={14} /> Full Name / Corporate Entity
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Acme Distribution Ltd"
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-900 ${errors.name ? 'border-red-500' : 'border-slate-100 focus:border-indigo-600'}`}
              />
              {errors.name && <p className="text-red-500 text-[10px] font-black uppercase mt-2 italic">{errors.name}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Classification</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 outline-none font-bold text-slate-900 appearance-none cursor-pointer"
              >
                <option value="BUSINESS">Business / Wholesaler</option>
                <option value="INDIVIDUAL">Individual Retailer</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                <Phone size={14} /> Contact Number
              </label>
              <input
                type="text"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold text-slate-900 ${errors.phone ? 'border-red-500' : 'border-slate-100 focus:border-indigo-600'}`}
              />
              {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase mt-2 italic">{errors.phone}</p>}
            </div>
          </section>

          {/* Contact Details */}
          <section className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                <Mail size={14} /> Email Dispatch
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                placeholder="billing@customer.com"
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold text-slate-900 ${errors.email ? 'border-red-500' : 'border-slate-100 focus:border-indigo-600'}`}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                <MapPin size={14} /> Logistics / Billing Address
              </label>
              <textarea
                name="contactInfo.address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                rows="3"
                className={`w-full p-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold text-slate-900 ${errors.address ? 'border-red-500' : 'border-slate-100 focus:border-indigo-600'}`}
              ></textarea>
            </div>
          </section>

          {/* Financials */}
          <section className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <BadgeCheck size={18} className="text-white" />
                </div>
                <span className="font-black uppercase text-xs text-indigo-900 tracking-widest">Credit Terms</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="creditEligible" checked={formData.creditEligible} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {formData.creditEligible && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-black uppercase text-indigo-900/60 mb-2">Maximum Credit Exposure (GHS)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-indigo-600">₵</span>
                  <input
                    type="number"
                    name="creditLimit"
                    value={formData.creditLimit}
                    onChange={handleChange}
                    className={`w-full p-4 pl-10 bg-white border-2 rounded-2xl outline-none font-black text-xl text-slate-900 ${errors.creditLimit ? 'border-red-500' : 'border-indigo-200 focus:border-indigo-600'}`}
                  />
                </div>
                {errors.creditLimit && <p className="text-red-500 text-[10px] font-black uppercase mt-2 italic">{errors.creditLimit}</p>}
              </div>
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-200 transition-all border-2 border-transparent"
          >
            <X size={16} /> Discard Changes
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 py-4 px-10 rounded-2xl font-black uppercase text-xs tracking-widest bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-indigo-200 transition-all border-2 border-slate-900 hover:border-indigo-600"
          >
            <Save size={16} /> {customerToEdit ? 'Commit Updates' : 'Finalize Onboarding'}
          </button>
        </div>
      </form>
    </div>
  );
}