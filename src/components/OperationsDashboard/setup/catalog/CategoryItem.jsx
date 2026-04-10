import React, { useState } from 'react'; // ✅ Import React for JSX and useState
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';

export const CategoryItem = ({ item, level = 0, onSelect, selectedId }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedId === item._id; // match API _id

    return (
        <div className="select-none">
            <div
                onClick={() => onSelect(item)}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                style={{ marginLeft: `${level * 16}px` }}
            >
                {item.children?.length > 0 ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                        className={`p-1 rounded-md transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    >
                        <ChevronRight size={14} />
                    </button>
                ) : (
                    <div className="w-6" />
                )}

                {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
            </div>

            {isOpen && item.children?.map(child => (
                <CategoryItem
                    key={child._id} // unique key
                    item={child}
                    level={level + 1}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            ))}
        </div>
    );
};