import { XCircle } from "lucide-react";

const StockoutRisks = () => {
  const risks = [
    { sku: "SKU-301", name: "Sugar Bag", status: "Critical" },
    { sku: "SKU-522", name: "Salt Pack", status: "Critical" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <XCircle className="h-5 w-5 text-red-600" />
        Stockout Risks
      </h3>
      {risks.length > 0 ? (
        <ul className="space-y-3">
          {risks.map((item) => (
            <li
              key={item.sku}
              className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">{item.sku}</p>
              </div>
              <span className="text-sm font-semibold text-red-700">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No risks detected ✅</p>
      )}
    </div>
  );
};

export default StockoutRisks;
