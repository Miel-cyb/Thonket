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
          <button 
            onClick={onClose}
            className="py-2 px-4 rounded-md font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="py-2 px-4 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApprovalModal
