import { useEffect, useState } from "react";
import {
  getUsers,               /** INITALLY USED PRINCE'S USERS API TO CHECK */
  updateUserRole,
  updateUserName,
  getUserByAuthId,
  deleteUser,
} from "./api/usersApi";

import EditUserModal from "./components/EditUserModal";
import FindById from "./components/FindById";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [foundUser, setFoundUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  const handleEditSubmit = async (updatedUser) => {
    await updateUser(updatedUser.id, updatedUser);
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#4400A5] mb-4">
        User Management
      </h1>

      {/* Find User by ID */}
      <FindById
        label="Find User"
        placeholder="Enter user ID"
        onSearch={getUserByAuthId}
        onFound={setFoundUser}
      />

      {foundUser && (
        <div className="border p-4 mb-6 rounded">
          <p><b>Email:</b> {foundUser.email}</p>
          <p><b>Role:</b> {foundUser.role}</p>
          <button
            onClick={() => setEditingUser(foundUser)}
            className="underline mt-2"
          >
            Edit User
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-3">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
