import { Truck } from "lucide-react";

const FulfillmentPerformance = () => {
  const metrics = {
    onTime: "92%",
    delayed: "8%",
    avgProcessingTime: "1.4 days",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-blue-600" />
        Fulfillment Performance
      </h3>
      <ul className="space-y-3">
        <li className="flex justify-between">
          <span>On-time Orders</span>
          <span className="font-bold text-green-700">{metrics.onTime}</span>
        </li>
        <li className="flex justify-between">
          <span>Delayed Orders</span>
          <span className="font-bold text-red-600">{metrics.delayed}</span>
        </li>
        <li className="flex justify-between">
          <span>Avg Processing Time</span>
          <span className="font-bold text-gray-900">{metrics.avgProcessingTime}</span>
        </li>
      </ul>
    </div>
  );
};

export default FulfillmentPerformance;
