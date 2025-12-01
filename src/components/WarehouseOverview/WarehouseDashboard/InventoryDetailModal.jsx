// src/components/WarehouseDashboard/InventoryDetailModal.jsx
import React from 'react';

const InventoryDetailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const inboundGoods = [
    { id: 1, name: 'Product A', reason: 'Purchase', date: '2024-07-28' },
    { id: 2, name: 'Product B', reason: 'Return', date: '2024-07-28' },
  ];

  const outboundGoods = [
    { id: 1, name: 'Product C', reason: 'Sale', date: '2024-07-28' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Inventory Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Inbound Goods</h3>
            <div className="overflow-y-auto h-64">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Reason</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inboundGoods.map((item) => (
                    <tr key={item.id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">{item.reason}</td>
                      <td className="px-6 py-4">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Outbound Goods</h3>
            <div className="overflow-y-auto h-64">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product</th>
                    <th scope="col" className="px-6 py-3">Reason</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {outboundGoods.map((item) => (
                    <tr key={item.id} className="bg-white border-b">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">{item.reason}</td>
                      <td className="px-6 py-4">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailModal;
