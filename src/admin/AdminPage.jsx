import { useState } from "react";
import UsersListPage from "./UsersListPage";
import CreateUserPage from "./CreateUserPage";
import ManageRolesPage from "./ManageRolesPage";
import EditUserModal from "./components/EditUserModal"
import StaffList from "./pages/StaffList"
import CreateStaff from "./pages/CreateStaff"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { Users, UserPlus, Search, Shield } from "lucide-react";

export default function AdminPage() {
  const [activeView, setActiveView] = useState("users");
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
      case "view staff":
        return <StaffList />;
      case "add staff":
          return <CreateStaff />;
      case "create":
        return <CreateUserPage />;
      case "roles":
        return <ManageRolesPage />;
        case "edit":
        return <ManageRolesPage />;
      default:
        return <UsersListPage  onEdit={openEditModal}/>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col">
          <MobileHeader />
          <main className="flex-1 p-6 overflow-y-auto">
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



function AdminSidebar({ activeView, setActiveView }) {
  return (
    <Sidebar className="bg-white text-black">
      <SidebarHeader className="p-4 font-bold text-lg">
        Thonket Admin
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <MenuItem icon={Users} label="View Users" value="users" {...{ activeView, setActiveView }} />
          <MenuItem icon={Users} label="View Staff" value="view staff" {...{ activeView, setActiveView }} />
          <MenuItem icon={Users} label="Add Staff" value="add staff" {...{ activeView, setActiveView }} />
          <MenuItem icon={UserPlus} label="Create User" value="create" {...{ activeView, setActiveView }} />
          <MenuItem icon={Shield} label="Manage Roles" value="roles" {...{ activeView, setActiveView }} />
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

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
        className={'text-black data-[active=true]:bg-white/20 data-[active=true]:text-white/20 '}
      >
        <Icon className="h-4 w-4" />
        {label}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}



function MobileHeader() {
  const { open, setOpen } = useSidebar();

  return (
    <header className="md:hidden bg-[#4400A5] text-white p-4 flex justify-between">
      <span className="font-bold">Admin</span>
      <button onClick={() => setOpen(!open)}>☰</button>
    </header>
  );
}
