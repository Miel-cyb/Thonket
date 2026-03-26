import React, { useState, useEffect, useCallback } from "react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, useSidebar,
} from "@/components/ui/sidebar";
import {
  Menu, Package, Truck, Boxes, ClipboardList,
  BarChart, LayoutDashboard, Loader2, Settings
} from "lucide-react";

// Components
import Products from "@/components/WarehouseOverview/Products";
import Dashboard from "@/components/WarehouseOverview/WarehouseDashboard/Dashboard";
import StockControl from "@/components/WarehouseOverview/StockControl";
import OrderManagement from "@/components/WarehouseOverview/OrderManagement/OrderManagement";
import SupportPage from "@/components/WarehouseOverview/SupportPage";
import UserMenu from "@/components/UserMenu";

// Styles & Data
import initialDrivers from "@/data/drivers.json";

const API_BASE_URL = "https://thonket-product-price-service.onrender.com/api";

const WarehouseManagerPortal = ({ products, setProducts, reports, onReportSubmit }) => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Optimized Fetching logic
  const fetchWarehouseData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch orders from your specific endpoint
      const response = await fetch(`${API_BASE_URL}/warehouse`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const initializedOrders = data.map(o => ({
        ...o,
        status: o.status || 'Pending',
        driver: o.driver || null
      }));

      setOrders(initializedOrders);
      setDrivers(initialDrivers);
    } catch (error) {
      console.error('Portal Data Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouseData();
  }, [fetchWarehouseData]);

  // Handler for state updates
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAssignDriver = (orderId, driverId) => {
    setOrders(prev => prev.map(order =>
      order.orderId === orderId ? { ...order, driver: String(driverId), status: "Approved" } : order
    ));
  };

  const subpages = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Products", icon: Package },
    // { title: "Pricing", icon: PriceTag },
    { title: "Stock", icon: Boxes },
    { title: "Orders", icon: Truck },
    { title: "Reporting", icon: BarChart },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F8FAFC]">
        {/* Sidebar with refined styling */}
        <Sidebar className="border-r border-slate-200 shadow-xl bg-white/50 backdrop-blur-md">
          <SidebarHeader className="py-6 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <Boxes className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">Thonket</h1>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 px-4">
                Main Menu
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

          <SidebarFooter className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
              <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700">Admin Portal</span>
                <span className="text-[10px] text-slate-400">Manage Warehouse</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col min-w-0">
          <Header activePage={activePage} />

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                  <p className="text-slate-400 text-sm animate-pulse">Synchronizing Inventory...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                {activePage === "Dashboard" && <Dashboard orders={orders} drivers={drivers} date={date} setDate={setDate} setActivePage={setActivePage} products={products} reports={reports} />}
                {activePage === "Products" && <Products products={products} setProducts={setProducts} />}
                {activePage === "Stock" && <StockControl products={products} setProducts={setProducts} />}
                {activePage === "Orders" && <OrderManagement orders={orders} drivers={drivers} onUpdateStatus={handleUpdateOrderStatus} onAssignDriver={handleAssignDriver} onSaveDriver={handleAssignDriver} />}
                {activePage === "Reporting" && <SupportPage onReportSubmit={onReportSubmit} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

// --- Sub-components for Cleanliness ---

const Header = ({ activePage }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm px-8">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden p-2 hover:bg-slate-50 rounded-lg">
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">{activePage}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Live Connection</span>
          <span className="text-[9px] text-slate-400">render-api-service</span>
        </div>
        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

const SidebarItemButton = ({ item, activePage, setActivePage }) => {
  const { setOpenMobile } = useSidebar();
  const isActive = activePage === item.title;

  const handleClick = () => {
    setActivePage(item.title);
    setOpenMobile(false);
  };

  return (
    <SidebarMenuButton
      onClick={handleClick}
      isActive={isActive}
      className={`relative h-11 px-4 mb-1 transition-all rounded-xl ${isActive
        ? "bg-primary/10 text-primary shadow-sm font-semibold"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
    >
      <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
      <span className="ml-3">{item.title}</span>
      {isActive && (
        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
      )}
    </SidebarMenuButton>
  );
};

export default WarehouseManagerPortal;