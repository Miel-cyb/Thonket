// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  

  const rolePages = {
    Warehouse: "/warehouse",
    Sales: "/orders",
    Operations: "/operations",
  };

  const handleSignIn = () => {
    if (role) {
      navigate(rolePages[role]);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - brand + image */}
      <div className="w-1/2 bg-cyan-950 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-bold mb-6">Thonket</h1>
        <p className="text-lg mb-8">Manage your orders, inventory, and operations seamlessly</p>
        <img
          src="/warehouse.png"
          alt="Inventory"
          className="rounded-xl shadow-lg w-4/5"
        />
      </div>

      {/* Right side - sign-in form */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-10 w-3/4 max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Role --</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full bg-cyan-950 text-white py-2 px-4 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
