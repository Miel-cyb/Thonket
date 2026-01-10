'use client';
import { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import Navbar from './Navbar';

const Products = ({ products, setProducts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [brands, setBrands] = useState([...new Set(products.map(p => p.brand))]);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'rice',
    brand: '',
    unitOfMeasure: 'bag',
    sizes: [{ name: 'Small', price: 0, stock: 0 }, { name: 'Medium', price: 0, stock: 0 }, { name: 'Large', price: 0, stock: 0 }],
  });

  const categories = ['all', 'rice', 'oil', 'milk', 'sardines', 'salt', 'canned', 'pasta', 'sugar', 'flour'];
  const units = ['bag', 'bottle', 'packet', 'tin', 'can'];

  const handleSizeChange = (productId, sizeName) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          const selectedSize = p.sizes.find((s) => s.name === sizeName);
          return { ...p, selectedSize };
        }
        return p;
      })
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand) {
      alert('Product Name and Brand are required.');
      return;
    }

    if (isAddingBrand && newProduct.brand && !brands.includes(newProduct.brand)) {
      setBrands([...brands, newProduct.brand]);
    }

    const existingProductIndex = products.findIndex(
      (p) =>
        p.name.toLowerCase() === newProduct.name.toLowerCase() &&
        p.brand === newProduct.brand &&
        p.category === newProduct.category &&
        p.unitOfMeasure === newProduct.unitOfMeasure
    );

    if (existingProductIndex !== -1) {
      const updatedProducts = [...products];
      const productToUpdate = updatedProducts[existingProductIndex];
      const newSizes = newProduct.sizes.map((s) => ({ ...s, price: Number(s.price), stock: Number(s.stock) }));

      const uniqueNewSizes = newSizes.filter(
        (newSize) => !productToUpdate.sizes.some((existingSize) => existingSize.name === newSize.name)
      );

      if (uniqueNewSizes.length !== newProduct.sizes.length) {
        alert('One or more of these sizes already exist for this product.');
        return;
      }

      productToUpdate.sizes.push(...uniqueNewSizes);
      setProducts(updatedProducts);
    } else {
      const existingIds = products.map((p) => parseInt(p.id.substring(1)));
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      const newId = `P${(maxId + 1).toString().padStart(3, '0')}`;

      const sizesWithStock = newProduct.sizes.map((s) => ({ ...s, price: Number(s.price), stock: Number(s.stock) }));

      const productToAdd = {
        ...newProduct,
        id: newId,
        sizes: sizesWithStock,
        selectedSize: sizesWithStock[0] || { name: '', price: 0, stock: 0 },
      };

      setProducts([...products, productToAdd]);
    }

    setNewProduct({
      name: '',
      category: 'rice',
      brand: '',
      unitOfMeasure: 'bag',
      sizes: [{ name: 'Small', price: 0, stock: 0 }, { name: 'Medium', price: 0, stock: 0 }, { name: 'Large', price: 0, stock: 0 }],
    });
    setIsOpen(false);
    setIsAddingBrand(false);
  };
  
    const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(
      products.map(p => (p.id === editingProduct.id ? editingProduct : p))
    );

    setIsEditOpen(false);
    setEditingProduct(null);
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleNewSizeChange = (index, e) => {
    const { name, value } = e.target;
    const sizes = [...newProduct.sizes];
    let val = value;
    if (name === 'price' || name === 'stock') {
      val = Number(value);
    }
    sizes[index][name] = val;
    setNewProduct({ ...newProduct, sizes });
  };
  
  const handleEditSizeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSizes = [...editingProduct.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [name]: Number(value) };
    setEditingProduct({ ...editingProduct, sizes: updatedSizes });
  };
  
    const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setIsEditOpen(true);
  };


  return (
    <div className='w-full'>
          <Navbar onSearch={(val) => setSearchTerm(val)} />

      <div className='mt-4 mb-3 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <h1 className='font-bold text-lg'>Products</h1>
          <div className='flex flex-wrap justify-center gap-2'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`cursor-pointer px-4 py-1 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? 'bg-purple-600  text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className='flex justify-end'>
            <button
              onClick={() => setIsOpen(true)}
              className=' cursor-pointer bg-purple-600 text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-purple-600 transition'>
              + Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Card View for Mobile/Tablet */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'>
        {filteredProducts.map((p) => (
          <div key={p.id} className='bg-card rounded-lg shadow-md p-4 border border-border flex flex-col justify-between'>
            <div>
              <div className='flex justify-between items-start mb-2'>
                <h2 className='text-lg font-bold text-card-foreground'>{p.name}</h2>
                <span className='text-sm text-muted-foreground font-mono'>{p.id}</span>
              </div>
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3 text-muted-foreground'>
                <div><span className='font-semibold text-foreground'>Category:</span> {p.category}</div>
                <div><span className='font-semibold text-foreground'>Brand:</span> {p.brand}</div>
                <div><span className='font-semibold text-foreground'>Unit:</span> {p.unitOfMeasure}</div>
                <div><span className='font-semibold text-foreground'>Price:</span> ₵{p.selectedSize.price}</div>
              </div>
              <div>
                {p.selectedSize.stock > 0 ? (
                  <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium'>
                    In Stock ({p.selectedSize.stock} left)
                  </span>
                ) : (
                  <span className='bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium'>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold text-sm'>Size:</span>
                <select
                  value={p.selectedSize.name}
                  onChange={(e) => handleSizeChange(p.id, e.target.value)}
                  className='border rounded-lg px-2 py-1 text-sm bg-background'>
                  {p.sizes.map((size) => (
                    <option key={size.name} value={size.name}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
                <div className="flex gap-2">
                <button onClick={() => openEditModal(p)} className='bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition'>Edit</button>

              <button
                onClick={() => handleRemove(p.id)}
                className='  cursor-pointer bg-destructive text-white px-3 py-1 rounded-lg text-sm hover:bg-destructive/90 transition'>
                Remove
              </button>
              </div>
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
              <TableHead>Size & Price</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className='font-medium'>{p.name}</div>
                  <div className='text-sm text-muted-foreground'>{p.id}</div>
                </TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>
                  <select
                    value={p.selectedSize.name}
                    onChange={(e) => handleSizeChange(p.id, e.target.value)}
                    className='border rounded-lg px-2 py-1 text-sm bg-background'>
                    {p.sizes.map((size) => (
                      <option key={size.name} value={size.name}>
                        {size.name} - ₵{size.price}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  {p.selectedSize.stock > 0 ? (
                    <span className='bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs'>
                      In Stock ({p.selectedSize.stock})
                    </span>
                  ) : (
                    <span className='bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs'>
                      Out of Stock
                    </span>
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                   <button onClick={() => openEditModal(p)} className='bg-purple-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition'>Edit</button>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className='cursor-pointer bg-destructive text-white px-3 py-1 rounded-lg text-sm hover:bg-destructive/90 transition'>
                    Remove
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50 p-4'>
          <div className='bg-card rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto'>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute top-3 right-3 text-muted-foreground hover:text-foreground text-2xl font-bold'>
              &times;
            </button>
            <h2 className='text-xl font-semibold mb-6'>Add New Product</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <input
                type='text' name='name' placeholder='Product Name'
                value={newProduct.name} onChange={handleNewProductChange}
                className='border rounded-lg px-3 py-2 text-sm md:col-span-2 bg-background'
              />
              <select name='category' value={newProduct.category} onChange={handleNewProductChange} className='border rounded-lg px-3 py-2 text-sm bg-background'>
                {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <select name='unitOfMeasure' value={newProduct.unitOfMeasure} onChange={handleNewProductChange} className='border rounded-lg px-3 py-2 text-sm bg-background'>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className='md:col-span-2'>
                {isAddingBrand ? (
                  <div className='flex items-center gap-2'>
                    <input
                      type='text'
                      name='brand'
                      placeholder='New Brand Name'
                      value={newProduct.brand}
                      onChange={handleNewProductChange}
                      className='border rounded-lg px-3 py-2 text-sm w-full bg-background'
                    />
                    <button onClick={() => setIsAddingBrand(false)} className='text-sm text-muted-foreground hover:text-foreground'>Cancel</button>
                  </div>
                ) : (
                  <select
                    name='brand'
                    value={newProduct.brand}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setIsAddingBrand(true);
                        setNewProduct({ ...newProduct, brand: '' });
                      } else {
                        handleNewProductChange(e);
                      }
                    }}
                    className='border rounded-lg px-3 py-2 text-sm w-full bg-background'>
                    <option value='' disabled>Select Brand</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    <option value='__add_new__'>+ Add New Brand</option>
                  </select>
                )}
              </div>
            </div>

            <h3 className='text-lg font-semibold mt-6 mb-3'>Product Sizes</h3>
            <div className='grid grid-cols-1 gap-y-4'>
              {newProduct.sizes.map((size, index) => (
                <div key={index} className='p-3 border rounded-lg bg-muted/50'>
                  <p className='font-medium mb-2'>{size.name}</p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor={`price-${index}`} className='text-sm font-medium text-muted-foreground'>Price</label>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-muted-foreground'>₵</span>
                        <input
                          id={`price-${index}`}
                          type='number' name='price' placeholder='0.00'
                          value={size.price} onChange={(e) => handleNewSizeChange(index, e)}
                          className='border rounded-lg px-3 py-2 text-sm w-full bg-background'
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`stock-${index}`} className='text-sm font-medium text-muted-foreground'>Initial Stock</label>
                      <input
                        id={`stock-${index}`}
                        type='number' name='stock' placeholder='0'
                        value={size.stock} onChange={(e) => handleNewSizeChange(index, e)}
                        className='border rounded-lg px-3 py-2 text-sm w-full bg-background mt-1'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-end mt-4'>
              <button
                onClick={handleAddProduct}
                className='bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition'>
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
      
      
      {isEditOpen && editingProduct && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50 p-4'>
          <div className='bg-card rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto'>
            <button onClick={() => setIsEditOpen(false)} className='absolute top-3 right-3 text-muted-foreground hover:text-foreground text-2xl font-bold'>
              &times;
            </button>
            <h2 className='text-xl font-semibold mb-6'>Edit Product: {editingProduct.name}</h2>

            <div className='grid grid-cols-1 gap-y-4'>
              {editingProduct.sizes.map((size, index) => (
                <div key={index} className='p-3 border rounded-lg bg-muted/50'>
                  <p className='font-medium mb-2'>{size.name}</p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label htmlFor={`edit-price-${index}`} className='text-sm font-medium text-muted-foreground'>Price</label>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='text-muted-foreground'>₵</span>
                        <input
                          id={`edit-price-${index}`}
                          type='number' name='price' placeholder='0.00'
                          value={size.price}
                          onChange={(e) => handleEditSizeChange(index, e)}
                          className='border rounded-lg px-3 py-2 text-sm w-full bg-background'
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`edit-stock-${index}`} className='text-sm font-medium text-muted-foreground'>Stock</label>
                      <input
                        id={`edit-stock-${index}`}
                        type='number' name='stock' placeholder='0'
                        value={size.stock}
                        onChange={(e) => handleEditSizeChange(index, e)}
                        className='border rounded-lg px-3 py-2 text-sm w-full bg-background mt-1'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-end mt-4'>
              <button onClick={handleUpdateProduct} className='bg-primary text-primary-foreground px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition'>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
