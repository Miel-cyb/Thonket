
import React from 'react';
import { Save } from 'lucide-react';

export default function OrderNotesFooter({ notes, onNotesChange, onOpenConfirmModal }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Receiving & Quality Clearance Notes
                </label>
                <textarea
                    rows={3}
                    value={notes || ''}
                    onChange={(e) => onNotesChange(e.target.value)}
                    placeholder="Log exceptions, pallet condition issues, temperature recordings, or driver signatures..."
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
            </div>

            <div className="flex flex-col justify-end gap-3 min-w-[220px]">
                <button
                    onClick={onOpenConfirmModal}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition shadow-sm"
                >
                    <Save className="w-4 h-4" /> Complete & Stock Inventory
                </button>
            </div>
        </div>
    );
}