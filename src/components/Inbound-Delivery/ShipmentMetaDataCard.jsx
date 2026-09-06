import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';

//  ShipmentMetadataCard Component - Displays key shipment and receiving metadata for a given order
export default function ShipmentMetadataCard({ order }) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600" /> Shipment & Receiving Metadata
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-1 text-sm">
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block font-medium uppercase text-xs tracking-wider">Supplier</span>
                    <span className="font-medium text-slate-800 block truncate" title={order.supplier}>{order.supplier}</span>
                </div>
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block font-medium uppercase text-xs tracking-wider">Carrier & Tracking</span>
                    <span className="font-medium text-slate-800 block truncate" title={`${order.carrier} (${order.trackingNo})`}>
                        {order.carrier} <span className="text-slate-400 font-normal">({order.trackingNo})</span>
                    </span>
                </div>
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block font-medium uppercase text-xs tracking-wider">Dock / Bay</span>
                    <span className="font-medium text-slate-800 block truncate">{order.dockNumber}</span>
                </div>
                <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60 space-y-1">
                    <span className="text-slate-400 block font-medium uppercase text-xs tracking-wider">Truck & Seal</span>
                    <span className="font-medium text-slate-800 block truncate">{order.truckNumber} / {order.sealNumber}</span>
                </div>
            </div>

            {order.reconciliation?.discrepancySummary && (
                <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-4 text-sm text-blue-950 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                        <span className="font-semibold tracking-wide text-blue-900 block font-mono text-xs">Reconciliation Settlement Note:</span>
                        <p className="text-blue-900/80 leading-relaxed font-normal">{order.reconciliation.discrepancySummary}</p>
                    </div>
                </div>
            )}
        </div>
    );
}