export default function EditStaffModal({ staff, onClose }) {
    if (!staff) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Edit {staff.name}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500">Role</label>
                        <input
                            type="text"
                            defaultValue={staff.role}
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500">Performance</label>
                        <input
                            type="number"
                            defaultValue={staff.performance}
                            className="border rounded-lg px-3 py-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}