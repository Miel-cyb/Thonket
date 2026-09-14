import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

// This handles the action modals of the pricing page
export const LeavePromptModal = ({ onStay, onDiscard }) => (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle size={24} />
                <h3 className="text-base font-bold text-slate-900">Unsaved Changes Detected</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
                You have modified variant pricing parameters that haven't been saved. Leaving this workspace will discard your current draft modifications.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onStay}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                    Stay
                </button>
                <button
                    type="button"
                    onClick={onDiscard}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                    Discard Changes
                </button>
            </div>
        </div>
    </div>
);

export const ActivateModal = ({ variantCount, saving, onCancel, onConfirm }) => (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-indigo-600">
                <CheckCircle2 size={26} />
                <h3 className="text-base font-bold text-slate-900">Activate all variant prices?</h3>
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Configured Variants</span>
                    <span className="text-sm font-black text-indigo-900">{variantCount} active variants</span>
                </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
                This will publish new base prices, discount configurations, and tier structures for all variants across authorized sales channels.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={saving}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                    {saving ? 'Activating...' : 'Activate Prices'}
                </button>
            </div>
        </div>
    </div>
);