import React from "react";

/**
 * DelayAlerts
 * Props:
 *   orders (array)
 *   onSendEmail(orderId)
 *   onAssignDriver(orderId, driverName)
 */
const DelayAlerts = ({ orders, onSendEmail, onAssignDriver }) => {
  const delayed = orders.filter((o) => o.status === "Delayed");

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Delay Alerts</h3>
        <div className="text-sm text-gray-500">{delayed.length} delayed</div>
      </div>

      {delayed.length === 0 ? (
        <div className="text-sm text-gray-500">No delayed orders ✅</div>
      ) : (
        <div className="space-y-3">
          {delayed.map((o) => (
            <div key={o.id} className="flex items-center justify-between border rounded p-2">
              <div>
                <div className="font-medium">{o.id} — {o.customer}</div>
                <div className="text-xs text-gray-500">{o.notes || "Delay detected"}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const driver = prompt("Assign driver name for this order:");
                    if (driver) onAssignDriver(o.id, driver);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Assign Driver
                </button>

                <button
                  onClick={() => onSendEmail(o.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Send E-post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DelayAlerts;
