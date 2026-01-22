import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ receivedDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const deadline = new Date(new Date(receivedDate).getTime() + 48 * 60 * 60 * 1000);
    const difference = deadline - now;

    if (difference <= 0) {
      return null;
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [receivedDate]);

  if (!timeLeft) {
    return <span className="text-red-500 font-semibold">Expired</span>;
  }

  const isWarning = timeLeft.hours < 1;

  return (
    <span className={`font-mono text-sm font-semibold ${isWarning ? 'text-yellow-500' : 'text-gray-600'}`}>
      {isWarning ? (
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
        </motion.div>
      ) : (
        `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
      )}
    </span>
  );
};

const OrderApproval = ({ initialOrders, onApproveOrder }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const parsedOrders = initialOrders.map(order => ({ ...order, receivedDate: new Date(order.receivedDate) }));
    setOrders(parsedOrders);
  }, [initialOrders]);

  const getOrderRowClass = (order) => {
    const now = new Date();
    const deadline = new Date(order.receivedDate.getTime() + 48 * 60 * 60 * 1000);
    const hoursLeft = (deadline - now) / (1000 * 60 * 60);

    if (hoursLeft <= 0) {
      return 'bg-red-200'; // Expired
    }
    if (hoursLeft < 1) {
      return 'bg-red-100 animate-pulse'; // Nearing expiry
    }
    return ''; // Default
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const date = order.receivedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {});
  };

  const openApprovalModal = (order) => {
    setSelectedOrder(order);
  };

  const closeApprovalModal = () => {
    setSelectedOrder(null);
  };

  const confirmApproval = () => {
    if (selectedOrder) {
      onApproveOrder(selectedOrder.orderId);
      closeApprovalModal();
    }
  };

  const groupedOrders = groupOrdersByDate(orders);
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div>
      {sortedDates.map(date => (
        <div key={date} className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-4">{date}</h2>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Timer</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedOrders[date].map(order => (
                  <tr key={order.orderId} className={`${getOrderRowClass(order)} transition-colors duration-500`}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${ order.priority === 'High' ? 'bg-red-100 text-red-800' : order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800' }`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <CountdownTimer receivedDate={order.receivedDate} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openApprovalModal(order)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-xs sm:text-sm transition duration-300"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md sm:max-w-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Approve Order: {selectedOrder.orderId}</h2>
            <div className="mb-4 text-sm sm:text-base">
              <p><strong>Customer:</strong> {selectedOrder.customer}</p>
              <p><strong>Location:</strong> {selectedOrder.location}</p>
              <p><strong>Priority:</strong> {selectedOrder.priority}</p>
              <p><strong>Received Date:</strong> {selectedOrder.receivedDate.toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md text-sm sm:text-base">
                {selectedOrder.items.map(item => (
                  <li key={item.productId} className="mb-1">
                    {item.quantity} x {item.product} @ GHC{item.price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-2 sm:space-x-4">
              <button onClick={closeApprovalModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 text-xs sm:text-sm rounded">
                Cancel
              </button>
              <button onClick={confirmApproval} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 text-xs sm:text-sm rounded">
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderApproval;
