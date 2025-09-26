
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AllOrders from './pages/AllOrders'
import WarehouseManagerDashboard from './pages/Warehouse'
import SignIn from './pages/SignIn'
import OperationsManagerPage from './pages/Operations'
import Inventory from './pages/Inventory'
import BookOrderDialog from './components/Book'
import CEODashboard from './pages/CEOPage'

function App() {


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/book-order" element={<BookOrderDialog />} />
        <Route path="/warehouse" element={<WarehouseManagerDashboard />} />
        <Route path='/operations' element={<OperationsManagerPage />}></Route>
        <Route path='/inventory' element={<Inventory />}></Route>
        <Route path='/ceo-analytics' element={<CEODashboard />}></Route>


      </Routes>
    </BrowserRouter>
  )
}

export default App
