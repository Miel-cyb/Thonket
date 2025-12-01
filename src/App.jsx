import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AllOrders from './pages/AllOrders';
import SignIn from './pages/SignIn';
import OperationsManagerPage from './pages/Operations';
import BookOrderDialog from './components/Book';
import CEODashboard from './pages/CEOPage';
import WarehousePage from './pages/WarehousePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/book-order" element={<BookOrderDialog />} />
        <Route path="/operations" element={<OperationsManagerPage />} />
        <Route path="/inventory" element={<WarehousePage />} />
        <Route path="/ceo-analytics" element={<CEODashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
