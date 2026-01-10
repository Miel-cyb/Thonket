import React from 'react';
import { Eye, Truck, Box, CheckCircle } from 'lucide-react';

const KPIsCards = ({ orders }) => {

  const kpis = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: Eye,
    },
    {
      title: 'Pending Orders',
      value: orders.filter(o => o.status === 'Pending').length,
      icon: Truck,
    },
    {
      title: 'Packed Orders',
      value: orders.filter(o => o.status === 'Packed').length,
      icon: Box,
    },
    {
      title: 'Dispatched Orders',
      value: orders.filter(o => o.status === 'Dispatched').length,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-card rounded-lg shadow-md p-4 flex items-center">
          <div className={`p-3 rounded-lg mr-4 bg-primary/10`}>
            <kpi.icon className={`h-6 w-6 text-primary`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{kpi.title}</p>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIsCards;
