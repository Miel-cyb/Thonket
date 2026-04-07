'use client';

import React, { useState, useMemo } from 'react';
import {
    MessageSquare,
    ClipboardList,
    LayoutDashboard,
    Map as MapIcon,
    Bell,
    X,
    Truck,
    Search,
} from 'lucide-react';

// Layout & Components
import QuickActionsBar from '../components/fleet/layout/QuickActionsBar';
import AlertsPanel from '../components/fleet/alerts/AlertsPanel';
import ChatPanel from '../components/fleet/cummunication/ChatPanel';
import FleetMap from '../components/fleet/fleetmap/FleetMap';
import VehicleList from '../components/fleet/vehicles/VehicleLists';
import FleetAnalytics from '../components/fleet/analytics/FleetAnalytics';
import DriverDashboard from './DriverPage';

// Modals
import OnboardVehicleModal from '../components/fleet/vehicles/OnboardVehicleModal';
import DeployTaskModal from '../components/fleet/tasks/DeployTaskModal'; // NEW: Imported Deploy Modal

export default function FleetDashboardPage({ userRole = 'manager' }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeView, setActiveView] = useState('map');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAlertsOpen, setIsAlertsOpen] = useState(false);

    // Modal States
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false); // NEW: State for Deploy Modal

    const [tasks, setTasks] = useState([
        { id: 1, customerName: 'Shop A', address: 'Accra Central', status: 'pending', assignedToDriver: false, type: 'Delivery' },
        { id: 2, customerName: 'Shop B', address: 'Tema Harbor', status: 'completed', assignedToDriver: true, driverName: 'Kwame', completedAt: '07:30 AM' },
        { id: 3, customerName: 'Mart C', address: 'East Legon', status: 'in-progress', assignedToDriver: true, driverName: 'Ama', type: 'Pickup' },
        { id: 4, customerName: 'Pharmacy D', address: 'Osu', status: 'pending', assignedToDriver: false, type: 'Delivery' },
    ]);

    const [vehicles, setVehicles] = useState([
        { id: 1, name: 'Truck 01', status: 'active', driverName: 'Kwame', usage: 85, fuel: 75, lat: 5.6037, lng: -0.1870 },
        { id: 2, name: 'Van 04', status: 'idle', driverName: null, usage: 40, fuel: 90, lat: 5.6500, lng: -0.1900 },
    ]);

    const [alerts, setAlerts] = useState([
        { id: 1, message: 'Delayed: Route 04 (Truck 01)', severity: 'warning', timestamp: '10m ago' },
        { id: 2, message: 'Sensor Failure: Engine Check', severity: 'critical', timestamp: '2m ago' },
    ]);

    const filteredVehicles = useMemo(() =>
        vehicles.filter(v =>
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (v.driverName && v.driverName.toLowerCase().includes(searchQuery.toLowerCase()))
        ), [searchQuery, vehicles]);

    // Handle Vehicle Onboarding
    const handleOnboardSubmit = (data) => {
        const newUnit = {
            id: vehicles.length + 1,
            name: data.vehicleName || `Unit ${vehicles.length + 1}`,
            status: 'idle',
            driverName: data.assignedDriver || 'Unassigned',
            usage: 0,
            fuel: 100,
            lat: 5.6037,
            lng: -0.1870
        };
        setVehicles(prev => [...prev, newUnit]);
        setIsOnboardingOpen(false);
    };

    // NEW: Handle Deployment Logic
    const handleDeploySubmit = (deploymentData) => {
        const { orderIds, vehicle, driver } = deploymentData;

        setTasks(prevTasks => prevTasks.map(task =>
            orderIds.includes(task.id)
                ? { ...task, status: 'in-progress', assignedToDriver: true, driverName: driver, assignedVehicle: vehicle }
                : task
        ));

        // Update vehicle status to active if it was idle
        setVehicles(prevVehicles => prevVehicles.map(v =>
            v.name === vehicle ? { ...v, status: 'active', driverName: driver } : v
        ));

        setIsDeployModalOpen(false);
    };

    const handleTaskComplete = (taskId) => {
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toLocaleTimeString() } : t
        ));
    };

    if (userRole === 'driver') {
        return <DriverDashboard tasks={tasks} alerts={alerts} vehicles={vehicles} onCompleteTask={handleTaskComplete} />;
    }

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden font-sans text-slate-900 selection:bg-indigo-100">

            <header className="sticky top-0 z-[100] w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
                <div className="h-20 px-10 flex items-center justify-between max-w-[1800px] mx-auto w-full">

                    <div className="flex items-center shrink-0">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition-all group-hover:bg-indigo-700">
                                <Truck size={22} />
                            </div>
                            <div className="hidden sm:flex flex-col leading-tight">
                                <span className="text-sm font-black uppercase tracking-tight">
                                    Fleet<span className="text-indigo-600">OS</span>
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Enterprise</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 max-w-3xl px-16 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by vehicle ID, driver name, or destination..."
                                className="w-full bg-slate-100/80 border-2 border-transparent rounded-2xl py-3 pl-14 pr-6 text-[13px] font-medium transition-all focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-100 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-8 shrink-0">
                        <div className="flex items-center py-2">
                            <QuickActionsBar
                                userRole={userRole}
                                onAction={(actionKey) => {
                                    if (actionKey === 'add_vehicle') setIsOnboardingOpen(true);
                                    if (actionKey === 'assign_task') setIsDeployModalOpen(true); // Connected deploy action
                                }}
                            />
                        </div>

                        <div className="h-8 w-px bg-slate-200" />

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all ${alerts.length > 0
                                    ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
                                    }`}
                            >
                                <Bell size={20} />
                                {alerts.length > 0 && (
                                    <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-4 ring-white" />
                                )}
                            </button>

                            <button
                                onClick={() => setIsDeployModalOpen(true)} // Connected "New Dispatch" Button
                                className="flex h-11 items-center gap-3 rounded-2xl bg-slate-900 px-6 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200/50 active:scale-95"
                            >
                                <ClipboardList size={16} />
                                <span>New Dispatch</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-14 px-10 border-t border-slate-100 bg-white/50">
                    <div className="max-w-[1800px] mx-auto h-full flex items-center">
                        <nav className="flex items-center gap-2">
                            <NavButton active={activeView === 'map'} onClick={() => setActiveView('map')} icon={<MapIcon size={16} />} label="Live Tracking" />
                            <NavButton active={activeView === 'fleet'} onClick={() => setActiveView('fleet')} icon={<Truck size={16} />} label="Registry" />
                            <NavButton active={activeView === 'intelligence'} onClick={() => setActiveView('intelligence')} icon={<LayoutDashboard size={16} />} label="Analytics" />
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden">
                <div className={`absolute inset-0 transition-opacity duration-500 ${activeView === 'map' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    <FleetMap vehicles={vehicles} tasks={tasks} />
                </div>

                {activeView === 'fleet' && (
                    <div className="absolute inset-0 bg-white overflow-y-auto p-10 z-20">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Fleet Registry</h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">{filteredVehicles.length} Units Online</span>
                            </div>
                            <VehicleList vehicles={filteredVehicles} />
                        </div>
                    </div>
                )}

                {activeView === 'intelligence' && (
                    <div className="absolute inset-0 bg-[#F1F5F9] overflow-y-auto p-10 z-20">
                        <div className="max-w-[1600px] mx-auto">
                            <FleetAnalytics tasks={tasks} vehicles={vehicles} />
                        </div>
                    </div>
                )}

                {/* ONBOARD MODAL */}
                <OnboardVehicleModal
                    isOpen={isOnboardingOpen}
                    onClose={() => setIsOnboardingOpen(false)}
                    onOnboard={handleOnboardSubmit}
                />

                {/* DEPLOY MODAL (INTEGRATED) */}
                <DeployTaskModal
                    isOpen={isDeployModalOpen}
                    onClose={() => setIsDeployModalOpen(false)}
                    orders={tasks}
                    vehicles={vehicles}
                    onDeploy={handleDeploySubmit}
                />

                {isAlertsOpen && (
                    <div className="absolute top-6 right-10 w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-200 z-[110] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-5 border-b flex justify-between items-center bg-slate-50/80">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-700">Critical Alerts</h4>
                            <button onClick={() => setIsAlertsOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200/50 rounded-xl transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="max-h-[450px] overflow-y-auto">
                            <AlertsPanel alerts={alerts} onDismissAlert={(id) => setAlerts(a => a.filter(i => i.id !== id))} />
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-slate-200 px-10 py-3 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400 z-[80]">
                <div className="flex gap-8">
                    <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Status: Operational</span>
                    <span>Accra, GH // 24.2°C</span>
                </div>
                <span>FleetOS v4.1.2-Enterprise</span>
            </footer>

            <div className="fixed bottom-8 right-8 z-[120]">
                {isChatOpen && (
                    <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden shadow-indigo-200/50 animate-in zoom-in-95 duration-200 origin-bottom-right">
                        <ChatPanel messages={[]} onSendMessage={() => { }} />
                    </div>
                )}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all hover:bg-indigo-700 active:scale-95"
                >
                    {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
                </button>
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${active
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                : 'text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}