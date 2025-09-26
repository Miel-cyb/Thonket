 const allordersData = [
    {
      id: "ORD-001",
      customer: "Kwame Mensah",
      items: [
        { sku: "SKU-1001", name: "Rice Bag 50kg", qty: 2 },
        { sku: "SKU-1020", name: "Cooking Oil 25L", qty: 1 },
      ],
      status: "Packed",
      assignedDriver: "Daniel Owusu",
      notes: "Handle with care",
      eta: "2025-09-27 14:30",
    },
    {
      id: "ORD-002",
      customer: "Ama Serwaa",
      items: [
        { sku: "SKU-1005", name: "Flour 25kg", qty: 3 },
        { sku: "SKU-1015", name: "Sugar 50kg", qty: 1 },
      ],
      status: "Confirmed",
      assignedDriver: "Kofi Boateng",
      notes: "Urgent delivery",
      eta: "2025-09-26 16:00",
    },
    {
      id: "ORD-003",
      customer: "Yaw Ofori",
      items: [
        { sku: "SKU-1008", name: "Salt 10kg", qty: 5 },
      ],
      status: "Dispatched",
      assignedDriver: "Akua Addo",
      notes: "Fragile packaging",
      eta: "2025-09-26 12:00",
    },
    {
      id: "ORD-004",
      customer: "Efua Nyarko",
      items: [
        { sku: "SKU-1010", name: "Tomato Paste Box", qty: 10 },
      ],
      status: "Ready for Dispatch",
      assignedDriver: "Kojo Antwi",
      notes: "Deliver before evening",
      eta: "2025-09-27 18:00",
    },
    {
      id: "ORD-005",
      customer: "Josephine Aidoo",
      items: [
        { sku: "SKU-1012", name: "Bottled Water 12x500ml", qty: 4 },
      ],
      status: "Confirmed",
      assignedDriver: "Mabel Asare",
      notes: "Leave at reception",
      eta: "2025-09-28 09:00",
    },
  ];
  
  export default allordersData;