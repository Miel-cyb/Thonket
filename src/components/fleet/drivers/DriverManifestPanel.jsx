'use client';

export default function DriverManifestPanel({ tasks = [] }) {
    return (
        <div className="bg-white p-6 rounded-3xl space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                    Delivery Manifest
                </h2>
                <span className="text-xs text-slate-400">
                    {tasks.length} Orders
                </span>
            </div>

            <div className="space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-sm text-gray-400">No assigned orders</p>
                ) : (
                    tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="border border-slate-100 rounded-2xl p-4 bg-slate-50"
                        >
                            {/* Order Header */}
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {task.customerName || `Order ${index + 1}`}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {task.address}
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-indigo-600">
                                    #{task.id}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="space-y-2">
                                {(task.items || []).map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between text-sm bg-white px-3 py-2 rounded-lg border"
                                    >
                                        <span>{item.name}</span>
                                        <span className="font-semibold">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))
                )}
            </div>

        </div>
    );
}