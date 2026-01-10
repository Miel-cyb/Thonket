import React from 'react';
import { ExternalLink, Archive } from 'lucide-react';
import { Badge } from '../../ui/badge';

const OrdersSnapshot = ({ orders, setActivePage, onOrderSelect }) => {
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate))
        .slice(0, 5);

    // Calculate total value from items array
    const calculateOrderTotal = (items) => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="bg-card rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Archive className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-card-foreground">Recent Orders</h2>
                </div>
                <button 
                    onClick={() => setActivePage('Orders')}
                    className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                    View All <ExternalLink className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-1 pt-4">
                <div className="grid grid-cols-4 gap-4 items-center text-xs font-bold text-muted-foreground uppercase px-2 pb-2 border-b border-border">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Status</span>
                    <span className="justify-self-end">Value</span>
                </div>
                {recentOrders.length > 0 ? (
                    recentOrders.map(order => (
                        <div 
                            key={order.orderId} 
                            onClick={() => onOrderSelect(order)}
                            className="grid grid-cols-4 gap-4 items-center text-sm border-b last:border-0 py-2 px-2 border-border rounded-md hover:bg-muted cursor-pointer transition-colors">
                            <span className="font-semibold text-foreground truncate">#{order.orderId}</span>
                            <span className="text-muted-foreground truncate">{order.customer}</span>
                            <Badge variant={order.status === 'Pending' ? 'destructive' : 'outline'}>{order.status}</Badge>
                            <span className="justify-self-end font-medium text-foreground">
                                ${calculateOrderTotal(order.items).toFixed(2)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersSnapshot;
