// components/dashboard/AwaitingPickup.jsx
const orders = [
    { id: "ORD-121", status: "Late", driver: "Esi Prah" },
    { id: "ORD-127", status: "Late", driver: "Esi Prah" },
    { id: "ORD-103", status: "Due", driver: "Adjoa Yeboah" },
    { id: "ORD-118", status: "Due", driver: "Adjoa Yeboah" },
    { id: "ORD-115", status: "On Time", driver: "Esi Prah" },
  ];
  
  const AwaitingPickup = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">📦 Awaiting Pickup</h2>
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b last:border-0 pb-2"
            >
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  order.status === "Late"
                    ? "bg-red-100 text-red-600"
                    : order.status === "Due"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {order.status}
              </span>
              <span className="text-sm font-medium">{order.id}</span>
              <span className="text-sm text-gray-600">{order.driver}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default AwaitingPickup;
  