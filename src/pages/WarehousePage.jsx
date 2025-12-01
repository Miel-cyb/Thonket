import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { Menu, Package, Truck, Boxes, ClipboardList, BarChart } from "lucide-react";
import Products from "@/components/WarehouseOverview/Products";
import Dashboard from "@/components/WarehouseOverview/WarehouseDashboard/Dashboard";
import StockControl from "@/components/WarehouseOverview/StockControl";
import OrderManagement from "@/components/WarehouseOverview/OrderManagement/OrderManagement";
import SupportPage from "@/components/WarehouseOverview/SupportPage";
import initialOrders from "@/data/orders.json";
import initialDrivers from "@/data/drivers.json";

const WarehouseManagerPortal = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const resetOrders = initialOrders.map(o => ({ ...o, status: 'Pending', driver: null }));
    setOrders(resetOrders);
    localStorage.setItem('orders', JSON.stringify(resetOrders));
    setDrivers(initialDrivers);
  }, []);

  const updateOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    updateOrders(updatedOrders);
  };

  const handleAssignDriver = (orderId, driverId) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, driver: String(driverId), status: "Approved" } : order
    );
    updateOrders(updatedOrders);
  };

  const handleSaveDriver = (orderId, driverId) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId ? { ...order, driver: driverId } : order
    );
    updateOrders(updatedOrders);
  };

  const subpages = [
    { title: "Dashboard", icon: ClipboardList },
    { title: "Products", icon: Package },
    { title: "Stock", icon: Boxes },
    { title: "Orders", icon: Truck },
    { title: "Reporting", icon: BarChart },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <h1 className="text-xl font-bold px-4 text-white">Thonket</h1>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                Application
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {subpages.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarItemButton
                        item={item}
                        activePage={activePage}
                        setActivePage={setActivePage}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 text-sm text-gray-300">
            ©{new Date().getFullYear()} Thonket
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <MobileHeader />
          <div className="flex-1 overflow-y-auto p-6">
            {activePage === "Dashboard" && <Dashboard orders={orders} drivers={drivers} date={date} setDate={setDate} setActivePage={setActivePage} />}
            {activePage === "Products" && <Products />}
            {activePage === "Stock" && <StockControl />}
            {activePage === "Orders" && <OrderManagement orders={orders} drivers={drivers} onUpdateStatus={handleUpdateOrderStatus} onAssignDriver={handleAssignDriver} onSaveDriver={handleSaveDriver} />}
            {activePage === "Reporting" && <SupportPage />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

const MobileHeader = () => {
  const { open, setOpen } = useSidebar();
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center md:hidden">
      <h1 className="text-xl font-bold text-[#4400A5]">Thonket</h1>
      <button onClick={() => setOpen(!open)}>
        <Menu className="h-6 w-6 text-[#4400A5]" />
      </button>
    </header>
  );
};

const SidebarItemButton = ({ item, activePage, setActivePage }) => {
  const { setOpen } = useSidebar();

  const handleClick = () => {
    setActivePage(item.title);
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <SidebarMenuButton
      onClick={handleClick}
      isActive={activePage === item.title}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
    </SidebarMenuButton>
  );
};

export default WarehouseManagerPortal;