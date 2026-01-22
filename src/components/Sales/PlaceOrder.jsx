'use client';

import { useState, useEffect, useCallback } from 'react';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

const products = [
  { id: 'P001', name: 'Rice Bag (25kg)', sku: 'SKU001', price: 250 },
  { id: 'P002', name: 'Cooking Oil (5L)', sku: 'SKU002', price: 150 },
  { id: 'P003', name: 'Milk Powder (1kg)', sku: 'SKU003', price: 100 },
  { id: 'P005', name: 'Sugar Bag (50kg)', sku: 'SKU004', price: 320 },
];

export default function PlaceOrder({ salesAgentID, onBack }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [cart, setCart] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCustomers = useCallback(async () => {
    if (!salesAgentID) return;
    try {
      const response = await fetch(`${API_URL}/customers?salesAgentId=${salesAgentID}`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
      alert('Could not load customers. Please try again.');
    }
  }, [salesAgentID]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddToCart = (product) => {
    const quantity = 1;
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmitOrder = async () => {
    if (!selectedCustomerId) {
      alert('Please select a customer.');
      return;
    }
    if (cart.length === 0) {
      alert('Please add items to the cart.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Create the order
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          salesAgentId: salesAgentID,
          type: 'CASH',
          totalAmount: total,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order.');
      }

      const orderData = await orderResponse.json();
      const orderId = orderData._id;

      // Step 2: Add items to the order
      for (const item of cart) {
        await fetch(`${API_URL}/order-items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            productName: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
          }),
        });
      }

      alert('Order placed successfully!');
      onBack(); // Go back to the dashboard
    } catch (error) {
      console.error(error);
      alert(`Error placing order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a New Order</h2>

      {/* Customer Selection */}
      <div className="mb-8">
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Select a Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name} - {customer.contactInfo.phone}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg text-center">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">GHS {product.price.toFixed(2)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 w-full py-2 px-4 rounded-md font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart View */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5">
            {cart.map((item) => (
              <li key={item.id} className="mb-2 flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right font-bold text-xl">
          Total: GHS {total.toFixed(2)}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmitOrder}
        disabled={cart.length === 0 || !selectedCustomerId || isSubmitting}
        className="w-full py-3 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? 'Placing Order...' : 'Submit Order'}
      </button>
    </div>
  );
}
