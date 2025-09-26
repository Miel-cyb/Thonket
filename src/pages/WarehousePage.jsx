import React, { useState } from "react";
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

import { Package, Truck, Boxes, ClipboardList, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import Dashboard from "@/components/WarehouseDashboard/Dashboard";
import InventoryMonitoring from "@/components/InventoryMonitoring/InventoryMonitoring";
import OrderManagement from "@/components/OrderManagement/OrderManagement";
import SupportPage from "@/components/SupportPage";

const WarehousePage = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const subpages = [
    { title: "Dashboard", icon: ClipboardList },
    { title: "Products", icon: Package },
    { title: "Stock", icon: Boxes },
    { title: "Orders", icon: Truck },
    { title: "Support", icon: Users },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar (works on mobile + desktop same way) */}
        <Sidebar className="bg-cyan-950 text-gray-600">
          <SidebarHeader>
            <h1 className="text-xl font-bold px-4">Thonket</h1>
          </SidebarHeader>

          <SidebarContent  >
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600 px-4">
                Application
              </SidebarGroupLabel>
              <SidebarGroupContent >
                <SidebarMenu className='text-gray-600'>
                  {subpages.map((item) => (
                    <SidebarMenuItem key={item.title} className='text-gray-600'>
                      <SidebarItemButton
                        item={item}
                        className="text-gray-600 px-4"
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
            © 2025 Thonket
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex flex-col flex-1">
      
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activePage === "Dashboard" && <Dashboard/>}
            {activePage === "Products" && <Products />}
            {activePage === "Stock" && <InventoryMonitoring/>}
            {activePage === "Orders" && <OrderManagement/>}
            {activePage === "Support" && <SupportPage/>}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

/* Sidebar button component */
/* Sidebar button component */
const SidebarItemButton = ({ item, activePage, setActivePage }) => {
  const { setOpen } = useSidebar(); // only for mobile toggle

  const handleClick = () => {
    setActivePage(item.title);
    // Only close sidebar if screen is small (mobile)
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  };

  return (
    <SidebarMenuButton
      onClick={handleClick}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-md ${
        activePage === item.title
          ? "bg-white text-cyan-800"
          : "text-gray-600 hover:bg-cyan-700"
      }`}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
    </SidebarMenuButton>
  );
};



export default WarehousePage;
