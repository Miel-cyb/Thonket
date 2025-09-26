// components/dashboard/InventorySnapshot

const levels = [
    { product: "Rice", stock: 120 },
    { product: "Oil", stock: 80 },
    { product: "Milk", stock: 45 },
    { product: "Sardines", stock: 20 },
  ];
  
  const InventorySnapshot = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">📊 Inventory Levels</h2>
        <div className="space-y-3">
          {levels.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.product}</span>
              <span className="text-sm text-gray-600">{item.stock} units</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default InventorySnapshot;
  