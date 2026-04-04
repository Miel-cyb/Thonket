export default function BusinessHeader({ business }) {
    const remaining = business.creditLimit - business.creditUsed;

    return (
        <div className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row md:justify-between gap-4">

            <div>
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-gray-500">Business Account</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Stat label="Credit Limit" value={`$${business.creditLimit}`} />
                <Stat label="Used" value={`$${business.creditUsed}`} />
                <Stat label="Remaining" value={`$${remaining}`} />
                <RiskBadge risk={business.risk} />

            </div>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}

function RiskBadge({ risk }) {
    const colors = {
        low: "text-green-600",
        medium: "text-yellow-600",
        high: "text-red-600",
    };

    return (
        <div>
            <p className="text-xs text-gray-500">Risk</p>
            <p className={`font-semibold ${colors[risk]}`}>{risk}</p>
        </div>
    );
}