import React, { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"

// Expanded Products JSON
const productsJSON = [
  { id: 1, name: "Rice Bag (50kg)", price: 400 },
  { id: 2, name: "Sugar Bag (25kg)", price: 350 },
  { id: 3, name: "Flour Bag (25kg)", price: 300 },
  { id: 4, name: "Vegetable Oil (25L)", price: 250 },
  { id: 5, name: "Salt Bag (20kg)", price: 100 },
  { id: 6, name: "Tinned Tomatoes (Carton)", price: 200 },
  { id: 7, name: "Milk Powder (10kg)", price: 450 },
  { id: 8, name: "Mackerel (Carton)", price: 500 },
  { id: 9, name: "Milo (Carton)", price: 600 },
  { id: 10, name: "Spaghetti (Carton)", price: 280 },
  { id: 11, name: "Detergent Powder (Carton)", price: 350 },
  { id: 12, name: "Bottled Water (Pack)", price: 50 },
]

// Commercial Orders
const seedOrders = [
  {
    orderId: "ORD-001",
    customer: "Kojo Mensah",
    location: "Accra",
    deliveryTime: "2025-09-20 14:00",
    items: [
      { productId: 1, product: "Rice Bag (50kg)", quantity: 20, price: 400 },
      { productId: 2, product: "Sugar Bag (25kg)", quantity: 15, price: 350 },
      { productId: 4, product: "Vegetable Oil (25L)", quantity: 10, price: 250 },
    ],
  },
  {
    orderId: "ORD-002",
    customer: "Ama Owusu",
    location: "Kumasi",
    deliveryTime: "2025-09-21 09:30",
    items: [
      { productId: 3, product: "Flour Bag (25kg)", quantity: 25, price: 300 },
      { productId: 6, product: "Tinned Tomatoes (Carton)", quantity: 12, price: 200 },
    ],
  },
  {
    orderId: "ORD-003",
    customer: "Abdul Rahman",
    location: "Tamale",
    deliveryTime: "2025-09-21 12:00",
    items: [
      { productId: 1, product: "Rice Bag (50kg)", quantity: 50, price: 400 },
      { productId: 5, product: "Salt Bag (20kg)", quantity: 30, price: 100 },
    ],
  },
  {
    orderId: "ORD-004",
    customer: "Esi Dankwa",
    location: "Takoradi",
    deliveryTime: "2025-09-22 10:15",
    items: [
      { productId: 7, product: "Milk Powder (10kg)", quantity: 8, price: 450 },
      { productId: 9, product: "Milo (Carton)", quantity: 6, price: 600 },
    ],
  },
  {
    orderId: "ORD-005",
    customer: "Kwame Boateng",
    location: "Cape Coast",
    deliveryTime: "2025-09-22 15:00",
    items: [
      { productId: 8, product: "Mackerel (Carton)", quantity: 20, price: 500 },
      { productId: 10, product: "Spaghetti (Carton)", quantity: 18, price: 280 },
    ],
  },
  {
    orderId: "ORD-006",
    customer: "Adwoa Serwaa",
    location: "Sunyani",
    deliveryTime: "2025-09-23 11:45",
    items: [
      { productId: 11, product: "Detergent Powder (Carton)", quantity: 25, price: 350 },
      { productId: 12, product: "Bottled Water (Pack)", quantity: 100, price: 50 },
    ],
  },
  {
    orderId: "ORD-007",
    customer: "Yaa Asantewaa",
    location: "Koforidua",
    deliveryTime: "2025-09-23 14:30",
    items: [
      { productId: 2, product: "Sugar Bag (25kg)", quantity: 40, price: 350 },
      { productId: 4, product: "Vegetable Oil (25L)", quantity: 15, price: 250 },
    ],
  },
  {
    orderId: "ORD-008",
    customer: "Kwesi Appiah",
    location: "Ho",
    deliveryTime: "2025-09-24 09:00",
    items: [
      { productId: 6, product: "Tinned Tomatoes (Carton)", quantity: 30, price: 200 },
      { productId: 9, product: "Milo (Carton)", quantity: 10, price: 600 },
    ],
  },
  {
    orderId: "ORD-009",
    customer: "Akua Afriyie",
    location: "Bolgatanga",
    deliveryTime: "2025-09-24 13:45",
    items: [
      { productId: 1, product: "Rice Bag (50kg)", quantity: 60, price: 400 },
      { productId: 3, product: "Flour Bag (25kg)", quantity: 40, price: 300 },
      { productId: 5, product: "Salt Bag (20kg)", quantity: 20, price: 100 },
    ],
  },
  {
    orderId: "ORD-010",
    customer: "Kofi Adu",
    location: "Accra",
    deliveryTime: "2025-09-25 16:00",
    items: [
      { productId: 7, product: "Milk Powder (10kg)", quantity: 15, price: 450 },
      { productId: 10, product: "Spaghetti (Carton)", quantity: 25, price: 280 },
      { productId: 12, product: "Bottled Water (Pack)", quantity: 200, price: 50 },
    ],
  },
]

const historyOptions = ["All", "Day", "Week", "Month"]
const LOCAL_STORAGE_KEY = "ordersData_v3"

const OrdersTable = ({ orders }) => {
 
  
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Order ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Location</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Delivery Time</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Qty</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            order.items.map((item, idx) => (
              <tr key={`${order.orderId}-${idx}`} className="border-t">
                {idx === 0 && (
                  <>
                    <td rowSpan={order.items.length} className="px-4 py-2 text-sm text-gray-800">
                      {order.orderId}
                    </td>
                    <td rowSpan={order.items.length} className="px-4 py-2 text-sm text-gray-800">
                      {order.customer}
                    </td>
                    <td rowSpan={order.items.length} className="px-4 py-2 text-sm text-gray-800">
                      {order.location}
                    </td>
                    <td rowSpan={order.items.length} className="px-4 py-2 text-sm text-gray-800">
                      {new Date(order.deliveryTime).toLocaleString()}
                    </td>
                  </>
                )}
                <td className="px-4 py-2 text-sm text-gray-800">{item.product}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{item.quantity}</td>
                <td className="px-4 py-2 text-sm text-gray-800">₵ {item.price}</td>
                <td className="px-4 py-2 text-sm text-gray-800">₵ {item.price * item.quantity}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  )
}

const AllOrders = () => {
  const { agentID } = useParams()
  const agent = agentID || "001"
  const navigate = useNavigate()

  const [ordersData, setOrdersData] = useState([])
  const [historyFilter, setHistoryFilter] = useState("All")
  const [searchText, setSearchText] = useState("")

  // Load + seed localStorage
  useEffect(() => {
    const storedRaw = localStorage.getItem(LOCAL_STORAGE_KEY)
    const stored = storedRaw ? JSON.parse(storedRaw) : []
    if (stored.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seedOrders))
      setOrdersData(seedOrders)
    } else {
      setOrdersData(stored)
    }
  }, [])

  // Persist data
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ordersData))
  }, [ordersData])

  const calculateTotalPrice = items =>
    items.reduce((acc, it) => acc + Number(it.price) * Number(it.quantity), 0)

  // Filter orders
  const today = new Date()
  const filteredOrders = useMemo(() => {
    let list = ordersData.slice()

    list = list.filter(order => {
      if (historyFilter === "All") return true
      const diffDays = Math.floor((today - new Date(order.deliveryTime)) / (1000 * 60 * 60 * 24))
      if (historyFilter === "Day") return diffDays === 0
      if (historyFilter === "Week") return diffDays <= 7
      if (historyFilter === "Month") return diffDays <= 30
      return true
    })

    if (searchText.trim()) {
      const txt = searchText.toLowerCase()
      list = list.filter(
        o =>
          o.customer.toLowerCase().includes(txt) ||
          o.orderId.toLowerCase().includes(txt) ||
          o.location.toLowerCase().includes(txt)
      )
    }

    return list.sort((a, b) => new Date(b.deliveryTime) - new Date(a.deliveryTime))
  }, [ordersData, historyFilter, searchText, today])

  const totals = useMemo(
    () => ({
      totalOrders: filteredOrders.length,
      totalValue: filteredOrders.reduce((acc, o) => acc + calculateTotalPrice(o.items), 0),
    }),
    [filteredOrders]
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-950 mb-2">Orders</h1>
              <p className="text-gray-600">
                Commercial warehouse order management — amounts in ₵ (Ghana cedis)
              </p>
              <div className="mt-3 flex gap-3 text-sm">
                <div className="bg-gray-100 rounded px-3 py-1">
                  Orders shown: <strong>{totals.totalOrders}</strong>
                </div>
                <div className="bg-gray-100 rounded px-3 py-1">
                  Total value: <strong>₵ {totals.totalValue.toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                placeholder="Search by customer, orderId, or location"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="px-3 py-2 border rounded-md"
              />
              <button 
                className="bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded-md font-semibold"
                onClick={() => navigate("/book-order")}
              >
                + Book New Order
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <select
              onChange={e => setHistoryFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              {historyOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} orders
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrdersTable orders={filteredOrders} />

        <div className="mt-6 text-sm text-gray-600">
          Each order is tied to a customer, with delivery location & time.
        </div>
      </div>
    </div>
  )
}

export default AllOrders
