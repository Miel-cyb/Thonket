'use client';

import React, { useState } from 'react';
import {
    X, Truck, Settings, ShieldCheck, CheckCircle2,
    ChevronRight, Weight, User, Calendar
} from 'lucide-react';

export default function OnboardVehicleModal({ isOpen, onClose, onOnboard }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        vehicleName: '',
        licensePlate: '',
        vin: '',
        type: 'Heavy Truck',
        payloadCapacity: '',
        fuelType: 'Diesel',
        makeModel: '',
        lastMaintenance: '',
        insuranceExpiry: '',
        assignedDriver: '',
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const steps = [
        { id: 1, label: 'Identity', icon: <Truck size={14} /> },
        { id: 2, label: 'Technical', icon: <Settings size={14} /> },
        { id: 3, label: 'Compliance', icon: <ShieldCheck size={14} /> }
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        onOnboard(formData);
        setStep(1);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Onboard New Unit</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enterprise Fleet Registry</p>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 flex items-center justify-center hover:bg-white hover:shadow-md rounded-2xl transition-all text-slate-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Stepper */}
                <div className="px-14 py-8 flex items-center justify-between relative">
                    {steps.map((s, idx) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center gap-3 z-10">
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${step >= s.id
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200'
                                    : 'bg-white border-slate-100 text-slate-300'
                                    }`}>
                                    {step > s.id ? <CheckCircle2 size={18} /> : s.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${step >= s.id ? 'text-indigo-600' : 'text-slate-400'
                                    }`}>{s.label}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="flex-1 h-[2px] mx-2 -translate-y-4 bg-slate-100 overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 transition-all duration-700 ease-in-out"
                                        style={{ width: step > s.id ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form Content */}
                <div className="px-10 py-4 min-h-[220px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-2 gap-5">
                                <FormInput label="Internal Name" name="vehicleName" placeholder="e.g. TRK-01" value={formData.vehicleName} onChange={handleChange} />
                                <FormInput label="License Plate" name="licensePlate" placeholder="GT-123-24" value={formData.licensePlate} onChange={handleChange} />
                            </div>
                            <FormSelect label="Fleet Category" name="type" value={formData.type} onChange={handleChange} options={['Heavy Truck', 'Box Van', 'Refrigerated']} />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <FormInput label="Make & Model" name="makeModel" placeholder="Isuzu F-Series" value={formData.makeModel} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-5">
                                <FormInput label="Payload (KG)" name="payloadCapacity" type="number" placeholder="5000" value={formData.payloadCapacity} onChange={handleChange} icon={<Weight size={14} />} />
                                <FormSelect label="Fuel Type" name="fuelType" value={formData.fuelType} onChange={handleChange} options={['Diesel', 'Petrol', 'Electric']} />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-2 gap-5">
                                <FormInput label="Insurance Expiry" name="insuranceExpiry" type="date" value={formData.insuranceExpiry} onChange={handleChange} icon={<Calendar size={14} />} />
                                <FormInput label="Service Due" name="lastMaintenance" type="date" value={formData.lastMaintenance} onChange={handleChange} icon={<Calendar size={14} />} />
                            </div>
                            <FormInput label="Assigned Driver" name="assignedDriver" placeholder="Search driver name..." value={formData.assignedDriver} onChange={handleChange} icon={<User size={14} />} />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-10 px-10 pb-10 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-800 transition-colors px-2 py-1"
                    >
                        {step === 1 ? 'Cancel Onboarding' : 'Back'}
                    </button>

                    <button
                        type="button"
                        onClick={step < 3 ? () => setStep(s => s + 1) : handleSubmit}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-3"
                    >
                        {step === 3 ? 'Finalize Onboarding' : 'Next Stage'}
                        <ChevronRight size={14} className={step === 3 ? 'hidden' : 'block'} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, icon, ...props }) {
    return (
        <div className="flex flex-col gap-2 w-full relative group">
            {/* Label corrected: Darkened to slate-600 and bolded for visibility */}
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 ml-1 transition-colors group-focus-within:text-indigo-600">
                {label}
            </label>
            <div className="relative">
                <input
                    {...props}
                    className="w-full bg-slate-50/80 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-[13px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-300"
                />
                {icon && <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors">{icon}</div>}
            </div>
        </div>
    );
}

function FormSelect({ label, options, ...props }) {
    return (
        <div className="flex flex-col gap-2 w-full group">
            {/* Label corrected: Darkened to slate-600 and bolded for visibility */}
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600 ml-1 transition-colors group-focus-within:text-indigo-600">
                {label}
            </label>
            <div className="relative">
                <select
                    {...props}
                    className="w-full bg-slate-50/80 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-[13px] font-bold text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none"
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRight size={14} className="rotate-90 text-slate-400 group-focus-within:text-indigo-500" />
                </div>
            </div>
        </div>
    );
}