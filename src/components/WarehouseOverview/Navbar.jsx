"use client";
import { useState } from "react";
import {
  Search,
  Menu,
  User,
  LogOut,
  Pencil,
  Home,
  ShoppingCart,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Navbar = ({ onSearch }) => {
  const [searchItem, setSearchItem] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="w-full bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between shadow-sm relative z-20">
      {/* Left Section: Sidebar Trigger + Welcome */}
      <div className="flex items-center gap-4">
        {/* Sidebar (only shows trigger on mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-2 rounded-md hover:bg-gray-100 transition md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-cyan-900">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-4">
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-cyan-900"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-cyan-900"
              >
                <ShoppingCart className="h-4 w-4" />
                Products
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-cyan-900"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Welcome text (hidden on very small screens) */}
        <h2 className="font-semibold text-gray-700 hidden sm:block">
          Welcome, <span className="text-cyan-900">User</span>
        </h2>
      </div>

      {/* Center Section: Search */}
      <div className="flex-1 flex justify-center px-4">
        <div className="flex items-center w-full max-w-md border rounded-lg overflow-hidden">
          <input
            type="search"
            placeholder="Search items..."
            className="flex-1 px-4 py-2 text-sm outline-none"
            value={searchItem}
            onChange={(e) => {
              setSearchItem(e.target.value);
              onSearch?.(e.target.value);
            }}
          />
          <button
            className="bg-cyan-900 text-white px-4 py-2 hover:bg-cyan-800 transition flex items-center"
            onClick={() => onSearch?.(searchItem)}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Right Section: User Profile */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setShowMenu(!showMenu)}
        >
          <User className="h-5 w-5 text-cyan-900" />
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            Profile
          </span>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2 z-50">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Edit Profile clicked")}
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => alert("Logout clicked")}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
