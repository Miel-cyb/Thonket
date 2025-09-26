import { Package } from "lucide-react";

const StockOverview = () => {
  const stockData = [
    { label: "Total SKUs", value: 240 },
    { label: "Inbound", value: 56 },
    { label: "Outbound", value: 72 },
    { label: "Available", value: 112 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-cyan-800" />
        Stock Overview
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {stockData.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-start bg-gray-50 rounded-lg p-3"
          >
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className="text-xl font-bold text-cyan-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockOverview;
