// components/dashboard/KpiCards.jsx
import { Package, Truck, AlertTriangle, DollarSign } from "lucide-react";

const KpiCards = () => {
  const stats = [
    { label: "Orders to Pack", value: 82, icon: Package },
    { label: "Ready for Dispatch", value: 35, icon: Truck },
    { label: "Stockout Risks", value: 4, icon: AlertTriangle },
    { label: "Inventory Value", value: "GHS 1,280,450", icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-white rounded-lg shadow-md p-4"
        >
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-cyan-900">{stat.value}</p>
          </div>
          <stat.icon className="h-6 w-6 text-gray-400" />
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
