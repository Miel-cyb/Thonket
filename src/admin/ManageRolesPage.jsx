import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "./api/usersApi";

const ROLES = [
  "SALES_AGENT",
  "WAREHOUSE_MANAGER",
  "OPERATIONS_MANAGER",
  "CEO",
  "DRIVER",
  "CUSTOMER",
];

export default function ManageRolesPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleUpdate = async () => {
    await updateUserRole(selectedUser.authId, role);
    setUsers(await getUsers());
    setSelectedUser(null);
    setRole("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Roles</h1>

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.authId}
            className="border p-3 flex justify-between"
          >
            <span>{u.name} — {u.role}</span>
            <button
              className="text-[#4400A5]"
              onClick={() => {
                setSelectedUser(u);
                setRole(u.role);
              }}
            >
              Change Role
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="border mt-6 p-4">
          <h2 className="font-bold mb-2">
            Change role for {selectedUser.name}
          </h2>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 mb-3 w-full"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={handleUpdate}
            className="bg-[#4400A5] text-white px-4 py-2"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
