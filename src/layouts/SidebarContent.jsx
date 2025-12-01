import React from "react";
import { BarChart, Package, ShoppingCart, Users } from "lucide-react";
import {
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../components/ui/sidebar";

const SidebarContent = () => {
  const [active, setActive] = React.useState("Dashboard");

  return (
    <>
      <SidebarHeader>
        <h2 className="text-xl font-bold">Warehouse</h2>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={active === "Dashboard"}
              onClick={() => setActive("Dashboard")}
            >
              <BarChart className="h-5 w-5" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={active === "Orders"}
              onClick={() => setActive("Orders")}
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={active === "Inventory"}
              onClick={() => setActive("Inventory")}
            >
              <Package className="h-5 w-5" />
              Inventory
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Teams</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={active === "Employees"}
              onClick={() => setActive("Employees")}
            >
              <Users className="h-5 w-5" />
              Employees
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
};

export default SidebarContent;
