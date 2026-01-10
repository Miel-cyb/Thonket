import React from 'react';

const InventorySnapshot = ({ products }) => {
  // Calculate the total number of items in stock
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  
  // Calculate the number of items with low stock
  const lowStockAlerts = products.filter(p => p.stock < 10).length;
  
  // Calculate the total value of the stock
  const stockValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

  return (
    <div className="bg-card rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Inventory Snapshot</h2>
        <button className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-2 gap-y-6 flex-grow content-center">
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{totalStockItems}</p>
          <p className="text-sm text-muted-foreground">Stock Items</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">{lowStockAlerts}</p>
          <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">₵{stockValue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Stock Value</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-foreground">85%</p>
          <p className="text-sm text-muted-foreground">Storage Capacity</p>
        </div>
      </div>
    </div>
  );
};

export default InventorySnapshot;
