// components/Alerts.jsx
import React from "react";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const criticalIssues = [
    "Stock-out: Oil & Fat in Suame Warehouse",
    "Delayed delivery: Asokwa route",
    "High fuel cost: ₵17,000/week",
    "Customer churn rising: 6% last month",
];

const regionalData = {
    labels: ['Adum', 'Santasi', 'Asokwa', 'Kotei', 'Tafo', 'Nhyiaeso'],
    datasets: [
        {
            label: 'Sales Volume',
            data: [500, 350, 420, 280, 450, 600],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
            label: 'Profit Margin (%)',
            data: [15, 12, 18, 10, 16, 20],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
    ]
};


const Alerts = () => {
    return (
        <div>
            {/* Critical Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700">Critical Issues & Alerts</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {/* KPI Cards */}
                    <div className="bg-red-50 p-4 rounded-lg shadow-inner">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Low Stock</h4>
                        <p className="text-2xl font-bold text-red-600">3 alerts</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow-inner">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">Late Deliveries</h4>
                        <p className="text-2xl font-bold text-yellow-600">5 routes</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg shadow-inner">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">High Fuel Cost</h4>
                        <p className="text-2xl font-bold text-orange-600">₵17,000/wk</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg shadow-inner">
                        <h4 className="text-sm font-semibold mb-2 text-gray-700">High Churn</h4>
                        <p className="text-2xl font-bold text-purple-600">6%</p>
                    </div>
                </div>
                <ul className="list-disc list-inside space-y-2">
                    {criticalIssues.map((issue, index) => (
                        <li key={index} className="text-red-600 font-medium">{issue}</li>
                    ))}
                </ul>
            </div>

            {/* Regional Performance Hotspots */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Regional Performance Hotspots</h3>
                <p className="text-sm text-gray-600 mb-4">Monitor sales volume and profitability by region to identify opportunities and risks.</p>
                <div style={{height: '300px'}}>
                    <Bar 
                        data={regionalData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Regional Sales & Profitability' }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Alerts;
