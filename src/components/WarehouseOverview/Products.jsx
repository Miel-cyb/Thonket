"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "./Navbar";
import productsData from "@/data/products";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState(
    productsData.map((p) => ({ ...p, selectedSize: p.sizes[0] }))
  );
  const [isOpen, setIsOpen] = useState(false);
  const [brands, setBrands] = useState([...new Set(productsData.map(p => p.brand))]);
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "rice",
    brand: "",
    unitOfMeasure: "bag",
    sizes: [{ name: "", price: 0 }],
  });

  const categories = ["all", "rice", "oil", "milk", "sardines", "salt", "canned", "pasta", "sugar", "flour"];
  const units = ['bag', 'bottle', 'packet', 'tin', 'can'];
  const sizeOptions = ['Small', 'Medium', 'Large'];


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
    const matchesCategory = category === "all" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand) {
        alert("Product Name and Brand are required.");
        return;
    }

    if (isAddingBrand && newProduct.brand && !brands.includes(newProduct.brand)) {
        setBrands([...brands, newProduct.brand]);
    }

    const existingProductIndex = products.findIndex(p =>
        p.name.toLowerCase() === newProduct.name.toLowerCase() &&
        p.brand === newProduct.brand &&
        p.category === newProduct.category &&
        p.unitOfMeasure === newProduct.unitOfMeasure
    );

    if (existingProductIndex !== -1) {
        const updatedProducts = [...products];
        const productToUpdate = updatedProducts[existingProductIndex];

        const newSizes = newProduct.sizes.map(s => ({ ...s, stock: 0, price: Number(s.price) }));

        const uniqueNewSizes = newSizes.filter(newSize =>
            !productToUpdate.sizes.some(existingSize => existingSize.name === newSize.name)
        );

        if (uniqueNewSizes.length !== newProduct.sizes.length) {
             alert("One or more of these sizes already exist for this product.");
             return;
        }
        
        productToUpdate.sizes.push(...uniqueNewSizes);
        setProducts(updatedProducts);
    } else {
        const existingIds = products.map(p => parseInt(p.id.substring(1)));
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        const newId = `P${(maxId + 1).toString().padStart(3, '0')}`;

        const sizesWithStock = newProduct.sizes.map(s => ({ ...s, stock: 0, price: Number(s.price) }));

        const productToAdd = {
            ...newProduct,
            id: newId,
            sizes: sizesWithStock,
            selectedSize: sizesWithStock[0] || { name: '', price: 0, stock: 0 }
        };

        setProducts([...products, productToAdd]);
    }

    setNewProduct({
      name: "",
      category: "rice",
      brand: "",
      unitOfMeasure: "bag",
      sizes: [{ name: "", price: 0 }],
    });
    setIsOpen(false);
    setIsAddingBrand(false);
  };


  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleNewSizeChange = (index, e) => {
    const { name, value } = e.target;
    const sizes = [...newProduct.sizes];
    let val = value;
    if (name === 'price') {
        val = Number(value);
    }
    sizes[index][name] = val;
    setNewProduct({ ...newProduct, sizes });
  };

  const addNewSize = () => {
    setNewProduct({
      ...newProduct,
      sizes: [...newProduct.sizes, { name: "", price: 0 }],
    });
  };

  const removeNewSize = (index) => {
    const sizes = [...newProduct.sizes];
    sizes.splice(index, 1);
    setNewProduct({ ...newProduct, sizes });
  };


  return (
    <div className="w-full p-4">
      <Navbar onSearch={(val) => setSearchTerm(val)} />

      <div className="mt-4 mb-3 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="font-bold text-xl">All Products</h1>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>

    <div className="w-full overflow-x-auto">
      {/* Table for larger screens */}
      <div className="hidden md:block">
        <Table className="min-w-[900px] border border-gray-200 rounded-lg shadow-md">
          <TableHeader>
            <TableRow className="bg-purple-600 hover:bg-purple-700">
              {[
                "Product Id",
                "Name",
                "Category",
                "Brand",
                "Unit",
                "Price",
                "Status",
                "Size",
                "Actions",
              ].map((heading, i) => (
                <TableHead
                  key={i}
                  className="text-white font-semibold text-center px-4 py-3"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-100">
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>{p.unitOfMeasure}</TableCell>
                  <TableCell>₵{p.selectedSize.price}</TableCell>
                  <TableCell>
                    {p.selectedSize.stock > 0 ? (
                      <span className="bg-green-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        In Stock ({p.selectedSize.stock} left)
                      </span>
                    ) : (
                      <span className="bg-red-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <select
                      value={p.selectedSize.name}
                      onChange={(e) => handleSizeChange(p.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm bg-white"
                    >
                      {p.sizes.map((size) => (
                        <option key={size.name} value={size.name}>
                          {size.name}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-6 text-gray-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cards for smaller screens */}
      <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold">{p.name}</h2>
                <span className="text-sm text-gray-500 font-mono">{p.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                  <div><span className="font-semibold">Category:</span> {p.category}</div>
                  <div><span className="font-semibold">Brand:</span> {p.brand}</div>
                  <div><span className="font-semibold">Unit:</span> {p.unitOfMeasure}</div>
                  <div><span className="font-semibold">Price:</span> ₵{p.selectedSize.price}</div>
              </div>

               <div>
                {p.selectedSize.stock > 0 ? (
                  <span className="bg-green-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                    In Stock ({p.selectedSize.stock} left)
                  </span>
                ) : (
                  <span className="bg-red-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Size:</span>
                  <select
                    value={p.selectedSize.name}
                    onChange={(e) => handleSizeChange(p.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm bg-white"
                  >
                    {p.sizes.map((size) => (
                      <option key={size.name} value={size.name}>
                        {size.name}
                      </option>
                    ))}
                  </select>
              </div>
              <button
                onClick={() => handleRemove(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>


      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text" name="name" placeholder="Product Name"
                    value={newProduct.name} onChange={handleNewProductChange}
                    className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
                />
                <select name="category" value={newProduct.category} onChange={handleNewProductChange} className="border rounded-lg px-3 py-2 text-sm bg-white">
                    {categories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select name="unitOfMeasure" value={newProduct.unitOfMeasure} onChange={handleNewProductChange} className="border rounded-lg px-3 py-2 text-sm bg-white">
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <div className="md:col-span-2">
                    { isAddingBrand ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                name="brand"
                                placeholder="New Brand Name"
                                value={newProduct.brand}
                                onChange={handleNewProductChange}
                                className="border rounded-lg px-3 py-2 text-sm w-full"
                            />
                            <button onClick={() => setIsAddingBrand(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                        </div>
                    ) : (
                        <select 
                            name="brand" 
                            value={newProduct.brand}
                            onChange={(e) => {
                                if (e.target.value === '__add_new__') {
                                    setIsAddingBrand(true);
                                    setNewProduct({ ...newProduct, brand: '' });
                                } else {
                                    handleNewProductChange(e);
                                }
                            }} 
                            className="border rounded-lg px-3 py-2 text-sm bg-white w-full"
                        >
                            <option value="" disabled>Select Brand</option>
                            {brands.map(b => <option key={b} value={b}>{b}</option>)}
                            <option value="__add_new__">+ Add New Brand</option>
                        </select>
                    )}
                </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Product Sizes</h3>
            {newProduct.sizes.map((size, index) => (
                <div key={index} className="grid grid-cols-3 gap-3 items-center mb-3">
                     <select
                        name="name"
                        value={size.name}
                        onChange={(e) => handleNewSizeChange(index, e)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="" disabled>Select Size</option>
                        {sizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">₵</span>
                        <input
                            type="number" name="price" placeholder="Price"
                            value={size.price} onChange={(e) => handleNewSizeChange(index, e)}
                            className="border rounded-lg px-3 py-2 text-sm w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                         { newProduct.sizes.length > 1 && <button onClick={() => removeNewSize(index)} className="text-red-500 text-xl font-bold">&times;</button> }
                    </div>
                </div>
            ))}
            <button onClick={addNewSize} className="text-sm text-purple-600 font-semibold mb-6 hover:underline">+ Add Another Size</button>

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleAddProduct}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                >
                    Save Product
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
