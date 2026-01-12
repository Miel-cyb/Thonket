
import { useState, useEffect } from "react";

export default function EditUserModal({ user, onClose, onSubmit }) {
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    setEmail(user.email);
    setRole(user.role);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSubmit({ ...user, email, role });
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>

        <div className="mb-3">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="customer">Customer</option>
            <option value="sales">Sales</option>
            <option value="operations">Operations</option>
            <option value="inventory">Inventory</option>
            <option value="ceo">CEO</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-[#4400A5] text-white rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
