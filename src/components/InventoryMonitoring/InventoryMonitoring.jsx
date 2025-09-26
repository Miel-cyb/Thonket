import StockOverview from "./StockOverview";
import ReorderAlerts from "./ReorderAlerts";
import StockoutRisks from "./StockoutRisks";
import InventoryValuation from "./InventoryValuation";
import FulfillmentPerformance from "./FulfillmentPerformance";
import ReturnsAnalysis from "./ReturnsAnalysis";
import DemandForecasting from "./DemandForecast";

const InventoryMonitoring = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-10">
      <h1 className="text-3xl md:text-3x font-extrabold text-gray-900 mb-6">
        Reporting & Analytics
      </h1>

      {/* Full-width inventory valuation */}
      <InventoryValuation />

      {/* Other analytics stacked */}
      <div className="space-y-8">
        <StockOverview />
        <ReorderAlerts />
        <DemandForecasting/>
        <StockoutRisks />
        
        <FulfillmentPerformance />
        <ReturnsAnalysis />
      </div>
    </div>
  );
};

export default InventoryMonitoring;
