import React from "react";

/**
 * PicklistModal
 * Props:
 *   order (object)
 *   onClose ()
 */
const PicklistModal = ({ order, onClose }) => {
  if (!order) return null;

  const downloadPicklist = () => {
    const lines = [
      `Picklist for Order: ${order.id}`,
      `Customer: ${order.customer}`,
      `Date: ${order.date}`,
      "",
      "Items:",
      ...order.items.map((it) => `- ${it.name} (${it.sku}) x ${it.qty}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.id}-picklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-40 p-4">
      <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-2">Picklist — {order.id}</h3>
        <p className="text-sm text-gray-600 mb-4">Customer: {order.customer}</p>

        <div className="space-y-2 mb-4">
          {order.items.map((it) => (
            <div key={it.sku} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">{it.sku}</div>
              </div>
              <div className="text-sm font-semibold">x {it.qty}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={downloadPicklist}
            className="bg-cyan-900 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
          >
            Download Picklist
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-md border">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PicklistModal;
