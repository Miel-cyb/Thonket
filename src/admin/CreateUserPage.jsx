import { useState } from "react";
import { createUser } from "./api/usersApi";

export default function CreateUserPage({ onDone }) {
  
  const [form, setForm] = useState({
    name: "",
    role: "",
    
  });
  const authId = "TEMP_AUTH_ID";
  
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.role ) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await createUser(...form, authId,);
      alert("User created successfully");
      onDone();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md border p-6 rounded">
      <h2 className="text-xl font-bold text-[#4400A5] mb-4">
        Create User
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="border p-2"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="">Select role</option>
          <option value="CUSTOMER">Customer</option>
          <option value="SALES_AGENT">Sales Agent</option>
          <option value="OPERATIONS_MANAGER">Operations Manager</option>
          <option value="WAREHOUSE_MANAGER">Warehouse Manager</option>
          <option value="DRIVER">Driver</option>
          <option value="CEO">CEO</option>
        </select>

        <button
          disabled={loading}
          className="bg-[#4400A5] text-white p-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
