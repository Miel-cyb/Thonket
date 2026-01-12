import React, { useState } from 'react';
import KPIsCards from './KPIsCards';
import OrdersSnapshot from './OrdersSnapshot';
import InventorySnapshot from './InventorySnapshot';
import FulfillmentChart from './FulfillmentChart';
import AwaitingPickup from './Awaitingpickup';
import UserMenu from '@/components/UserMenu';

const Dashboard = ({ orders, drivers, setActivePage, products }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (e) => {
    setDate(new Date(e.target.value));
  };

  // Flatten the products data to make it easier to work with
  const flattenedProducts = products.flatMap(p =>
    p.sizes.map(s => ({
      ...p,
      size: s.name,
      stock: s.stock,
      price: s.price,
      id: `${p.id}-${s.name}`,
    }))
  );

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <header className="flex justify-end p-4 border-b">
        <UserMenu />
      </header>

      <div className="flex justify-end">
        <input
            type="date"
            value={date.toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="rounded-md border p-2 bg-card text-card-foreground"
        />
      </div>

      <KPIsCards orders={orders} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersSnapshot orders={orders} setActivePage={setActivePage} />
        <InventorySnapshot products={flattenedProducts} />
      </div>
      
      <FulfillmentChart orders={orders} date={date} />
      <AwaitingPickup orders={orders} drivers={drivers} />

    </div>
  );
};

export default Dashboard;
