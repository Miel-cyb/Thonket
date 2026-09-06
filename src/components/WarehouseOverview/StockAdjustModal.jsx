'use client';

import React from 'react';
import { Plus, Minus, Layers } from 'lucide-react';

// StockAdjustModal Component - Modal for adjusting stock levels of a selected product variant in the warehouse
export default function StockAdjustModal({
    isOpen,
    onClose,
    selectedProduct,
    selectedVariant,
    newStock,
    setNewStock,
    onSave
}) {
    if (!isOpen || !selectedProduct || !selectedVariant) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 animate-in fade-in duration-150">
            <div className="bg-card border border-border rounded-xl shadow-xl p-6 w-full max-w-md space-y-6">
                <div className="flex justify-between items-start border-b border-border/60 pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Adjust Stock</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Reconcile warehouse inventory level.</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-base p-1 rounded-md transition">
                        ✕
                    </button>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg border border-border/40 text-sm space-y-2.5">
                    <div className="font-semibold text-foreground text-base">{selectedProduct.name}</div>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                        <div>Variant: <strong className="text-foreground">{selectedVariant.name}</strong></div>
                        <div className="flex items-center gap-1.5 font-mono">
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">
                                {selectedVariant.batchNumber || selectedVariant.batch || 'N/A'}
                            </span>
                        </div>
                        <div>SKU: <strong className="text-foreground font-mono">{selectedVariant.sku || 'N/A'}</strong></div>
                        <div>Expiry: <strong className="text-foreground font-mono">{selectedVariant.expiryDate || 'N/A'}</strong></div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label htmlFor="newStock" className="block text-xs font-bold uppercase text-muted-foreground tracking-wider">
                        Target Stock
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setNewStock((prev) => Math.max(0, (Number(prev) || 0) - 1))}
                            className="p-3 rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                        <input
                            id="newStock"
                            type="number"
                            min="0"
                            value={newStock}
                            onChange={(e) => {
                                const val = e.target.value;
                                setNewStock(val === '' ? '' : Math.max(0, parseInt(val, 10) || 0));
                            }}
                            className="border border-input rounded-lg px-3 py-2.5 text-center w-full bg-background font-bold text-xl focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setNewStock((prev) => (Number(prev) || 0) + 1)}
                            className="p-3 rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground transition"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                        {[+5, +10, +25, -5].map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setNewStock((prev) => Math.max(0, (Number(prev) || 0) + amt))}
                                className="flex-1 text-sm py-2 rounded-md border border-border/60 bg-muted/30 hover:bg-muted font-semibold transition"
                            >
                                {amt > 0 ? `+${amt}` : amt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition">
                        Cancel
                    </button>
                    <button onClick={onSave} className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}