import { AlertTriangle } from "lucide-react";

const ReorderAlerts = () => {
  const alerts = [
    { sku: "SKU-101", name: "Rice Bag", qty: 12 },
    { sku: "SKU-245", name: "Cooking Oil", qty: 8 },
    { sku: "SKU-412", name: "Flour Bag", qty: 5 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        Reorder Alerts
      </h3>
      <ul className="space-y-3">
        {alerts.map((item) => (
          <li
            key={item.sku}
            className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50"
          >
            <div>
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">{item.sku}</p>
            </div>
            <span className="text-sm font-semibold text-yellow-700">
              {item.qty} left
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReorderAlerts;
