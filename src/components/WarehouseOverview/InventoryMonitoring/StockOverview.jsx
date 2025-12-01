// src/components/InventoryMonitoring/StockOverview.jsx
import React from 'react';

const products = [
  { id: 1, name: 'Rice (50kg)', category: 'Grains', stock: 120, location: 'A101' },
  { id: 2, name: 'Sugar (25kg)', category: 'Sweeteners', stock: 80, location: 'A102' },
  { id: 3, name: 'Flour (50kg)', category: 'Baking', stock: 150, location: 'B201' },
  { id: 4, name: 'Cooking Oil (20L)', category: 'Oils', stock: 60, location: 'B202' },
  { id: 5, name: 'Canned Tomatoes', category: 'Canned Goods', stock: 200, location: 'C301' },
];

const StockOverview = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Stock Overview</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Stock</th>
              <th className="py-2 px-4 border-b">Location</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.stock}</td>
                <td className="py-2 px-4 border-b">{product.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOverview;
