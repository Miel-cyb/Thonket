const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../src/data/ordersData.json');

const readData = () => {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData);
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = (req, res) => {
  const { orderId } = req.params;
  const data = readData();

  const orderIndex = data.orders.findIndex(o => o.orderId === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const [approvedOrder] = data.orders.splice(orderIndex, 1);
  data.warehouse.push(approvedOrder);

  writeData(data);

  res.status(200).json(approvedOrder);
};