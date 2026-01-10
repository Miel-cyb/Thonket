// src/components/OrderManagement/OrderManagement.jsx
import React from 'react';
import OrderList from './OrderList';
import Picklist from './Picklist';

const OrderManagement = ({ orders, drivers, onUpdateStatus, onAssignDriver, onSaveDriver }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderList 
          orders={orders} 
          drivers={drivers} 
          onUpdateStatus={onUpdateStatus} 
          onAssignDriver={onAssignDriver}
          onSaveDriver={onSaveDriver} 
        />
        <Picklist orders={orders} onUpdateStatus={onUpdateStatus} />
      </div>
    </div>
  );
};

export default OrderManagement;