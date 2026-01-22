'use client';

import { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = 'https://thonket-sales-order-system.onrender.com';

export default function PlaceOrder({ salesAgentID, onBack }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  
  const [products, setProducts] = useState([]);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
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
      alert('Could not load customers.');
    }
  }, [salesAgentID]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert('Could not load products.');
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, [fetchCustomers, fetchProducts]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const generateInvoice = () => {
    if (!selectedCustomer) return;
    const doc = new jsPDF();
    doc.text('Invoice', 20, 20);
    doc.text(`Customer: ${selectedCustomer.name}`, 20, 30);
    doc.text(`Phone: ${selectedCustomer.contactInfo.phone}`, 20, 40);
    doc.text(`Email: ${selectedCustomer.contactInfo.email || 'N/A'}`, 20, 50);

    doc.autoTable({
      startY: 60,
      head: [['Product', 'Quantity', 'Price', 'Total']],
      body: cart.map(item => [
        item.name,
        item.quantity,
        `GHS ${item.price.toFixed(2)}`,
        `GHS ${(item.price * item.quantity).toFixed(2)}`
      ]),
    });

    doc.text(`Total: GHS ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`invoice_${selectedCustomer.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSubmitOrder = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer.');
      return;
    }
    if (cart.length === 0) {
      alert('Please add items to the cart.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer._id,
          salesAgentId: salesAgentID,
          type: 'CASH',
          totalAmount: total,
          products: cart.map(p => ({ product: p._id, quantity: p.quantity, price: p.price })),
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to create order.');

      alert('Order placed successfully!');
      generateInvoice(); 
      onBack();
    } catch (error) {
      console.error(error);
      alert(`Error placing order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer._id.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
        &larr; Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a New Order</h2>

      {/* Customer Selection */}
      <div className="mb-8 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Select a Customer</h3>
        <div className="relative">
            <input
              type="text"
              placeholder="Search customer by name or ID..."
              value={customerSearchTerm}
              onChange={(e) => {
                setCustomerSearchTerm(e.target.value);
                setSelectedCustomer(null);
              }}
              className="p-3 w-full border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {customerSearchTerm && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer._id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setCustomerSearchTerm(customer.name);
                    }}
                    className="p-3 hover:bg-purple-100 cursor-pointer"
                  >
                    {customer.name} - {customer.contactInfo.phone}
                  </li>
                ))}
              </ul>
            )}        </div>
        {selectedCustomer && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-bold text-green-800">Customer Selected:</h4>
            <p className="text-gray-700">{selectedCustomer.name}</p>
            <p className="text-gray-600 text-sm">{selectedCustomer.contactInfo.phone}</p>
            <p className="text-gray-600 text-sm">{selectedCustomer.contactInfo.email}</p>
          </div>
        )}
      </div>

      {/* Product Search and List */}
      <div className="mb-8 p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add Products to Order</h3>
        <input
          type="text"
          placeholder="Search for a product..."
          value={productSearchTerm}
          onChange={(e) => setProductSearchTerm(e.target.value)}
          className="p-3 w-full border border-gray-300 rounded-md mb-4"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-80 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg text-center">
              <h4 className="font-semibold">{product.name}</h4>
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
      </div>

      {/* Cart and Submission */}
      <div className="p-6 border rounded-lg">
        <h3 className="text-2xl font-semibold mb-4">Review Order</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="list-disc pl-5 mb-4">
            {cart.map((item) => (
              <li key={item._id} className="mb-2 flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 text-right font-bold text-xl mb-6">
          Total: GHS {total.toFixed(2)}
        </div>
        <div className="flex justify-end gap-4">
            <button
                onClick={handleSubmitOrder}
                disabled={cart.length === 0 || !selectedCustomer || isSubmitting}
                className="py-3 px-6 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
                {isSubmitting ? 'Placing Order...' : 'Submit Order'}
            </button>
            <button
                onClick={generateInvoice}
                disabled={cart.length === 0 || !selectedCustomer}
                className="py-3 px-6 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
                Download Invoice
            </button>
        </div>
      </div>
    </div>
  );
}
