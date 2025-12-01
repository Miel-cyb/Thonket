import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


const DriverTracking = ({ orders }) => {
  return (
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
  );
};

export default DriverTracking;