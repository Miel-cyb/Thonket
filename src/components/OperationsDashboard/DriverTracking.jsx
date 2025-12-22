import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react'; // Import icons

const DriverTracking = () => {
  // Mock data for drivers and their fleet, will be replaced by API data
  const driversData = [
    {
      id: "driver-001",
      name: "Alex",
      vehicle: "Van-01 (Toyota Hiace)",
      orderId: "ORD-006",
      location: "Santasi",
      status: "In-Transit",
      destination: "Adum",
      distance: 10, // in km
      eta: 15, // in minutes
    },
    {
      id: "driver-002",
      name: "Ben",
      vehicle: "Truck-02 (Ford Transit)",
      orderId: "ORD-008",
      location: "Ayigya",
      status: "In-Transit",
      destination: "Kejetia",
      distance: 5,
      eta: 8,
    },
    {
      id: "driver-003",
      name: "Chris",
      vehicle: "Van-03 (Mercedes Sprinter)",
      orderId: "N/A",
      location: "Warehouse",
      status: "Idle",
      destination: "N/A",
      distance: null,
      eta: null,
    },
    {
      id: "driver-004",
      name: "David",
      vehicle: "Truck-01 (Isuzu N-Series)",
      orderId: "ORD-002",
      location: "Gyinase",
      status: "Delivered",
      destination: "Gyinase",
      distance: 0,
      eta: 0,
    },
    {
      id: "driver-005",
      name: "Grace",
      vehicle: "Van-02 (Toyota Hiace)",
      orderId: "ORD-011",
      location: "Kotei",
      status: "In-Transit",
      destination: "Atonsu",
      distance: 3,
      eta: 5,
    }
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Live Driver and Fleet Tracking</h2>

      {/* Map Placeholder */}
      <div className="mb-6 bg-gray-200 rounded-lg h-64 sm:h-96 flex flex-col items-center justify-center text-center">
        <Truck className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Live Map View</h3>
        <p className="text-gray-500">Real-time GPS tracking will be integrated here.</p>
      </div>

      {/* Driver/Fleet List */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              {["Driver", "Vehicle", "Current Order", "Location & Destination", "ETA / Distance", "Status"].map(h => (
                <th key={h} className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {driversData.map(driver => (
              <tr key={driver.id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{driver.name}</div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{driver.vehicle}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{driver.orderId}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                            <div>{driver.location}</div>
                            {driver.status === 'In-Transit' && <div className="text-xs text-gray-500">to {driver.destination}</div>}
                        </div>
                    </div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">
                  {driver.status === 'In-Transit' ? (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                            <div>{driver.eta} mins</div>
                            <div className="text-xs text-gray-500">{driver.distance} km away</div>
                        </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    driver.status === 'In-Transit' ? 'bg-blue-100 text-blue-800' :
                    driver.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {driver.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverTracking;
