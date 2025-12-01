// src/components/InventoryMonitoring/ReorderAlerts.jsx
import React from 'react';

const lowStockProducts = [
  { id: 2, name: 'Sugar (25kg)', stock: 80, threshold: 100 },
  { id: 4, name: 'Cooking Oil (20L)', stock: 60, threshold: 75 },
];

const ReorderAlerts = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-bold mb-4">Reorder Alerts</h2>
      <ul>
        {lowStockProducts.map((product) => (
          <li key={product.id} className="flex justify-between items-center mb-2">
            <span>{product.name}</span>
            <span className="text-red-500">{product.stock} / {product.threshold}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReorderAlerts;
