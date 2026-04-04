export default function StaffRow({ staff, onEdit }) {
    return (
        <tr className="border-b hover:bg-gray-50 cursor-pointer">
            <td className="p-3 font-medium">{staff.name}</td>
            <td className="p-3">{staff.role}</td>
            <td className="p-3">{staff.performance}%</td>
            <td className="p-3">{staff.lastActivity}</td>
            <td className="p-3">
                <button
                    onClick={() => onEdit(staff)}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Edit
                </button>
            </td>
        </tr>
    );
}