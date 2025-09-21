import React, { useState } from 'react'
import Products from '@/components/Products'

const Inventory = () => {
    const subpages = ['Products', 'Stock', 'Stock Movement', 'Orders', 'Drivers']
    const [activePage, setActivePage] = useState('Products') 
  return (
    <div>
      {/* sidebar */}
      <div className='fixed h-full top-0 left-0 bg-cyan-900 w-50'>
        <ul className='leading-[85px] py-6'>
        {subpages.map((page, index) =>(
            <li className={`px-4 text-white cursor-pointer ${
                activePage === page ? 'bg-white/55 text-black' : 'hover:bg-white hover:text-black'
              }`} key={index} onClick={() => setActivePage(page) }>{page}</li>
        ))}
        </ul>
      </div>

      {/* main content */}
      <div className="ml-48 p-6 w-full">
        {activePage === 'Products' && <Products />}
        {activePage === 'Warehouses' && <div>Warehouses content here</div>}
        {activePage === 'Suppliers' && <div>Suppliers content here</div>}
        {activePage === 'Orders' && <div>Orders content here</div>}
        {activePage === 'Drivers' && <div>Drivers content here</div>}
      </div>
    </div>
  )
}

export default Inventory
