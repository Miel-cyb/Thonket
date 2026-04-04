export default function CustomerRow({ customer }) {
    const isBusiness = customer.type === "business";

    return (
        <tr className="border-b hover:bg-gray-50 cursor-pointer">

            <td className="p-3 font-medium">{customer.name}</td>

            <td className="p-3 capitalize">{customer.type}</td>

            <td className="p-3">
                {isBusiness ? customer.branches || 0 : "-"}
            </td>

            <td className="p-3">
                {isBusiness ? (
                    <span>
                        ${customer.creditUsed} / ${customer.creditLimit}
                    </span>
                ) : (
                    "-"
                )}
            </td>

            <td className="p-3">
                ${customer.totalPurchases || 0}
            </td>

            <td className="p-3">
                {isBusiness ? `$${customer.profit || 0}` : "-"}
            </td>

            <td className="p-3">
                {isBusiness ? (
                    <RiskBadge risk={customer.risk} />
                ) : (
                    "-"
                )}
            </td>

            <td className="p-3">
                {customer.lastActivity}
            </td>
        </tr>
    );
}

function RiskBadge({ risk }) {
    const colors = {
        low: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-red-100 text-red-700",
    };

    return (
        <span className={`px-2 py-1 rounded ${colors[risk]}`}>
            {risk}
        </span>
    );
}