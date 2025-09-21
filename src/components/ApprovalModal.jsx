import { Button } from "@/components/ui/button"

const ApprovalModal = ({ order, packingNotes, setPackingNotes, estimatedDelivery, setEstimatedDelivery, onClose, onConfirm }) => {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Approve Order {order.orderId}</h2>
        
        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Packing Notes</span>
          <textarea
            value={packingNotes}
            onChange={(e) => setPackingNotes(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Estimated Delivery Time</span>
          <input
            type="text"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </label>

        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}

export default ApprovalModal
