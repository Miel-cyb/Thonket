// src/components/WarehouseDashboard/InventorySnapshot.jsx
import React, { useState } from 'react';
import InventoryDetailModal from './InventoryDetailModal';

const InventorySnapshot = ({ date }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inventoryStats = [
    { label: 'Stock Items', value: 1250 },
    { label: 'Low Stock Alerts', value: 15 },
    { label: 'Stock Value', value: '$250,000' },
    { label: 'Storage Capacity', value: '85%' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold">Inventory Snapshot</h2>
          <p className="text-sm text-gray-500">For {date.toDateString()}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          View Details
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {inventoryStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <InventoryDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default InventorySnapshot;
