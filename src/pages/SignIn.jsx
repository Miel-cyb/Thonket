
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {loginUser, getCurrentUser} from "../admin/api/authService"

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser({ email, password }); 
      const user = await getCurrentUser();  

      switch (user.role.toLowerCase()) {
        case "ceo":
          navigate("/ceo-analytics");
          break;
        case "sales":
          navigate("/orders");
          break;
        case "operations":
          navigate("/operations");
          break;
        case "inventory":
          navigate("/inventory");
          break;
      }

    } catch (err) {
      console.error(err);
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="w-1/2 bg-[#4400A5] text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-5xl font-bold mb-6">Thonket</h1>
        <p className="text-lg mb-8">Manage your orders, inventory, and operations seamlessly</p>
        <img src="/warehouse.png" alt="Inventory" className="rounded-xl shadow-lg w-4/5" />
      </div>

      {/* Right side */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-gray-50">
        <div className="bg-white shadow-lg rounded-xl p-10 w-3/4 max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign In</h2>
          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6B22A5] text-white py-2 rounded-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
