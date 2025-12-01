// src/components/InventoryMonitoring/StockoutRisks.jsx
import React from 'react';

const stockoutRiskProducts = [
  { id: 4, name: 'Cooking Oil (20L)', stock: 60, demand: 20 },
];

const StockoutRisks = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Stockout Risks</h2>
      <ul>
        {stockoutRiskProducts.map((product) => (
          <li key={product.id} className="flex justify-between items-center mb-2">
            <span>{product.name}</span>
            <span className="text-yellow-500">{product.stock} units left (High Demand)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockoutRisks;
