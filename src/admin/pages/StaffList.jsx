import { useEffect, useState } from "react";
import {
  getEmployees,
  getEmployeeById,
} from "../api/employeeService";

import FindById from "../components/FindById";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setStaff(data);
    } catch {
      setError("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading staff...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Staff</h1>

      <FindById
        label="Find Staff"
        placeholder="Enter employee ID"
        onSearch={getEmployeeById}
        onFound={setSelectedStaff}
      />

      {selectedStaff && (
        <div className="border p-4 mb-6 rounded">
          <p>
            <b>Name:</b>{" "}
            {selectedStaff.first_name} {selectedStaff.last_name}
          </p>
          <p><b>Email:</b> {selectedStaff.email}</p>
          <p><b>Department:</b> {selectedStaff.department}</p>
          <p><b>Status:</b> {selectedStaff.status}</p>
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">
                {s.first_name} {s.last_name}
              </td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.department}</td>
              <td className="border p-2">{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
