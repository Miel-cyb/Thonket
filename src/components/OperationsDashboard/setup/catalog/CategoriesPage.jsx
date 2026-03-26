// =============================
// FILE: /setup/catalog/CategoriesPage.jsx
// =============================
import React, { useState } from 'react';
import ConfigLayout from '../shared/ConfigLayout';
import EntityList from '../shared/EntityList';
import Section from '../shared/Section';
import UsagePanel from '../shared/UsagePanel';

const dummyCategories = [
    { id: 1, name: 'Beverages', usage: { orders: 200, revenue: 10000, warehouses: 3 } },
    { id: 2, name: 'Snacks', usage: { orders: 150, revenue: 7000, warehouses: 2 } }
];

const CategoriesPage = () => {
    const [categories] = useState(dummyCategories);
    const [selected, setSelected] = useState(categories[0]);

    return (
        <ConfigLayout
            title="Categories"
            subtitle="Organize products"
            actions={<button className="bg-blue-600 text-white px-4 py-2 rounded">+ New</button>}
            sidebar={
                <EntityList
                    items={categories}
                    selectedId={selected?.id}
                    onSelect={setSelected}
                    render={(c) => <p className="font-medium">{c.name}</p>}
                />
            }
            main={selected && (
                <Section title="Category Details">
                    <input defaultValue={selected.name} className="border p-2 w-full" />
                </Section>
            )}
            context={<UsagePanel data={selected?.usage || {}} />}
        />
    );
};

export default CategoriesPage;