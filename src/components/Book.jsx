import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const products = [
  { id: 1, name: "Rice Bag", price: 400 },
  { id: 2, name: "Sugar Bag", price: 350 },
  { id: 3, name: "Flour Bag", price: 300 },
  { id: 4, name: "Oil Gallon", price: 250 },
  { id: 5, name: "Salt Bag", price: 100 },
]

const BookOrder = () => {
  const navigate = useNavigate()
  const [customer, setCustomer] = useState("")
  const [location, setLocation] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [items, setItems] = useState([{ productId: "", quantity: 1 }])
  const [currentOrder, setCurrentOrder] = useState(null) // store saved order

  const addItemRow = () => {
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const updateItem = (index, key, value) => {
    const updated = [...items]
    updated[index][key] = value
    setItems(updated)
  }

  const calculateTotal = orderItems =>
    orderItems.reduce((sum, it) => sum + Number(it.price) * Number(it.quantity), 0)

  const handleSubmit = e => {
    e.preventDefault()
    const newOrder = {
      orderId: "ORD-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
      customer,
      location,
      deliveryTime,
      items: items.map(it => {
        const prod = products.find(p => p.id === Number(it.productId))
        return {
          productId: prod.id,
          product: prod.name,
          quantity: Number(it.quantity),
          price: prod.price,
        }
      }),
    }

    // Save to localStorage
    const storedRaw = localStorage.getItem("ordersData_v3")
    const stored = storedRaw ? JSON.parse(storedRaw) : []
    localStorage.setItem("ordersData_v3", JSON.stringify([...stored, newOrder]))

    // Save current order for invoice
    setCurrentOrder(newOrder)

    // Reset form
    setCustomer("")
    setLocation("")
    setDeliveryTime("")
    setItems([{ productId: "", quantity: 1 }])

    // Navigate back after a delay or leave user on page to download invoice
    // navigate("/orders")
  }

  const downloadInvoice = () => {
    if (!currentOrder) return alert("No order to generate invoice!")

    let invoiceText = `Invoice for Order: ${currentOrder.orderId}\n`
    invoiceText += `Customer: ${currentOrder.customer}\n`
    invoiceText += `Location: ${currentOrder.location}\n`
    invoiceText += `Delivery Time: ${new Date(currentOrder.deliveryTime).toLocaleString()}\n\n`
    invoiceText += "Items:\n"
    invoiceText += "---------------------------------\n"
    currentOrder.items.forEach(it => {
      invoiceText += `${it.product} x ${it.quantity} @ ₵${it.price} = ₵${it.price * it.quantity}\n`
    })
    invoiceText += "---------------------------------\n"
    invoiceText += `Total: ₵${calculateTotal(currentOrder.items)}\n`

    // Create a downloadable file
    const blob = new Blob([invoiceText], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${currentOrder.orderId}_invoice.txt`
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">📦 Book New Order</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              required
              value={customer}
              onChange={e => setCustomer(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Kojo Mensah"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium">Delivery Location</label>
            <input
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Accra"
            />
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium">Delivery Time</label>
            <input
              type="datetime-local"
              required
              value={deliveryTime}
              onChange={e => setDeliveryTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium">Items</label>
            {items.map((it, idx) => (
              <div key={idx} className="flex gap-3 mb-2">
                <select
                  required
                  value={it.productId}
                  onChange={e => updateItem(idx, "productId", e.target.value)}
                  className="flex-1 border rounded px-2 py-2"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₵{p.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={e => updateItem(idx, "quantity", e.target.value)}
                  className="w-24 border rounded px-2 py-2"
                />
              </div>
            ))}
            <Button type="button" onClick={addItemRow} className="mt-2">
              + Add Item
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/orders")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800 text-white">
              Save Order
            </Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={downloadInvoice}
            >
              Download Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookOrder
