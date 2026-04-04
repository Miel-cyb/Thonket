import { useState } from "react";

import UsersListPage from "../pages/CustomerPage";
import CreateUserFormPage from "../pages/CreateUserFormPage";
import ManageRolesPage from "../pages/ManageRolesPage";
import EditUserModal from "../components/User/CreateUserForm";

import StaffPage from "../pages/StaffPage";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { Users, UserPlus, Shield, Briefcase } from "lucide-react";

export default function AdminPage() {
  const [activeView, setActiveView] = useState("customers");
  const [modalUser, setModalUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEditModal = (user) => {
    setModalUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalUser(null);
    setModalOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case "customers":
        return <UsersListPage onEdit={openEditModal} />;

      case "staff":
        return <StaffPage />;

      case "create-user":
        return <CreateUserFormPage />;

      case "roles":
        return <ManageRolesPage />;

      default:
        return <UsersListPage onEdit={openEditModal} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50">

        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

        <div className="flex-1 flex flex-col">
          <MobileHeader />

          <main className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-xl font-bold mb-4 capitalize">
              {activeView.replace("-", " ")}
            </h1>

            {renderContent()}
          </main>
        </div>

        {modalOpen && (
          <EditUserModal user={modalUser} onClose={closeModal} />
        )}
      </div>
    </SidebarProvider>
  );
}

/* ================= SIDEBAR ================= */

function AdminSidebar({ activeView, setActiveView }) {
  return (
    <Sidebar>
      <SidebarHeader>Thonket Admin</SidebarHeader>

      <SidebarContent>

        {/* Customers */}
        <SidebarGroup>
          <SidebarGroupLabel>Customers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                icon={Users}
                label="All Customers"
                value="customers"
                {...{ activeView, setActiveView }}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Staff */}
        <SidebarGroup>
          <SidebarGroupLabel>Staff</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                icon={Briefcase}
                label="Staff Overview"
                value="staff"
                {...{ activeView, setActiveView }}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <MenuItem
                icon={UserPlus}
                label="Create User"
                value="create-user"
                {...{ activeView, setActiveView }}
              />
              <MenuItem
                icon={Shield}
                label="Manage Roles"
                value="roles"
                {...{ activeView, setActiveView }}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}

/* ================= MENU ITEM ================= */

function MenuItem({ icon: Icon, label, value, activeView, setActiveView }) {
  const { setOpen } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={activeView === value}
        onClick={() => {
          setActiveView(value);
          setOpen(false);
        }}
      >
        <Icon className="h-4 w-4" />
        {label}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ================= MOBILE HEADER ================= */

function MobileHeader() {
  const { open, setOpen } = useSidebar();

  return (
    <header className="md:hidden bg-[#4400A5] text-white p-4 flex justify-between">
      <span className="font-bold">Admin</span>
      <button onClick={() => setOpen(!open)}>☰</button>
    </header>
  );
}