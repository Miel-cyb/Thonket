
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const Products = () => {
    const TableHeadings = ['Product Id', 'Product name',
        'description',
        'category',
        'brand',
        'unitOfMeasure',
        'barcode',
        'costPrice',
        'sellingPrice',
        'minStockLevel',
        'reorderQuantity',
]
  return (
    <div>
        <h1 className="font-bold text-lg mb-3">All Products</h1>

        <Table className="w-full border border-gray-200 rounded-lg shadow-md">
            <TableHeader>
                <TableRow className="bg-gray-500 transition">
                {TableHeadings.map((tableData, index) => (
                    <TableHead
                    key={index}
                    className="text-white font-semibold text-center px-4 py-3"
                    >
                    {tableData}
                    </TableHead>
                ))}
                </TableRow>
            </TableHeader>
        </Table>



      
    </div>
  )
}

export default Products
