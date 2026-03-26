// =============================
// FILE: /setup/catalog/VariantsPage.jsx
// =============================
import React, { useState } from 'react';
import ConfigLayout from '../shared/ConfigLayout';
import EntityList from '../shared/EntityList';
import Section from '../shared/Section';
import UsagePanel from '../shared/UsagePanel';

const dummyVariants = [
    { id: 1, name: '500ml Bottle', stock: 120, usage: { orders: 90, revenue: 2000, warehouses: 2 } },
    { id: 2, name: '1L Bottle', stock: 60, usage: { orders: 40, revenue: 1500, warehouses: 1 } }
];

const VariantsPage = () => {
    const [variants] = useState(dummyVariants);
    const [selected, setSelected] = useState(variants[0]);

    return (
        <ConfigLayout
            title="Variants"
            subtitle="Manage SKUs"
            actions={<button className="bg-blue-600 text-white px-4 py-2 rounded">+ New</button>}
            sidebar={
                <EntityList
                    items={variants}
                    selectedId={selected?.id}
                    onSelect={setSelected}
                    render={(v) => (
                        <div>
                            <p className="font-medium">{v.name}</p>
                            <p className="text-xs text-gray-500">Stock: {v.stock}</p>
                        </div>
                    )}
                />
            }
            main={selected && (
                <div>
                    <Section title="Variant Info">
                        <input defaultValue={selected.name} className="border p-2 w-full" />
                    </Section>

                    <Section title="Stock">
                        <input defaultValue={selected.stock} className="border p-2 w-full" />
                    </Section>
                </div>
            )}
            context={<UsagePanel data={selected?.usage || {}} />}
        />
    );
};

export default VariantsPage;
