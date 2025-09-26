import { RotateCcw } from "lucide-react";

const ReturnsAnalysis = () => {
  const returns = {
    totalReturns: 18,
    returnRate: "3.2%",
    topReason: "Damaged Packaging",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <RotateCcw className="h-5 w-5 text-purple-600" />
        Returns Analysis
      </h3>
      <div className="space-y-3">
        <p><span className="font-medium">Total Returns:</span> {returns.totalReturns}</p>
        <p><span className="font-medium">Return Rate:</span> {returns.returnRate}</p>
        <p><span className="font-medium">Top Reason:</span> {returns.topReason}</p>
      </div>
    </div>
  );
};

export default ReturnsAnalysis;
