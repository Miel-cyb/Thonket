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
  const [products, setProducts] = useState(productsData);
  const [isOpen, setIsOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    brand: "",
    unitOfMeasure: "",
    unitCost: 0,
    stock: 0,
  });

  const categories = ["all", "rice", "oil", "milk", "sardines", "salt"];

  // filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemove = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddProduct = () => {
    setProducts([...products, { ...newProduct }]);
    setNewProduct({
      id: "",
      name: "",
      description: "",
      category: "",
      brand: "",
      unitOfMeasure: "",
      unitCost: 0,
      stock: 0,
    });
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <Navbar onSearch={(val) => setSearchTerm(val)} />

      {/* Title + Filters + Add Btn */}
      <div className="mt-4 mb-3 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="font-bold text-xl">All Products</h1>

          {/* Category filter buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? "bg-cyan-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Add Product Button (aligned right on large screens) */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsOpen(true)}
              className="bg-cyan-900 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-800 transition"
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[800px] border border-gray-200 rounded-lg shadow-md">
          <TableHeader>
            <TableRow className="bg-gray-500">
              {[
                "Product Id",
                "Name",
                "Description",
                "Category",
                "Brand",
                "Unit",
                "Unit Cost",
                "Status",
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
                <TableRow key={p.id} className="">
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>{p.unitOfMeasure}</TableCell>
                  <TableCell>₵{p.unitCost}</TableCell>
                  <TableCell>
                    {p.stock > 0 ? (
                      <span className="bg-green-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        In Stock ({p.stock} left)
                      </span>
                    ) : (
                      <span className="bg-red-500/50 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
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

      {/* Add Product Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <div className="flex flex-col gap-3">
              {Object.keys(newProduct).map((key) =>
                key === "unitCost" || key === "stock" ? (
                  <input
                    key={key}
                    type="number"
                    placeholder={key}
                    value={newProduct[key]}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        [key]: Number(e.target.value),
                      })
                    }
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                ) : (
                  <input
                    key={key}
                    type="text"
                    placeholder={key}
                    value={newProduct[key]}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, [key]: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 text-sm"
                  />
                )
              )}
              <button
                onClick={handleAddProduct}
                className="bg-cyan-900 text-white px-4 py-2 rounded-lg hover:bg-cyan-800 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
