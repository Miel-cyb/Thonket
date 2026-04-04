export default function BranchRow({ branch }) {
    return (
        <tr className="border-b hover:bg-gray-50 cursor-pointer">

            <td className="p-3 font-medium">{branch.name}</td>
            <td className="p-3">{branch.location}</td>
            <td className="p-3">${branch.sales}</td>
            <td className="p-3">${branch.outstanding}</td>
            <td className="p-3">{branch.lastActivity}</td>

        </tr>
    );
}