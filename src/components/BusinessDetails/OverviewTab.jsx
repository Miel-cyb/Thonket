export default function OverviewTab({ business }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <Card title="Total Purchases" value={`$${business.totalPurchases}`} />
            <Card title="Profit Generated" value={`$${business.profit}`} />
            <Card title="Branches" value={business.branches.length} />

        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-xl font-bold">{value}</h2>
        </div>
    );
}