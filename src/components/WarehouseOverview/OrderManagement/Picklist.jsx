// src/components/OrderManagement/Picklist.jsx
import React, { useState } from 'react';

const Picklist = ({ orders }) => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (orderId) => {
    setActiveModal(orderId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const downloadPicklist = (order) => {
    let printableContent = `
      <html>
        <head>
          <title>Pick List for Order #${order.orderId}</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1, h2, p { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 2rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 2rem; text-align: center; font-size: 0.8rem; color: #888; }
          </style>
        </head>
        <body>
          <h1>Pick List</h1>
          <h2>Order #${order.orderId}</h2>
          <p>Customer: ${order.customerName}</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Aisle/Bin</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.location}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([printableContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `picklist-order-${order.orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Order Picklists</h2>
      <div className="overflow-y-auto h-96">
        {orders.map(order => (
          <div key={order.orderId} className="p-4 mb-4 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-bold">{order.orderId}</p>
                <p className="text-sm text-gray-500">{order.customerName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${{
                  Pending: 'bg-yellow-200 text-yellow-800',
                  Approved: 'bg-blue-200 text-blue-800',
                  Packed: 'bg-green-200 text-green-800',
                  Dispatched: 'bg-gray-200 text-gray-800',
                }[order.status]}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-end">
                <button 
                  onClick={() => openModal(order.orderId)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  View Picklist
                </button>
            </div>

            {activeModal === order.orderId && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                  <h3 className="text-xl font-bold mb-4">Picklist for {order.orderId}</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center mb-2">
                        <span>{item.name}</span>
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-gray-500">Location: {item.location}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      onClick={() => downloadPicklist(order)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Download Picklist
                    </button>
                    <button 
                      onClick={closeModal}
                      className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Picklist;
