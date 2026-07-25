import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function FinalizeModal({ metrics, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Finalize Delivery & Commit Stock?</h3>
                <p className="text-xs text-slate-500 mb-6">
                    This action will shift <strong>{metrics.totalAccepted} units</strong> valued at{' '}
                    <strong>${metrics.valueEnteringInventory.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> into active warehouse bins.
                </p>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Review Items
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                    >
                        Confirm Commitment
                    </button>
                </div>
            </div>
        </div>
    );
}