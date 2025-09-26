
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AllOrders from './pages/AllOrders'
import WarehouseManagerDashboard from './pages/Warehouse'
import SignIn from './pages/SignIn'
import OperationsManagerPage from './pages/Operations'
import Inventory from './pages/WarehousePage'
import BookOrderDialog from './components/Book'
<<<<<<< HEAD
import CEODashboard from './pages/CEOPage'
=======
import WarehousePage from './pages/WarehousePage'
>>>>>>> origin/main

function App() {


  return (

    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="/" element={<SignIn />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/book-order" element={<BookOrderDialog />} />
        <Route path="/warehouse" element={<WarehouseManagerDashboard />} />
        <Route path='/operations' element={<OperationsManagerPage />}></Route>
        <Route path='/inventory' element={<Inventory />}></Route>
        <Route path='/ceo-analytics' element={<CEODashboard />}></Route>

=======
      <Route path="/" element={<SignIn />} />
      <Route path="/" element={<SignIn />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/book-order" element={<BookOrderDialog />} />
        <Route path="/warehouse" element={<WarehouseManagerDashboard/>} />
        <Route path='/operations' element={<OperationsManagerPage/>}></Route>
        <Route path='/inventory' element={<WarehousePage/>}></Route>
>>>>>>> origin/main

      </Routes>
    </BrowserRouter>
  )
}

export default App
