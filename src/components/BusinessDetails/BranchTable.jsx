import BranchRow from "./BranchRow";

export default function BranchTable({ branches }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Sales</th>
                        <th className="p-3">Outstanding</th>
                        <th className="p-3">Last Activity</th>
                    </tr>
                </thead>

                <tbody>
                    {branches.map((b) => (
                        <BranchRow key={b.id} branch={b} />
                    ))}
                </tbody>

            </table>
        </div>
    );
}