import { Package, Truck, CheckCircle, ClipboardList } from "lucide-react";

const OrdersSnapshot = () => {
  const ordersData = [
    { label: "Confirmed", value: 120, icon: ClipboardList, color: "bg-blue-100 text-blue-700" },
    { label: "Packed", value: 80, icon: Package, color: "bg-yellow-100 text-yellow-700" },
    { label: "Dispatched", value: 45, icon: Truck, color: "bg-orange-100 text-orange-700" },
    { label: "Delivered", value: 200, icon: CheckCircle, color: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4">Orders Snapshot</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ordersData.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center p-4 rounded-lg border hover:shadow transition"
          >
            <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
            <span className="font-bold text-lg">{item.value}</span>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSnapshot;
