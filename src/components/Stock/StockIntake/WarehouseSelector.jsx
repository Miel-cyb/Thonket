import React from "react";

/**
 * WarehouseSelector
 * Premium layout drop-selector context block matching your enterprise dashboard cards.
 */
const WarehouseSelector = ({ selectedWarehouse, onChange }) => {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Label styled with a crisp small text variant */}
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
        Warehouse
      </label>

      {/* Select input wrapping an interactive focus border state */}
      <div className="relative">
        <select
          className="appearance-none bg-gray-50 text-sm font-bold text-gray-800 px-3 py-1.5 pr-8 rounded border border-gray-300 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer min-w-[160px]"
          value={selectedWarehouse}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="kumasi">Kumasi Main</option>
          <option value="accra">Accra Hub</option>
          <option value="takoradi">Takoradi Depot</option>
        </select>

        {/* Customized subtle custom select chevron pointer drop icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WarehouseSelector;