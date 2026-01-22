'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function OrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const orderResponse = await fetch(`${API_URL}/orders/${orderId}`);
      if (!orderResponse.ok) throw new Error('Failed to fetch order details');
      const orderData = await orderResponse.json();
      setOrder(orderData);

      const itemsResponse = await fetch(`${API_URL}/order-items/order/${orderId}`);
      if (!itemsResponse.ok) throw new Error('Failed to fetch order items');
      const itemsData = await itemsResponse.json();
      setItems(itemsData);
    } catch (err) {
      setError('Could not load order details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_URL}/order-items/${itemId}?orderId=${orderId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete item.');
        }

        fetchOrderDetails();
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    }
  };

  const handleUpdateQuantity = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/order-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity.');
      }

      setEditingItemId(null);
      fetchOrderDetails();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };
  
  const handleApproveOrder = async () => {
    try {
      const response = await fetch(`/api/approve-order/${orderId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to approve order.');
      }

      fetchOrderDetails();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setNewQuantity(item.quantity);
  };


  if (loading) return <p className="text-center p-8">Loading order details...</p>;
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>;
  if (!order) return <p className="text-center p-8">No order data found.</p>;

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Order List
      </button>

      {/* Order Header */}
      <div className="mb-8 border-b pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Order #{order._id}</h2>
            <p className="text-gray-500 mt-1">
              Date: {new Date(order.createdAt).toLocaleDateString()} | Status: {order.status}
            </p>
          </div>
          {order.status !== 'APPROVED' && (
            <button 
              onClick={handleApproveOrder}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-semibold"
            >
              Approve Order
            </button>
          )}
        </div>
      </div>

      {/* Customer & Order Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Customer Information</h3>
          <p><strong>Name:</strong> {order.customer?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {order.customer?.contactInfo.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {order.customer?.contactInfo.phone || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h3>
          <p><strong>Total Amount:</strong> GHS {order.totalAmount.toFixed(2)}</p>
          <p><strong>Order Type:</strong> {order.type}</p>
          <p><strong>Sales Agent:</strong> {order.salesAgent?.username || 'N/A'}</p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Items in this Order</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white ">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Product Name</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Subtotal</th>
                <th className="text-center py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b">
                  <td className="py-3 px-4">{item.productName}</td>
                  <td className="py-3 px-4 text-right">
                    {editingItemId === item._id ? (
                      <input 
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="w-20 text-right p-1 border rounded"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">GHS {item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">GHS {(item.price * item.quantity).toFixed(2)}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {editingItemId === item._id ? (
                      <button onClick={() => handleUpdateQuantity(item._id)} className="text-green-600 hover:underline font-semibold">Save</button>
                    ) : (
                      <button onClick={() => handleEditClick(item)} className="text-blue-600 hover:underline font-semibold">Edit</button>
                    )}
                    <button onClick={() => handleDeleteItem(item._id)} className="text-red-600 hover:underline font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
