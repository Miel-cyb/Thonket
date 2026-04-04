export default function CustomersTable({ customers }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                        <th className="px-6 py-4">Customer / Branches</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Credit Utilization</th>
                        <th className="px-6 py-4">Total Purchases</th>
                        <th className="px-6 py-4">Net Profit</th>
                        <th className="px-6 py-4">Risk</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {customers.map((customer) => {
                        const totalUsed = customer.branches.reduce((acc, b) => acc + b.creditUsed, 0);
                        const usagePercent = Math.min((totalUsed / customer.totalCreditLimit) * 100, 100);

                        return (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900">{customer.name}</div>
                                    <div className="text-xs text-gray-500">{customer.branches.length} Branches</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {customer.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 w-64">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>${totalUsed.toLocaleString()}</span>
                                            <span className="text-gray-400">Limit: ${customer.totalCreditLimit.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${usagePercent > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${usagePercent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    ${customer.totalPurchases.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-green-600 font-semibold">
                                    +${customer.overallProfit.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-2 text-xs font-bold uppercase ${customer.risk === 'high' ? 'text-red-500' : customer.risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                                        }`}>
                                        <span className={`h-2 w-2 rounded-full bg-current`}></span>
                                        {customer.risk}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline font-medium">Manage</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}