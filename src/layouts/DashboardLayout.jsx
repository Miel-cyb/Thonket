import React from "react";
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  useSidebar,
} from "../components/ui/sidebar";
import SidebarContent from "./SidebarContent";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarContent />
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const Header = () => {
  const { setOpen } = useSidebar();
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md md:hidden">
      <button onClick={() => setOpen(true)} className="md:hidden">
        <Menu />
      </button>
      <h1 className="text-lg font-bold">Dashboard</h1>
    </header>
  );
};

export default DashboardLayout;
