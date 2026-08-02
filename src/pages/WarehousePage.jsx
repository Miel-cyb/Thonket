import React, { useState, useEffect, useCallback } from "react";
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
import {
  Menu,
  Truck,
  Boxes,
  Calendar,
  PackagePlus,
  LayoutDashboard,
  Loader2,
  Settings,
} from "lucide-react";

// Components
import Dashboard from "@/components/WarehouseOverview/WarehouseDashboard/Dashboard";
import StockControl from "@/components/WarehouseOverview/StockControl";
import OrderManagement from "@/components/WarehouseOverview/OrderManagement/OrderManagement";
import ExpectedDeliveriesPage from "@/pages/ExpectedDelivery";
import ReceivingDeliveriesPage from "@/pages/InboundDeliveryPage";
import UserMenu from "@/components/UserMenu";

// Styles & Data
import initialDrivers from "@/data/drivers.json";

const API_BASE_URL = "https://thonket-product-price-service.onrender.com/api";

const WarehouseManagerPortal = ({
  products = [],
  setProducts = () => { },
  reports = [],
  onReportSubmit = () => { },
}) => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Optimized Fetching logic
  const fetchWarehouseData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/warehouse`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      const initializedOrders = (Array.isArray(data) ? data : []).map((o) => ({
        ...o,
        status: o.status || "Pending",
        driver: o.driver || null,
      }));

      setOrders(initializedOrders);
      setDrivers(initialDrivers || []);
    } catch (error) {
      console.error("Portal Data Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouseData();
  }, [fetchWarehouseData]);

  // Handlers for state updates
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleAssignDriver = (orderId, driverId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId
          ? { ...order, driver: String(driverId), status: "Approved" }
          : order
      )
    );
  };

  // Updated Subpages: Removed "Products" & "Reporting", updated delivery labels
  const subpages = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Stock", icon: Boxes },
    { title: "Orders", icon: Truck },
    { title: "Inbound Schedule", icon: Calendar },
    { title: "Goods Receiving", icon: PackagePlus },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 shadow-xl bg-white/50 backdrop-blur-md">
          <SidebarHeader className="py-6 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                <Boxes className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Thonket
              </h1>
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
            <UserMenu />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header activePage={activePage} />

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                  <p className="text-slate-400 text-sm animate-pulse">
                    Synchronizing Inventory...
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
                {activePage === "Dashboard" && (
                  <Dashboard
                    orders={orders}
                    drivers={drivers}
                    date={date}
                    setDate={setDate}
                    setActivePage={setActivePage}
                    products={products}
                    reports={reports}
                  />
                )}
                {activePage === "Stock" && (
                  <StockControl products={products} setProducts={setProducts} />
                )}
                {activePage === "Orders" && (
                  <OrderManagement
                    orders={orders}
                    drivers={drivers}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onAssignDriver={handleAssignDriver}
                    onSaveDriver={handleAssignDriver}
                  />
                )}
                {activePage === "Inbound Schedule" && <ExpectedDeliveriesPage />}
                {activePage === "Goods Receiving" && <ReceivingDeliveriesPage />}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

// --- Helper Components ---

const Header = ({ activePage }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 p-4 flex justify-between items-center shadow-sm px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="md:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
          {activePage}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
              Live Connection
            </span>
          </div>
          <span className="text-[9px] text-slate-400">render-api-service</span>
        </div>
        <button
          type="button"
          aria-label="Settings"
          className="p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer rounded-lg hover:bg-slate-50"
        >
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
    if (setOpenMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuButton
      onClick={handleClick}
      isActive={isActive}
      className={`relative h-11 px-4 mb-1 transition-all rounded-xl cursor-pointer ${isActive
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