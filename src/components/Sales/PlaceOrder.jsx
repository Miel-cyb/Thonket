'use client';

import { useState } from 'react';

//  replace this with a dynamic fetch later
const products = [
  { id: 'P001', name: 'Rice Bag (25kg)', price: 250 },
  { id: 'P002', name: 'Cooking Oil (5L)', price: 150 },
  { id: 'P003', name: 'Milk Powder (1kg)', price: 100 },
  { id: 'P005', name: 'Sugar Bag (50kg)', price: 320 },
];

export default function PlaceOrder({ salesAgentID, onBack }) {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    const quantity = 1; // Default quantity
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

  const handleSubmitOrder = () => {
    // Endpoint logic will be added here later
    alert(`Order placed for ${customerName}!\nTotal: GHS ${total.toFixed(2)}`);
    console.log({ 
        salesAgentID, 
        customer: { name: customerName, contact: customerContact },
        items: cart,
        total
    });
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
            &larr; Back to Dashboard
        </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a New Order</h2>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          className="p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
        <input
          type="text"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          placeholder="Customer Contact (Phone/Email)"
          className="p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        />
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
        disabled={cart.length === 0 || !customerName}
        className="w-full py-3 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
      >
        Submit Order
      </button>
    </div>
  );
}
