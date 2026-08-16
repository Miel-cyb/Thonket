import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Truck, CheckCircle2, Clock, Phone, FileText, Building, Lock, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../../utils/urls';

export default function GateSecurityControl({
    form = {},
    setForm = () => { },
    organizationId,
    supplierId,
    isArrived,
    isReceiving,
    deliveryId,
    onConfirmArrival,
    onStartReceiving
}) {
    const [logisticsData, setLogisticsData] = useState({ carriers: [], truckNumbers: [], drivers: [] });
    const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const selectedDriverIndex = form?.driverIndex ?? '';
    const selectedTruck = form?.truckNumber || '';
    const selectedCarrier = form?.carrierName || '';

    useEffect(() => {
        if (!organizationId || !supplierId) return;

        let isMounted = true;
        const fetchRegisteredLogistics = async () => {
            setIsLoadingProfiles(true);
            setFetchError(null);
            try {
                const endpoint = `${API_ENDPOINTS.WAREHOUSES}/inbound/delivery/supplier-logistics-history?organizationId=${encodeURIComponent(organizationId)}&supplierId=${encodeURIComponent(supplierId)}`;

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch registered profiles: ${response.statusText}`);
                }

                const jsonResponse = await response.json();
                const payload = jsonResponse?.data || jsonResponse;

                if (isMounted) {
                    setLogisticsData({
                        carriers: Array.isArray(payload?.carriers) ? payload.carriers : [],
                        truckNumbers: Array.isArray(payload?.truckNumbers) ? payload.truckNumbers : [],
                        drivers: Array.isArray(payload?.drivers) ? payload.drivers : []
                    });
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching supplier registered logistics:", err);
                    setFetchError(err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingProfiles(false);
                }
            }
        };

        fetchRegisteredLogistics();

        return () => {
            isMounted = false;
        };
    }, [organizationId, supplierId]);

    const handleSelectDriver = (e) => {
        const index = e.target.value;

        if (index === '') {
            setForm((prev) => ({
                ...(prev || {}),
                driverIndex: '',
                driverName: '',
                driverPhone: '',
                driverLicense: '',
            }));
            return;
        }

        const driver = logisticsData.drivers[parseInt(index, 10)];
        if (driver) {
            setForm((prev) => ({
                ...(prev || {}),
                driverIndex: index,
                driverName: driver.driverName || '',
                driverPhone: driver.driverPhone || '',
                driverLicense: driver.driverLicenseNumber || prev?.driverLicense || '',
            }));
        }
    };

    const handleSelectTruck = (e) => {
        const truck = e.target.value;
        setForm((prev) => ({
            ...(prev || {}),
            truckNumber: truck
        }));
    };

    const handleSelectCarrier = (e) => {
        const carrier = e.target.value;
        setForm((prev) => ({
            ...(prev || {}),
            carrierName: carrier
        }));
    };

    return (
        <div className="border border-slate-200/70 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-slate-900 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck
                    size={16}
                    className={
                        isReceiving
                            ? 'text-violet-500'
                            : isArrived
                                ? 'text-emerald-500'
                                : 'text-slate-400'
                    }
                />
                <span>Gate Security & Operational Control</span>
            </h3>

            {/* Quick Select Fleet History */}
            <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <User size={13} className="text-indigo-500" />
                        <span>Quick Select Supplier Logistics History</span>
                    </label>
                    {isLoadingProfiles && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Loader2 size={12} className="animate-spin" /> Fetching records...
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                        value={selectedCarrier}
                        onChange={handleSelectCarrier}
                        disabled={isLoadingProfiles || logisticsData.carriers.length === 0}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium disabled:opacity-50 cursor-pointer"
                    >
                        <option value="">-- Select Carrier --</option>
                        {logisticsData.carriers.map((carrier, idx) => (
                            <option key={`carrier-${idx}`} value={carrier}>{carrier}</option>
                        ))}
                    </select>

                    <select
                        value={selectedTruck}
                        onChange={handleSelectTruck}
                        disabled={isLoadingProfiles || logisticsData.truckNumbers.length === 0}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium disabled:opacity-50 cursor-pointer"
                    >
                        <option value="">-- Select Truck Plate --</option>
                        {logisticsData.truckNumbers.map((truck, idx) => (
                            <option key={`truck-${idx}`} value={truck}>{truck}</option>
                        ))}
                    </select>

                    <select
                        value={selectedDriverIndex}
                        onChange={handleSelectDriver}
                        disabled={isLoadingProfiles || logisticsData.drivers.length === 0}
                        className="w-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 font-medium disabled:opacity-50 cursor-pointer"
                    >
                        <option value="">-- Select Pre-saved Driver --</option>
                        {logisticsData.drivers.map((driver, idx) => (
                            <option key={`driver-${idx}`} value={idx}>
                                {driver.driverName} {driver.driverPhone ? `| Phone: ${driver.driverPhone}` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {fetchError && (
                    <p className="text-[10px] text-red-500 mt-1">Could not fetch profiles: {fetchError}</p>
                )}
            </div>

            {/* Transport & Vehicle Details */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Transport & Vehicle Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Carrier / Logistics Provider
                        </label>
                        <div className="relative">
                            <Building className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.carrierName ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), carrierName: e.target.value })}
                                placeholder="e.g. Supplier, DHL"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Truck Registration / License Plate
                        </label>
                        <div className="relative">
                            <Truck className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.truckNumber ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), truckNumber: e.target.value.toUpperCase() })}
                                placeholder="e.g. GH35052"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Driver Information */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Driver Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Driver Full Name (Verified Operator)
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.driverName ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), driverName: e.target.value })}
                                placeholder="e.g. Smart Smith"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Driver Contact Number
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="tel"
                                value={form?.driverPhone ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), driverPhone: e.target.value })}
                                placeholder="e.g. 02344569562"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Documentation & Security Check */}
            <div className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Documentation & Security Check (Trip Specific)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Waybill Number
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.waybillNumber ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), waybillNumber: e.target.value })}
                                placeholder="e.g. WB-99823"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Container / Cargo Seal Number
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={form?.sealNumber ?? ''}
                                onChange={(e) => setForm({ ...(form || {}), sealNumber: e.target.value })}
                                placeholder="e.g. SL-44210"
                                className="w-full text-xs bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* State Action Controls */}
            <div className="pt-2">
                {!isArrived && !isReceiving ? (
                    <button
                        type="button"
                        onClick={() => onConfirmArrival(deliveryId)}
                        disabled={!form?.driverName?.trim() || !form?.truckNumber?.trim()}
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
                    >
                        Log Gate Entry & Confirm Vehicle Arrival
                    </button>
                ) : isArrived ? (
                    <div className="bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-800/40 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Vehicle presence verified. Cleared for bay docking and receiving.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onStartReceiving(deliveryId)}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap active:scale-[0.98]"
                        >
                            Initiate Offloading
                        </button>
                    </div>
                ) : (
                    <div className="bg-violet-50/80 dark:bg-violet-500/10 border border-violet-200/80 dark:border-violet-800/40 p-4 rounded-xl flex items-center space-x-3 text-xs text-violet-800 dark:text-violet-300 font-medium">
                        <Clock size={18} className="text-violet-600 dark:text-violet-400 animate-spin shrink-0" />
                        <span>Receiving in Progress: Line marshals are actively scanning and auditing incoming pallets.</span>
                    </div>
                )}
            </div>
        </div>
    );
}