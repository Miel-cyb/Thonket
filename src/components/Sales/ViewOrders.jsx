'use client';

// replace this with a dynamic fetch later
const mockOrders = [
  {
    id: 'ORD-001',
    customerName: 'Kofi Anan',
    date: '2023-10-26',
    total: 350.00,
    status: 'Delivered'
  },
  {
    id: 'ORD-002',
    customerName: 'Ama Serwaa',
    date: '2023-10-25',
    total: 150.00,
    status: 'Pending'
  },
    {
    id: 'ORD-003',
    customerName: 'Femi Adenuga',
    date: '2023-10-24',
    total: 520.50,
    status: 'Delivered'
  },
];

export default function ViewOrders({ salesAgentID, onBack }) {
  //  fetch orders for the specific salesAgentID
  return (
    <div className="w-full mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <button onClick={onBack} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold">
            &larr; Back to Dashboard
        </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Order History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-sm">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
              <th className="text-right py-3 px-4 font-semibold text-sm">Total (GHS)</th>
               <th className="text-center py-3 px-4 font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customerName}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4 text-right">{order.total.toFixed(2)}</td>
                <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
