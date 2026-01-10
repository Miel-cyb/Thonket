import React from 'react';

const AwaitingPickup = ({ orders, drivers }) => {
  const awaitingPickupOrders = orders.filter((o) => o.status === "Packed");

  return (
      <div className="bg-card rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-card-foreground">🚚 Awaiting Pickup</h2>
        <div className="space-y-4">
         {awaitingPickupOrders.length > 0 ? (
           awaitingPickupOrders.map((order) => {
             const driver = drivers.find(d => d.id === order.driver);
             return (
               <div
                 key={order.orderId}
                 className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 items-center border-b last:border-0 pb-3 border-border"
               >
                 <div className="col-span-1">
                   <p className="text-sm font-semibold text-foreground">{order.orderId}</p>
                   <p className="text-xs text-muted-foreground">{order.customerName}</p>
                 </div>
                 <div className="col-span-1 text-center sm:text-left">
                   <p className="text-sm font-medium text-foreground truncate">
                     {driver ? driver.name : 'Not Assigned'}
                   </p>
                 </div>
                 <div className="col-span-1 flex justify-end">
                    <span className="text-sm text-muted-foreground truncate">
                        {driver ? driver.plate : ''}
                    </span>
                 </div>
               </div>
             );
           })
         ) : (
           <p className="text-center text-muted-foreground py-4">No orders are awaiting pickup.</p>
         )}
        </div>
      </div>
    );
  };
  
export default AwaitingPickup;
