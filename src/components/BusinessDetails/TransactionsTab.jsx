export default function TransactionsTab({ transactions }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left">

                <thead className="border-b bg-gray-50">
                    <tr>
                        <th className="p-3">Type</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.map((t) => (
                        <tr key={t.id} className="border-b">
                            <td className="p-3 capitalize">{t.type}</td>
                            <td className="p-3">${t.amount}</td>
                            <td className="p-3">{t.date}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}