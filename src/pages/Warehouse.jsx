import { useState } from "react"
import OrdersTable from "@/components/OrderTable"
import ApprovalModal from "@/components/ApprovalModal"
import AnalyticsPanel from "@/components/AnalyticsPanel"

const initialOrders = [
  { orderId: "ORD-001", customer: "Kojo", items: "Rice", quantity: 5, totalPrice: 250, driver: "Yaw", status: "Pending" },
  { orderId: "ORD-002", customer: "Ama", items: "Sugar", quantity: 10, totalPrice: 400, driver: "Kwame", status: "Approved" },
]

const WarehouseManagerDashboard = () => {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [packingNotes, setPackingNotes] = useState("")
  const [estimatedDelivery, setEstimatedDelivery] = useState("")

  const handleApprove = (order) => {
    setSelectedOrder(order)
  }

  const confirmApproval = () => {
    setOrders(orders.map(o =>
      o.orderId === selectedOrder.orderId ? { ...o, status: "Approved" } : o
    ))
    setSelectedOrder(null)
    setPackingNotes("")
    setEstimatedDelivery("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Operations Manager Dashboard</h1>

      <OrdersTable orders={orders} onApprove={handleApprove} />

      <AnalyticsPanel orders={orders} />

      {selectedOrder && (
        <ApprovalModal
          order={selectedOrder}
          packingNotes={packingNotes}
          setPackingNotes={setPackingNotes}
          estimatedDelivery={estimatedDelivery}
          setEstimatedDelivery={setEstimatedDelivery}
          onClose={() => setSelectedOrder(null)}
          onConfirm={confirmApproval}
        />
      )}
    </div>
  )
}

export default WarehouseManagerDashboard
