import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Sales from './pages/Sales';
import SignIn from './pages/SignIn';
import OperationsManagerPage from './pages/Operations';
import BookOrderDialog from './components/Book';
import CEODashboard from './pages/CEOPage';
import WarehousePage from './pages/WarehousePage';
import productsData from "@/data/products";
import AdminPage from './admin/AdminPage';
import ProductPricing from './components/WarehouseOverview/ProductPricing.jsx';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductPage';
import FleetDashboardPage from './pages/FleetDashboardPage';
import PriceManagementPage from './pages/PriceManagementPage';
import FinanceDashboardPage from './pages/FinanacePage';
import SalesManagerDashboardPage from './pages/SalesManagerPage';
import StockIntakePage from './pages/StockIntakePage';
import ProcurementPage from './pages/ProcurementPage';
import SupplierOnboardingPage from './pages/SupplierOnboardingPage';



function App() {
  const [products, setProducts] = useState(
    productsData.map(p => ({ ...p, selectedSize: p.sizes[0] }))
  );
  const [reports, setReports] = useState([]);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const updateProductsOnServer = async () => {
      try {
        await fetch('/api/update-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(products),
        });
      } catch (error) {
        console.error("Error updating products:", error);
      }
    };

    updateProductsOnServer();
  }, [products]);

  const handleReportSubmit = (newReport) => {
    setReports(prevReports => [...prevReports, newReport]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/sales-manager" element={<SalesManagerDashboardPage />} />
        <Route path="/book-order" element={<BookOrderDialog />} />
        <Route
          path="/operations"
          element={<OperationsManagerPage products={products} reports={reports} />}
        />

        <Route path="/stock-intake" element={<StockIntakePage />} />
        <Route
          path="/products/:productId/pricing"
          element={<ProductPricing products={products} setProducts={setProducts} />}
        />

        <Route
          path="/products/categories"
          element={<CategoriesPage />}
        />

        <Route
          path="/products/list"
          element={<ProductsPage />}
        />

        <Route
          path="/finance"
          element={<FinanceDashboardPage />}
        />

        <Route
          path="/procurement"
          element={<ProcurementPage />}
        />

        <Route
          path="/supplier-onboarding"
          element={<SupplierOnboardingPage />}
        />

        <Route
          path="/products/pricing"
          element={<PriceManagementPage />}
        />

        <Route
          path="/products/:productId/pricing"
          element={<ProductPricing products={products} setProducts={setProducts} />}
        />


        <Route
          path="/inventory"
          element={
            <WarehousePage
              products={products}
              setProducts={setProducts}
              reports={reports}
              onReportSubmit={handleReportSubmit}
            />
          }
        />
        <Route
          path="/fleet/manager"
          element={<FleetDashboardPage userRole="manager" />}
        />

        <Route
          path="/fleet/driver"
          element={<FleetDashboardPage userRole="driver" />}
        />
        <Route path="/ceo-analytics" element={<CEODashboard />} />
        <Route path='/admin/*' element={<AdminPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
