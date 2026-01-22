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
        <Truck className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" />
        <h3 className="text-md sm:text-lg font-semibold text-gray-600">Live Map View</h3>
        <p className="text-sm text-gray-500 px-4">Real-time GPS tracking will be integrated here.</p>
      </div>

      {/* Driver/Fleet List */}
      <div className="w-full">
        {/* Header for large screens */}
        <div className="hidden md:grid grid-cols-6 gap-x-4 px-4 py-2 bg-gray-50 rounded-t-lg">
          {["Driver", "Vehicle", "Current Order", "Location & Destination", "ETA / Distance", "Status"].map(h => (
            <div key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {/* Driver data cards/rows */}
        <div className="space-y-4 md:space-y-0">
          {driversData.map(driver => (
            <div key={driver.id} className="md:grid md:grid-cols-6 md:gap-x-4 p-4 md:px-4 md:py-3 bg-white rounded-lg shadow-md md:shadow-none md:border-b md:rounded-none">
              {/* Driver */}
              <div className="flex justify-between items-center md:block">
                <span className="text-sm font-medium text-gray-500 md:hidden">Driver</span>
                <span className="text-sm text-gray-900 font-medium">{driver.name}</span>
              </div>
              {/* Vehicle */}
              <div className="flex justify-between items-center md:block mt-2 md:mt-0">
                <span className="text-sm font-medium text-gray-500 md:hidden">Vehicle</span>
                <span className="text-sm text-gray-600">{driver.vehicle}</span>
              </div>
              {/* Order ID */}
              <div className="flex justify-between items-center md:block mt-2 md:mt-0">
                <span className="text-sm font-medium text-gray-500 md:hidden">Order ID</span>
                <span className="text-sm text-gray-600">{driver.orderId}</span>
              </div>
              {/* Location */}
              <div className="flex justify-between items-center md:block mt-2 md:mt-0">
                <span className="text-sm font-medium text-gray-500 md:hidden">Location</span>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <div>
                    <div>{driver.location}</div>
                    {driver.status === 'In-Transit' && <div className="text-xs text-gray-500">to {driver.destination}</div>}
                  </div>
                </div>
              </div>
              {/* ETA */}
              <div className="flex justify-between items-center md:block mt-2 md:mt-0">
                <span className="text-sm font-medium text-gray-500 md:hidden">ETA</span>
                {driver.status === 'In-Transit' ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <div>
                      <div>{driver.eta} mins</div>
                      <div className="text-xs text-gray-500">{driver.distance} km away</div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">N/A</span>
                )}
              </div>
              {/* Status */}
              <div className="flex justify-between items-center md:block mt-4 md:mt-0">
                <span className="text-sm font-medium text-gray-500 md:hidden">Status</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  driver.status === 'In-Transit' ? 'bg-blue-100 text-blue-800' :
                  driver.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {driver.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriverTracking;
