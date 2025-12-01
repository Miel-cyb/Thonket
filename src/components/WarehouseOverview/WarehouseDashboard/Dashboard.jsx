import React from 'react';
import KPIsCards from './KPIsCards';
import OrdersSnapshot from './OrdersSnapshot';
import InventorySnapshot from './InventorySnapshot';
import FulfillmentChart from './FulfillmentChart';
import AwaitingPickup from './Awaitingpickup';

const Dashboard = ({ orders, drivers, date, setDate, setActivePage }) => {
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate.toDateString() === date.toDateString();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="flex justify-end mb-4">
          <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            className="rounded-md border p-2"
          />
        </div>
        <KPIsCards orders={orders} />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <OrdersSnapshot orders={orders} date={date} setActivePage={setActivePage} />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <InventorySnapshot date={date} />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <FulfillmentChart />
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <AwaitingPickup orders={orders} drivers={drivers} />
      </div>
    </div>
  );
};

export default Dashboard;
