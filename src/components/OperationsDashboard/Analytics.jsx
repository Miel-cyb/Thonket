import React, { useState } from 'react';
import OperationalPerformance from '@/components/Analytics/OperationalPerformance';
import Insights from '@/components/Analytics/Insights';
import Forecasting from '@/components/Analytics/ForecastingPerformance';
import RevenueProfit from '@/components/Analytics/Profitability';

// Placeholders for components that need to be created
const VehicleUtilization = () => <div className="p-6 bg-white rounded-lg shadow-md">Vehicle Utilization data will be displayed here.</div>;
const SalesAgentPerformance = () => <div className="p-6 bg-white rounded-lg shadow-md">Sales Agent Performance data will be displayed here.</div>;


const AnalyticsDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = {
        'overview': 'Performance Overview',
        'utilization': 'Vehicle Utilization',
        'insights': 'Customer Insights',
        'forecasting': 'Demand Forecasting',
        'profitability': 'Profitability Analysis',
        'agents': 'Sales Agent Performance'
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OperationalPerformance />;
            case 'utilization':
                return <VehicleUtilization />;
            case 'insights':
                return <Insights />;
            case 'forecasting':
                return <Forecasting />;
            case 'profitability':
                return <RevenueProfit />;
            case 'agents':
                return <SalesAgentPerformance />;
            default:
                return <OperationalPerformance />;
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {Object.entries(tabs).map(([key, name]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`${
                                activeTab === key
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {name}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
