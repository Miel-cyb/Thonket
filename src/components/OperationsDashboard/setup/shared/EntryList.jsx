// =============================
// FILE: /setup/shared/EntityList.jsx
// =============================
import React from 'react';

const EntityList = ({ items, selectedId, onSelect, render }) => (
    <div>
        {items.map(item => (
            <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={`p-3 border-b cursor-pointer ${selectedId === item.id ? 'bg-blue-50' : ''}`}
            >
                {render(item)}
            </div>
        ))}
    </div>
);

export default EntityList;