// components/dashboard/FulfillmentChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", performance: 95 },
  { day: "Tue", performance: 96 },
  { day: "Wed", performance: 88 },
  { day: "Thu", performance: 97 },
  { day: "Fri", performance: 98 },
  { day: "Sat", performance: 100 },
  { day: "Sun", performance: 96 },
];

const FulfillmentChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-1">📈 Daily Fulfillment Performance</h2>
      <p className="text-sm text-gray-500 mb-4">
        Percentage of orders fulfilled on time vs. target.
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" />
          <YAxis domain={[50, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="performance" stroke="#7c3aed" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FulfillmentChart;
