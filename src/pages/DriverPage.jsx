'use client';

import React, { useState, useMemo } from 'react';
import {
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
    Truck,
    ArrowLeft,
    Layers,
    Map as MapIcon,
    X,
    ClipboardList
} from 'lucide-react';

import DriverPickupOverview from '../components/fleet/drivers/DriverPickupOverview';
import DriverVerificationSummary from '../components/fleet/drivers/DriverVerificationSummary';
import DriverTaskList from '../components/fleet/drivers/DriverTaskList';
import DriverMap from '../components/fleet/drivers/DriverMap';
import DriverManifestPanel from '../components/fleet/drivers/DriverManifestPanel';

const DUMMY_PICKUP = {
    location: "Global Distribution Center - Hub A",
    scheduledTime: "08:30 AM",
    vehicleId: "TRK-9902",
};

const DUMMY_TASKS = [
    {
        id: "T1",
        tripNumber: 1,
        sequence: 1,
        assignedToDriver: true,
        status: 'pending',
        customerName: "Central Market",
        items: [
            { id: "item-1", name: "Gallon of Oil", quantity: 10, confirmedQuantity: 0 },
            { id: "item-2", name: "Sack of Sugar", quantity: 5, confirmedQuantity: 0 }
        ]
    },
    {
        id: "T2",
        tripNumber: 1,
        sequence: 2,
        assignedToDriver: true,
        status: 'pending',
        customerName: "Apex Retailers",
        items: [
            { id: "item-3", name: "Crate of Eggs", quantity: 20, confirmedQuantity: 0 }
        ]
    },
    {
        id: "T3",
        tripNumber: 2,
        sequence: 1,
        assignedToDriver: true,
        status: 'pending',
        customerName: "West End Bistro",
        items: [
            { id: "item-4", name: "Baking Flour", quantity: 12, confirmedQuantity: 0 }
        ]
    }
];

export default function DriverDashboard() {
    const [localTasks, setLocalTasks] = useState(DUMMY_TASKS);
    const [isVerified, setIsVerified] = useState(false);
    const [hasStartedJourney, setHasStartedJourney] = useState(false);
    const [showDepartureModal, setShowDepartureModal] = useState(false);
    const [showMobileManifest, setShowMobileManifest] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    const handleUpdateQuantity = (taskId, itemId, newQty) => {
        setLocalTasks(prev => prev.map(task => {
            if (task.id !== taskId) return task;
            return {
                ...task,
                items: task.items.map(item =>
                    item.id === itemId ? { ...item, confirmedQuantity: newQty } : item
                )
            };
        }));
    };

    const groupedTrips = useMemo(() => {
        const groups = localTasks
            .filter(t => t.assignedToDriver && t.status !== 'completed')
            .reduce((acc, task) => {
                const tripId = task.tripNumber || 1;
                if (!acc[tripId]) acc[tripId] = [];
                acc[tripId].push(task);
                return acc;
            }, {});

        return Object.keys(groups)
            .sort((a, b) => Number(a) - Number(b))
            .reduce((obj, key) => {
                obj[key] = groups[key].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
                return obj;
            }, {});
    }, [localTasks]);

    const allActiveOrders = useMemo(() => Object.values(groupedTrips).flat(), [groupedTrips]);
    const currentActiveTask = allActiveOrders[currentTaskIndex] || null;

    const handleNavigationAction = () => {
        if (!isVerified) setShowDepartureModal(true);
        else setHasStartedJourney(true);
    };

    const handleMarkDelivered = () => {
        if (!currentActiveTask) return;
        setLocalTasks(prev => prev.map(t =>
            t.id === currentActiveTask.id ? { ...t, status: 'completed' } : t
        ));
        if (currentTaskIndex < allActiveOrders.length) {
            setCurrentTaskIndex(prev => prev + 1);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* Header - Optimized for space */}
            <header className="bg-white border-b border-slate-200 shrink-0 z-40">
                <div className="max-w-[1600px] mx-auto px-4 py-3 md:px-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {hasStartedJourney && (
                                <button
                                    onClick={() => setHasStartedJourney(false)}
                                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <div>
                                <h1 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    {hasStartedJourney ? 'Route Navigation' : 'Driver Console'}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {isVerified ? 'System Ready' : 'Audit Required'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!hasStartedJourney && (
                            <button
                                onClick={handleNavigationAction}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2
                                    ${isVerified ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-slate-900 text-white'}`}
                            >
                                {isVerified ? <Truck size={16} /> : <ShieldCheck size={16} />}
                                <span>{isVerified ? 'Start Journey' : 'Audit Load'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden">
                {!hasStartedJourney ? (
                    /* Dashboard View (Scrollable if many trips, but main container is fixed) */
                    <div className="h-full overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="max-w-5xl mx-auto space-y-6">
                            <DriverPickupOverview
                                pickup={DUMMY_PICKUP}
                                orders={allActiveOrders}
                                tripCount={Object.keys(groupedTrips).length}
                            />
                            <div className="relative space-y-6 mt-8 pb-10">
                                <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-px bg-slate-200" />
                                {Object.entries(groupedTrips).map(([tripNumber, tripTasks]) => (
                                    <div key={tripNumber} className="relative sm:pl-20 group">
                                        <div className="hidden sm:flex absolute left-0 top-0 items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm">
                                            <div className="text-center leading-none">
                                                <p className="text-[8px] font-black text-slate-400 uppercase">Trip</p>
                                                <p className="text-xl font-black text-slate-900">{tripNumber}</p>
                                            </div>
                                        </div>
                                        <div onClick={handleNavigationAction} className="bg-white rounded-3xl border border-slate-200 p-2 hover:shadow-lg transition-all cursor-pointer">
                                            <DriverTaskList tasks={tripTasks} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Navigation View - THE NO-SCROLL LAYOUT */
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6 max-w-[1800px] mx-auto">
                        
                        {/* Left Column: Map & Primary Actions */}
                        <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
                            {/* Map Container - Flex-1 makes it fill available space */}
                            <div className="flex-1 min-h-0 w-full bg-slate-200 rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner">
                                <DriverMap activeTask={currentActiveTask} />
                            </div>

                            {/* Actions Desktop Bar */}
                            <div className="hidden md:grid grid-cols-3 gap-4 h-24 shrink-0">
                                <button
                                    onClick={handleMarkDelivered}
                                    disabled={!currentActiveTask}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-[1.5rem] px-6 flex items-center justify-between text-white shadow-lg active:scale-95 transition-all"
                                >
                                    <div className="text-left leading-tight">
                                        <p className="text-[10px] font-black uppercase opacity-70">Step {currentTaskIndex + 1}</p>
                                        <p className="text-lg font-black">Confirm Drop</p>
                                    </div>
                                    <CheckCircle2 size={24} />
                                </button>

                                <div className="bg-white border border-slate-200 rounded-[1.5rem] px-6 flex items-center justify-between shadow-sm">
                                    <div className="leading-tight">
                                        <p className="text-[10px] font-black uppercase text-slate-400">Queue</p>
                                        <p className="text-xl font-black text-slate-900">{currentTaskIndex + 1} / {allActiveOrders.length}</p>
                                    </div>
                                    <Layers size={20} className="text-slate-300" />
                                </div>

                                <button className="bg-slate-900 hover:bg-red-600 rounded-[1.5rem] px-6 flex items-center justify-between text-white transition-all group">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Report Delay</span>
                                    <AlertCircle size={20} className="group-hover:animate-bounce" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Live Manifest Sidebar */}
                        <aside className="hidden lg:flex lg:col-span-4 h-full overflow-hidden">
                            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-xl flex flex-col w-full h-full">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-2">
                                        <MapIcon size={16} className="text-indigo-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Route Stream</h3>
                                    </div>
                                    {currentActiveTask && (
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-black border border-indigo-100">
                                            TRIP {currentActiveTask.tripNumber}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
                                    <DriverManifestPanel
                                        tasks={allActiveOrders}
                                        activeIndex={currentTaskIndex}
                                    />
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>

            {/* Mobile Bottom Bar - Fixed to prevent layout shift */}
            {hasStartedJourney && (
                <div className="md:hidden shrink-0 h-24 bg-white border-t border-slate-200 px-4 py-3 z-50 flex items-center gap-2">
                    <button
                        onClick={() => setShowMobileManifest(true)}
                        className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl flex flex-col items-center justify-center"
                    >
                        <ClipboardList size={20} />
                        <span className="text-[8px] font-black uppercase mt-1">List</span>
                    </button>

                    <button
                        onClick={handleMarkDelivered}
                        disabled={!currentActiveTask}
                        className="flex-1 h-16 bg-emerald-600 disabled:bg-slate-200 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg font-black uppercase text-xs tracking-widest"
                    >
                        <span>Drop Done</span>
                        <CheckCircle2 size={18} />
                    </button>

                    <button className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center justify-center">
                        <AlertCircle size={20} />
                        <span className="text-[8px] font-black uppercase mt-1">Help</span>
                    </button>
                </div>
            )}

            {/* Mobile Manifest Drawer */}
            {showMobileManifest && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center md:hidden">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileManifest(false)} />
                    <div className="relative bg-white w-full rounded-t-[2.5rem] shadow-2xl h-[70vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Live Manifest</h3>
                            <button onClick={() => setShowMobileManifest(false)} className="p-2 bg-slate-100 rounded-full">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <DriverManifestPanel tasks={allActiveOrders} activeIndex={currentTaskIndex} />
                        </div>
                    </div>
                </div>
            )}

            {/* Verification Modal */}
            {showDepartureModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowDepartureModal(false)} />
                    <div className="relative bg-white w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        <DriverVerificationSummary
                            orders={allActiveOrders}
                            onUpdateQuantity={handleUpdateQuantity}
                            onConfirmAll={() => {
                                setIsVerified(true);
                                setShowDepartureModal(false);
                                setHasStartedJourney(true);
                            }}
                            onClose={() => setShowDepartureModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}