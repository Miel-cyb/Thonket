export default function RoleRow({ role, onEdit }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-medium">{role.name}</td>
      <td className="p-3">{role.permissions.join(", ")}</td>
      <td className="p-3">
        <button
          onClick={() => onEdit(role)}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}