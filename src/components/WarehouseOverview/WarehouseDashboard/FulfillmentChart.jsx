import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Helper to get the start of the week (Sunday)
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

const FulfillmentChart = ({ orders, date }) => {
  const startOfWeek = getStartOfWeek(date);

  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dayString = day.toISOString().split('T')[0];
    
    const dailyOrders = orders.filter(o => o.deliveryDate === dayString);
    const onTime = dailyOrders.filter(o => new Date(o.deliveryDate) <= new Date(o.expectedDeliveryDate)).length;
    
    const percentage = dailyOrders.length > 0 ? (onTime / dailyOrders.length) * 100 : 100; // Default to 100% if no orders
    
    return {
      name: day.toLocaleDateString('en-US', { weekday: 'short' }),
      value: Math.round(percentage),
    };
  });

  return (
    <div className="bg-card rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <input type="checkbox" checked readOnly className="h-4 w-4 rounded text-primary focus:ring-primary border-muted-foreground"/>
        <h2 className="text-lg font-semibold ml-2 text-card-foreground">Weekly Fulfillment Performance</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Percentage of orders fulfilled on time this week.</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={weekData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} tickCount={6} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))"
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4, fill: "#8B5CF6" }} activeDot={{ r: 6 }} name="On-time Fulfillment" unit="%" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FulfillmentChart;
