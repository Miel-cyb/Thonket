'use client';
import { useState } from 'react';
import Navbar from './Navbar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const StockControl = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const flatProducts = products.flatMap(p => p.sizes.map(s => ({ ...p, size: s.name, stock: s.stock, price: s.price, uniqueId: `${p.id}-${s.name}` })));

  const filteredProducts = flatProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setIsModalOpen(true);
  };

  const handleStockUpdate = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p => {
      if (p.id === selectedProduct.id) {
        const updatedSizes = p.sizes.map(s => {
          if (s.name === selectedProduct.size) {
            return { ...s, stock: newStock < 0 ? 0 : newStock };
          }
          return s;
        });
        return { ...p, sizes: updatedSizes, selectedSize: p.selectedSize.name === selectedProduct.size ? updatedSizes.find(s => s.name === selectedProduct.size) : p.selectedSize };
      }
      return p;
    });

    setProducts(updatedProducts);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className='w-full p-4'>
      <Navbar onSearch={(val) => setSearchTerm(val)} />
      <div className='mt-4'>
        <h1 className='font-bold text-xl mb-4'>Stock Control</h1>

        {/* Card View for Mobile/Tablet */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'>
          {filteredProducts.map((p) => (
            <div key={p.uniqueId} className='bg-card rounded-lg shadow-md p-4 border border-border flex flex-col justify-between'>
              <div>
                <div className='flex justify-between items-start mb-2'>
                  <h2 className='text-lg font-bold text-card-foreground'>{p.name} ({p.size})</h2>
                  <span className='text-sm text-muted-foreground font-mono'>{p.id}</span>
                </div>
                <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3 text-muted-foreground'>
                  <div><span className='font-semibold text-foreground'>Category:</span> {p.category}</div>
                  <div><span className='font-semibold text-foreground'>Brand:</span> {p.brand}</div>
                </div>
                <div className={p.stock < 10 ? 'text-destructive font-bold' : ''}>
                  Stock: {p.stock}
                </div>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  onClick={() => openAdjustModal(p)}
                  className='cursor-pointer bg-purple-600 text-primary-foreground px-3 py-1 rounded-lg text-sm hover:bg-purple-900 cursor-pointer transition'>
                  Adjust Stock
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Table View for Desktop */}
        <div className='hidden md:block w-full overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.uniqueId}>
                  <TableCell>
                    <div className='font-medium'>{p.name} ({p.size})</div>
                    <div className='text-sm text-muted-foreground'>{p.id}</div>
                  </TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>
                    <span className={p.stock < 10 ? 'text-destructive font-bold' : ''}>
                      {p.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openAdjustModal(p)}
                      className='bg-purple-600 text-primary-foreground px-3 py-1 rounded-lg text-sm hover:bg-purple-900 cursor-pointer transition'>
                      Adjust Stock
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4'>
          <div className='bg-card rounded-lg shadow-lg p-6 w-full max-w-sm'>
            <h2 className='text-xl font-semibold mb-2'>Adjust Stock</h2>
            <p className='text-muted-foreground mb-4'>{selectedProduct.name} ({selectedProduct.size})</p>

            <div className='flex items-center gap-4 mb-6'>
              <label htmlFor='newStock' className='font-semibold'>New Stock:</label>
              <input
                id='newStock'
                type='number'
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value, 10))}
                className='border rounded-lg px-3 py-2 text-center w-full bg-background'
              />
            </div>

            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setIsModalOpen(false)}
                className='px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition'>
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className='px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockControl;
