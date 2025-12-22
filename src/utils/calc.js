import { calculateDistance } from './distance';

export const calculatePriority = (order) => {
  const totalValue = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalMargin = totalValue * 0.2; // Assuming a 20% margin
  const distance = calculateDistance(order.location);

  const priorityScore = totalValue + totalMargin - distance;

  if (priorityScore > 1000) {
    order.priority = 'High';
  } else if (priorityScore > 500) {
    order.priority = 'Medium';
  } else {
    order.priority = 'Low';
  }

  return order;
};
