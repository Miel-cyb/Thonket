export const calculateOrderProfit = (order) => {
    return order.items.reduce((acc, item) => {
      const profit = (item.sellingPrice - item.costPrice) * item.quantity;
      return acc + profit;
    }, 0);
  };
  
  export const calculateAnalytics = (orders) => {
    let totalRevenue = 0;
    let totalProfit = 0;
    let projectedProfit = 0;
  
    orders.forEach(order => {
      order.items.forEach(item => {
        totalRevenue += item.sellingPrice * item.quantity;
      });
  
      const profit = calculateOrderProfit(order);
      totalProfit += profit;
  
      if (order.status === "Pending" || order.status === "Confirmed") {
        projectedProfit += profit;
      }
    });
  
    return { totalRevenue, totalProfit, projectedProfit };
  };
  