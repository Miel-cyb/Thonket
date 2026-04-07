'use client';

import React, { useState } from 'react';
import {
    Zap, Play, Pause, AlertTriangle
} from 'lucide-react';

// ✅ PRE-START COMPONENTS
import DriverManifestPanel from '../components/fleet/drivers/DriverManifestPanel';
import DriverItemVerification from '../components/fleet/drivers/DrvierItemVerification';
import DriverTaskList from '../components/fleet/drivers/DriverTaskList';

// ✅ IN-TRANSIT COMPONENTS
import DriverMap from '../components/fleet/drivers/DriverMap';
import DriverChat from '../components/fleet/drivers/DriverChat';

// ✅ POST / SHARED
import DriverAlerts from '../components/fleet/drivers/DriverAlerts';
import DriverHistory from '../components/fleet/drivers/DriverHistory';
import DriverQuickActions from '../components/fleet/drivers/DriverQuickActions';

export default function DriverDashboard({
    tasks = [],
    alerts = [],
    messages = [],
    vehicles = [],
    onCompleteTask,
    onReportIssue,
    onSendMessage
}) {

    // 🔥 STATE MACHINE
    const [viewState, setViewState] = useState('PRE_START');
    const [isPaused, setIsPaused] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // FILTER TASKS
    const driverTasks = tasks.filter(t => t.assignedToDriver);
    const activeTasks = driverTasks.filter(t => t.status !== 'completed');
    const completedTasks = driverTasks.filter(t => t.status === 'completed');

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 space-y-6">

            {/* ================= HEADER ================= */}
            <header className="flex justify-between bg-white p-6 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-600 p-3 rounded-xl text-white">
                        <Zap />
                    </div>
                    <div>
                        <h1 className="font-black text-xl">
                            {viewState === 'PRE_START' ? 'Loading Dock' : 'In Transit'}
                        </h1>
                        <p className="text-xs text-gray-400">
                            {viewState === 'PRE_START'
                                ? 'Verify items before departure'
                                : 'Live tracking active'}
                        </p>
                    </div>
                </div>

                <DriverQuickActions />
            </header>

            {/* ================= PRE-START FLOW ================= */}
            {viewState === 'PRE_START' && (
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* LEFT: MANIFEST */}
                    <div className="lg:col-span-7 space-y-6">

                        <DriverManifestPanel tasks={activeTasks} />

                        <DriverItemVerification
                            tasks={activeTasks}
                            isVerified={isVerified}
                            onVerify={() => setIsVerified(true)}
                        />

                    </div>

                    {/* RIGHT: TASKS + START */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="bg-white p-6 rounded-3xl">
                            <h2 className="font-bold mb-4">
                                Assigned Deliveries
                            </h2>

                            <DriverTaskList tasks={activeTasks} />
                        </div>

                        <button
                            disabled={!isVerified}
                            onClick={() => setViewState('IN_TRANSIT')}
                            className="w-full py-5 bg-black text-white rounded-3xl font-bold disabled:opacity-30"
                        >
                            Start Journey
                        </button>

                    </div>

                </div>
            )}

            {/* ================= IN-TRANSIT ================= */}
            {viewState === 'IN_TRANSIT' && (
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* MAP */}
                    <div className="lg:col-span-8 relative">
                        <div className="h-[500px] bg-gray-200 rounded-3xl overflow-hidden">
                            <DriverMap tasks={activeTasks} vehicles={vehicles} />
                        </div>

                        {/* CONTROLS */}
                        <div className="absolute bottom-6 w-full flex justify-center">
                            <div className="bg-white p-3 rounded-full flex gap-3 shadow">

                                <button
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="px-4 py-2 bg-black text-white rounded-full"
                                >
                                    {isPaused ? <Play /> : <Pause />}
                                </button>

                                <button
                                    onClick={() => onReportIssue?.('Driver reported issue')}
                                    className="px-4 py-2 bg-red-500 text-white rounded-full"
                                >
                                    <AlertTriangle />
                                </button>

                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-white p-4 rounded-3xl">
                            <h3 className="font-bold mb-2">
                                Upcoming Stops
                            </h3>

                            <DriverTaskList
                                tasks={activeTasks}
                                onCompleteTask={onCompleteTask}
                            />
                        </div>

                        <div className="bg-black text-white rounded-3xl p-4">
                            <DriverChat
                                messages={messages}
                                onSendMessage={onSendMessage}
                            />
                        </div>

                    </div>

                </div>
            )}

            {/* ================= HISTORY + ALERTS (LOCKED UNTIL START) ================= */}
            {viewState === 'IN_TRANSIT' && (
                <footer className="grid lg:grid-cols-3 gap-6">

                    <DriverAlerts alerts={alerts} />

                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl">
                        <h2 className="font-bold flex justify-between">
                            Delivery History
                            <span className="text-green-600 text-xs">
                                {completedTasks.length} completed
                            </span>
                        </h2>

                        <DriverHistory tasks={completedTasks} />
                    </div>

                </footer>
            )}

        </div>
    );
}