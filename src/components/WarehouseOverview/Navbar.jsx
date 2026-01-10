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
      
        {/* Welcome text (hidden on very small screens) */}
        <h2 className="font-semibold text-gray-700 hidden sm:block">
          Welcome, <span className="text-cyan-900">User</span>
        </h2>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 max-w-xs mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchItem}
            onChange={(e) => {
              setSearchItem(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 border-transparent focus:border-cyan-500 focus:bg-white focus:ring-0 transition"
          />
        </div>
      </div>

      {/* Right Section: User Profile */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setShowMenu(!showMenu)}
              >
                <User className="h-5 w-5 text-cyan-900" />
                <span className="hidden lg:inline text-sm font-medium text-cyan-700">
                  Profile
                </span>
              </button>

        {/* User Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-30">
            <div className="p-2">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 transition"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700 transition"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
              <div className="my-1 border-t"></div>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 text-sm transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
