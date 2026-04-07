'use client';

export default function DriverTaskList({ tasks = [], onCompleteTask }) {
    return (
        <div className="space-y-3">

            {tasks.length === 0 ? (
                <p className="text-sm text-gray-400">No tasks available</p>
            ) : (
                tasks.map((task, index) => (
                    <div
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-white border rounded-xl"
                    >

                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    {task.customerName}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {task.address}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        {onCompleteTask && task.status !== 'completed' && (
                            <button
                                onClick={() => onCompleteTask(task.id)}
                                className="text-xs px-3 py-1 bg-green-600 text-white rounded-lg"
                            >
                                Complete
                            </button>
                        )}

                    </div>
                ))
            )}

        </div>
    );
}