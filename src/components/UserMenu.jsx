import { useState, useEffect } from "react";
import { User, Pencil, Settings, LogOut } from "lucide-react";
import { getCurrentUser, logoutUser } from "../admin/api/authService";

export default function UserMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = () => {
    logoutUser();
    
    window.location.href = "/";
  };

  return (
    <div className="relative">
     
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        onClick={() => setShowMenu(!showMenu)}
      >
        <User className="h-5 w-5 text-cyan-900" />
        {user && (
          <span className="hidden lg:inline text-sm font-medium text-cyan-700">
            {user.email}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50">
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

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 text-sm w-full text-left transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
