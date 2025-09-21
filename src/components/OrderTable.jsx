import { Button } from "@/components/ui/button"
import { ordersData } from "@/data/ordersData"

// Helper to get status badge styles
const getStatusStyle = (status) => {
  switch(status) {
    case "Pending": return "bg-yellow-100 text-yellow-800"
    case "Approved": return "bg-blue-100 text-blue-800"
    case "Ready to Ship": return "bg-cyan-100 text-cyan-800"
    case "Shipped": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

// Helper to get priority badge styles
const getPriorityStyle = (priority) => {
  switch(priority) {
    case "HIGH": return "bg-red-600 text-white"
    case "MEDIUM": return "bg-orange-500 text-white"
    case "LOW": return "bg-green-500 text-white"
    default: return "bg-gray-300 text-gray-800"
  }
}

const OrdersTable = ({ orders, onApprove }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Items</th>
            <th className="px-4 py-3 text-left">Quantity</th>
            <th className="px-4 py-3 text-left">Total Price</th>
            <th className="px-4 py-3 text-left">Profit</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Assigned Driver</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Estimated Delivery</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ordersData.map((order, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-semibold">{order.orderId}</td>
              <td className="px-4 py-3">{order.customer}</td>
              <td className="px-4 py-3">{order.items}</td>
              <td className="px-4 py-3">{order.quantity}</td>
              <td className="px-4 py-3 font-bold">₵ {order.totalPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-green-700 font-medium">₵ {order.profit.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityStyle(order.priority)}`}>
                  {order.priority}
                </span>
              </td>
              <td className="px-4 py-3">{order.driver || "Unassigned"}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-3">{order.estimatedDelivery}</td>
              <td className="px-4 py-3 space-y-1">
                {order.status === "Pending" && (
                  <Button size="sm" onClick={() => onApprove(order)}>Approve</Button>
                )}
                {order.status === "Approved" && (
                  <Button size="sm" variant="outline" disabled>Ready</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable
