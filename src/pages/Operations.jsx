import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});



const TableHeadings = ['Ranking', 'Orders','Assign Orders',
  'Assign Truck',
  'Profit',
  'Total Amount',
  'Distance',
  'Fuel Cost'
]

// Dummy data
const initialOrders = [
  { orderId: "ORD-001", customer: "John Smith", location: "Adum", assignedDriver: "James", status: "In-Transit", failed: false, longStop: false, lat: 6.693, lng: -1.624 },
  { orderId: "ORD-002", customer: "Sarah Johnson", location: "Gyinase", assignedDriver: "Fred", status: "Pending", failed: false, longStop: true, lat: 6.654, lng: -1.620 },
  { orderId: "ORD-003", customer: "Mike Davis", location: "Oforikrom", assignedDriver: "Drake", status: "Delivered", failed: true, longStop: false, lat: 6.672, lng: -1.610 }
];

const returnsData = [
  { orderId: "ORD-004", product: "Basmati", quantity: 1, photo: "/basmati.png" },
  { orderId: "ORD-005", product: "Sardines", quantity: 2, photo: "/sardines.png" }
];

const drivers = ["James", "Fred", "Drake"];

const OperationsManagerPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeSection, setActiveSection] = useState("reassign");

  const handleDriverChange = (orderId, driver) => {
    setOrders(orders.map(o => o.orderId === orderId ? { ...o, assignedDriver: driver } : o));
  };

  const failedDeliveries = orders.filter(o => o.failed);
  const longStops = orders.filter(o => o.longStop);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Operations Dashboard</h1> */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-950" >Refresh</button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          {["reassign","returns","tracking","alerts"].map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-lg font-medium ${activeSection===section ? "bg-cyan-700 text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {section === "reassign" ? "Reassign Deliveries" :
               section === "returns" ? "Returns" :
               section === "tracking" ? "Driver Tracking" : "Alerts"}
            </button>
          ))}
        </div>

        {/* Sections */}
        {activeSection === "reassign" && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 overflow-x-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Reassign Deliveries</h2>
            <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
              <thead className="bg-gray-50">
                <tr>
                  {["Order ID","Customer","Location","Assigned Driver"].map(h => (
                    <th key={h} className="px-4 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.orderId}>
                    <td className="px-4 sm:px-6 py-2 text-gray-900">{order.orderId}</td>
                    <td className="px-4 sm:px-6 py-2 text-gray-600">{order.customer}</td>
                    <td className="px-4 sm:px-6 py-2 text-gray-600">{order.location}</td>
                    <td className="px-4 sm:px-6 py-2">
                      <Select value={order.assignedDriver} onValueChange={(val) => handleDriverChange(order.orderId, val)}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Select Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map(driver => <SelectItem key={driver} value={driver}>{driver}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "returns" && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Returns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {returnsData.map(r => (
                <div key={r.orderId} className="border p-4 rounded-lg bg-gray-50 flex flex-col items-start gap-2">
                  <h3 className="font-semibold text-gray-700">{r.orderId}</h3>
                  <p className="text-sm text-gray-600">Product: {r.product}</p>
                  <p className="text-sm text-gray-600">Quantity: {r.quantity}</p>
                  <img src={r.photo} alt="Damage" className="w-20 h-20 object-cover rounded-md border" />
                  <button className="mt-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Mark Processed</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "tracking" && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6 flex flex-col gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Driver Tracking</h2>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    {["Driver","Current Order","Location","Status"].map(h => (
                      <th key={h} className="px-4 sm:px-6 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(o => (
                    <tr key={o.orderId}>
                      <td className="px-4 sm:px-6 py-2 text-gray-900">{o.assignedDriver}</td>
                      <td className="px-4 sm:px-6 py-2 text-gray-600">{o.orderId}</td>
                      <td className="px-4 sm:px-6 py-2 text-gray-600">{o.location}</td>
                      <td className={`px-4 sm:px-6 py-2 text-sm ${o.status==="In-Transit"?"text-yellow-600":o.status==="Delivered"?"text-green-600":"text-gray-600"}`}>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Map */}
            <div className="h-[300px] sm:h-[400px] w-full mt-4">
              <MapContainer center={[6.67, -1.62]} zoom={12} scrollWheelZoom={false} className="h-full w-full rounded-lg">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                {orders.map(o => (
                  <Marker key={o.orderId} position={[o.lat, o.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <p><strong>{o.assignedDriver}</strong></p>
                        <p>Order: {o.orderId}</p>
                        <p>Status: {o.status}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {activeSection === "alerts" && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Alerts & Failed Deliveries</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {failedDeliveries.map(fd => (
                <div key={fd.orderId} className="border-l-4 border-red-600 p-4 bg-red-50 rounded-lg">
                  <p className="font-semibold text-red-800">{fd.orderId} Failed Delivery</p>
                  <p className="text-sm text-red-700">Customer not reachable</p>
                </div>
              ))}
              {longStops.map(ls => (
                <div key={ls.orderId} className="border-l-4 border-yellow-600 p-4 bg-yellow-50 rounded-lg">
                  <p className="font-semibold text-yellow-800">{ls.orderId} Long Stop</p>
                  <p className="text-sm text-yellow-700">Driver stopped &gt; 2 hours</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OperationsManagerPage;
