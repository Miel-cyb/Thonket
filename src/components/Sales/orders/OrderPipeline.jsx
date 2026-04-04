'use client';
import OrderColumn from './OrderColumn';

// Mock pipeline data
const pipelineData = {
    Pending: [
        { id: 'ORD-101', customer: 'John Doe', amount: '$120.00', status: 'Pending' },
        { id: 'ORD-105', customer: 'Alice Brown', amount: '$80.00', status: 'Pending' },
    ],
    Approved: [
        { id: 'ORD-102', customer: 'Jane Smith', amount: '$350.00', status: 'Approved' },
    ],
    Processing: [
        { id: 'ORD-106', customer: 'Tom Lee', amount: '$220.00', status: 'Processing' },
    ],
    Delivered: [
        { id: 'ORD-103', customer: 'Mike Lee', amount: '$220.00', status: 'Delivered' },
    ],
    Issues: [
        { id: 'ORD-104', customer: 'Anna Kim', amount: '$50.00', status: 'Issues' },
    ],
};

const statusColors = {
    Pending: 'bg-yellow-200 text-yellow-800',
    Approved: 'bg-blue-200 text-blue-800',
    Processing: 'bg-purple-200 text-purple-800',
    Delivered: 'bg-green-200 text-green-800',
    Issues: 'bg-red-200 text-red-800',
};

export default function OrderPipeline() {
    const handleView = (order) => alert(`Viewing ${order.id}`);
    const handleFollowUp = (order) => alert(`Following up on ${order.id}`);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Pipeline</h2>
            <div className="flex gap-4 overflow-x-auto">
                {Object.keys(pipelineData).map(status => (
                    <OrderColumn
                        key={status}
                        title={status}
                        orders={pipelineData[status]}
                        statusColor={statusColors[status]}
                        onView={handleView}
                        onFollowUp={handleFollowUp}
                    />
                ))}
            </div>
        </div>
    );
}