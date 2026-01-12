"use client";
import { useState } from "react";
import {
  Search,

} from "lucide-react";



const Navbar = ({ onSearch }) => {
  const [searchItem, setSearchItem] = useState("");


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

      
    </header>
  );
};

export default Navbar;
