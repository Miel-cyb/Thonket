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

const StockControl = () => {
  const [products, setProducts] = useState(
    productsData.flatMap(p => p.sizes.map(s => ({ ...p, size: s.name, stock: s.stock, price: s.price, id: `${p.id}-${s.name}` })))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setIsModalOpen(true);
  };

  const handleStockUpdate = () => {
    if (!selectedProduct) return;

    setProducts(products.map(p => {
        if (p.id === selectedProduct.id) {
            return { ...p, stock: newStock < 0 ? 0 : newStock };
        }
        return p;
    }));

    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full p-4">
      <Navbar onSearch={(val) => setSearchTerm(val)} />
      <div className="mt-4">
        <h1 className="font-bold text-xl mb-4">Stock Control</h1>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[900px] border border-gray-200 rounded-lg shadow-md">
            <TableHeader>
              <TableRow className="bg-purple-600 hover:bg-purple-700">
                {[
                  "Product Id",
                  "Name",
                  "Category",
                  "Brand",
                  "Size",
                  "Stock",
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
              {filteredProducts.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-100">
                  <TableCell>{p.id.split('-')[0]}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell>{p.size}</TableCell>
                  <TableCell
                    className={p.stock < 10 ? "text-red-500 font-bold" : ""}
                  >
                    {p.stock}
                  </TableCell>
                  <TableCell>
                    <button 
                        onClick={() => openAdjustModal(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-2">Adjust Stock</h2>
            <p className="text-gray-600 mb-4">{selectedProduct.name} ({selectedProduct.size})</p>
            
            <div className="flex items-center gap-4 mb-6">
                <label htmlFor="newStock" className="font-semibold">New Stock:</label>
                <input
                    id="newStock"
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(parseInt(e.target.value, 10))}
                    className="border rounded-lg px-3 py-2 text-center w-full"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition">
                    Cancel
                </button>
                <button 
                    onClick={handleStockUpdate}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
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
