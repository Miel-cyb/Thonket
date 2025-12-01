// src/components/InventoryMonitoring/InventoryMonitoring.jsx
import React from 'react';
import StockOverview from './StockOverview';
import ReorderAlerts from './ReorderAlerts';
import StockoutRisks from './StockoutRisks';

const InventoryMonitoring = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventory & Supply Chain Monitoring</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockOverview />
        <div>
          <ReorderAlerts />
          <StockoutRisks />
        </div>
      </div>
    </div>
  );
};

export default InventoryMonitoring;
