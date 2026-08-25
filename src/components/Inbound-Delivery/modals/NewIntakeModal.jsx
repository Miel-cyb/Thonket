
import React from 'react';
import { X } from 'lucide-react';


//  Modal for logging a new delivery intake
export default function NewIntakeModal({ form, onChange, onSubmit, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-base font-bold text-slate-900">Log New Delivery Intake</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4 text-xs">
                    <div>
                        <label className="block text-slate-600 font-semibold mb-1">Purchase Order / Manifest #</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. PO-2026-9000"
                            value={form.id}
                            onChange={(e) => onChange({ ...form, id: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-600 font-semibold mb-1">Supplier Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Acme Fresh Corp"
                            value={form.supplier}
                            onChange={(e) => onChange({ ...form, supplier: e.target.value })}
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Expected Date</label>
                            <input
                                type="date"
                                value={form.expectedDate}
                                onChange={(e) => onChange({ ...form, expectedDate: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Receiving Bay</label>
                            <select
                                value={form.dockNumber}
                                onChange={(e) => onChange({ ...form, dockNumber: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <option value="Bay 01">Bay 01</option>
                                <option value="Bay 02">Bay 02</option>
                                <option value="Bay 03">Bay 03</option>
                                <option value="Bay 04">Bay 04</option>
                                <option value="Bay 05">Bay 05</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Freight Carrier</label>
                            <input
                                type="text"
                                placeholder="e.g. DHL Express"
                                value={form.carrier}
                                onChange={(e) => onChange({ ...form, carrier: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-600 font-semibold mb-1">Tracking Number</label>
                            <input
                                type="text"
                                placeholder="e.g. TRK-000123"
                                value={form.trackingNo}
                                onChange={(e) => onChange({ ...form, trackingNo: e.target.value })}
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
                        >
                            Create Delivery Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}