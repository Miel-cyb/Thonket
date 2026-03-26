// =============================
// FILE: /setup/catalog/ProductsPage.jsx
// =============================
import React, { useState } from 'react';
import ConfigLayout from '../shared/ConfigLayout';
import EntityList from '../shared/EntityList';
import Section from '../shared/Section';
import UsagePanel from '../shared/UsagePanel';

const dummyProducts = [
    {
        id: 1,
        name: 'Coca Cola',
        category: 'Beverages',
        variants: [
            { id: 1, name: '500ml', stock: 120 },
            { id: 2, name: '1L', stock: 80 }
        ],
        pricing: [
            { tier: 'Retail', price: 10 },
            { tier: 'Wholesale', price: 8 }
        ],
        usage: { orders: 120, revenue: 5000, warehouses: 2 }
    }
];

const ProductsPage = () => {
    const [products] = useState(dummyProducts);
    const [selected, setSelected] = useState(products[0]);

    return (
        <ConfigLayout
            title="Products"
            subtitle="Manage catalog"
            actions={<button className="bg-blue-600 text-white px-4 py-2 rounded">+ New</button>}
            sidebar={
                <EntityList
                    items={products}
                    selectedId={selected?.id}
                    onSelect={setSelected}
                    render={(p) => (
                        <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.category}</p>
                        </div>
                    )}
                />
            }
            main={selected && (
                <div>
                    <Section title="Basic Info">
                        <input defaultValue={selected.name} className="border p-2 w-full" />
                    </Section>

                    <Section title="Variants">
                        {selected.variants.map(v => (
                            <div key={v.id} className="border p-2 rounded">
                                {v.name} - Stock: {v.stock}
                            </div>
                        ))}
                    </Section>

                    <Section title="Pricing">
                        {selected.pricing.map(p => (
                            <div key={p.tier} className="flex justify-between">
                                <span>{p.tier}</span>
                                <span>₵{p.price}</span>
                            </div>
                        ))}
                    </Section>
                </div>
            )}
            context={<UsagePanel data={selected?.usage || {}} />}
        />
    );
};

export default ProductsPage;