import { useEffect, useState } from "react";
import { getUsers } from "../api/usersApi"; // fetch auth users
import { createEmployee } from "../api/employeeService";

export default function CreateStaff() {
  const [authUsers, setAuthUsers] = useState([]);
  const [selectedAuthUser, setSelectedAuthUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAuthUsers();
  }, []);

  const fetchAuthUsers = async () => {
    try {
      const users = await getUsers();
      setAuthUsers(users);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch auth users");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAuthUser) {
      setError("Please select an auth user");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createEmployee({
        auth_user_id: selectedAuthUser,
        first_name: firstName,
        last_name: lastName,
        email,
        department,
        position,
        status,
      });

      alert("Staff created successfully!");
      // Reset form
      setSelectedAuthUser("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setDepartment("");
      setPosition("");
      setStatus("active");
    } catch (err) {
      console.error(err);
      setError("Failed to create staff. Make sure all fields are correct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-[#4400A5]">Create Staff</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Auth User</label>
          <select
            value={selectedAuthUser}
            onChange={(e) => setSelectedAuthUser(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Select Auth User --</option>
            {authUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            type="email"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Position</label>
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#4400A5] text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Staff"}
        </button>
      </form>
    </div>
  );
}
