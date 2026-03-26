import React from 'react'; // Ensure React is imported for useState to work
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';

// 1. Change name to CategoryItem and add 'export'
export const CategoryItem = ({ item, level = 0, onSelect, selectedId }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const isSelected = selectedId === item.id;

    return (
        <div className="select-none">
            <div
                onClick={() => onSelect(item)}
                className={`flex items-center gap-2 py-2 px-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                style={{ marginLeft: `${level * 16}px` }}
            >
                {/* Check if children exist to show the toggle arrow */}
                {item.children?.length > 0 ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                        className={`p-1 rounded-md transition-transform ${isOpen ? 'rotate-90' : ''}`}
                    >
                        <ChevronRight size={14} />
                    </button>
                ) : (
                    <div className="w-6" /> /* Spacer for alignment */
                )}

                {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
            </div>

            {/* 2. Update the recursive call to use the new name */}
            {isOpen && item.children?.map(child => (
                <CategoryItem
                    key={child.id}
                    item={child}
                    level={level + 1}
                    onSelect={onSelect}
                    selectedId={selectedId}
                />
            ))}
        </div>
    );
};