import React, { useMemo } from "react";
import { ProductVariantElement } from "../OperationsDashboard/setup/catalog/ProductVariant";

/**
 * StepItemVariantBridge
 * Streamlined interface component. Relies on state passed down from parent context,
 * formatting parameters to fulfill the ProductVariantElement validation signature.
 */
export default function StepItemVariantBridge({ newItem, setNewItem }) {

    // Format downstream data structures into the product payload format
    const productContext = useMemo(() => ({
        name: newItem.productName || newItem.desc || "",
        categoryId: newItem.categoryId || "",
        categoryTree: newItem.categoryTree || [],
        brand: newItem.brand || "nile"
    }), [newItem.productName, newItem.desc, newItem.categoryId, newItem.categoryTree, newItem.brand]);

    // Flatten localized values out to match standard variant object shapes
    const variantContext = useMemo(() => ({
        sku: newItem.sku || "",
        barcode: newItem.barcode || "",
        unitOfMeasure: newItem.unitOfMeasure || "CASE",
        packagingFactor: newItem.packagingFactor ?? "",
        weightKg: newItem.weightKg ?? "",
        volumeM3: newItem.volumeM3 ?? "",
        isActive: newItem.isActive ?? true,
        image: newItem.image || "",
        attributes: [
            ...(newItem.variantSize ? [{ type: "Size", value: newItem.variantSize }] : []),
            ...(newItem.variantColor ? [{ type: "Color", value: newItem.variantColor }] : []),
            ...(newItem.variantMaterial ? [{ type: "Material", value: newItem.variantMaterial }] : []),
            ...(newItem.variantFlavor ? [{ type: "Flavor", value: newItem.variantFlavor }] : [])
        ]
    }), [newItem]);

    const handleUpdate = (updatedFields) => {
        const attrs = updatedFields.attributes || [];

        setNewItem(prev => ({
            ...prev,
            sku: updatedFields.sku ?? prev.sku,
            barcode: updatedFields.barcode ?? prev.barcode,
            unitOfMeasure: updatedFields.unitOfMeasure ?? prev.unitOfMeasure,
            packagingFactor: updatedFields.packagingFactor ?? prev.packagingFactor,
            weightKg: updatedFields.weightKg ?? prev.weightKg,
            volumeM3: updatedFields.volumeM3 ?? prev.volumeM3,
            isActive: updatedFields.isActive ?? prev.isActive,
            image: updatedFields.image ?? prev.image,

            // Parse complex attribute variants back to plain form paths
            variantSize: attrs.find(a => a.type.toLowerCase() === "size")?.value || "",
            variantColor: attrs.find(a => a.type.toLowerCase() === "color")?.value || "",
            variantMaterial: attrs.find(a => a.type.toLowerCase() === "material")?.value || "",
            variantFlavor: attrs.find(a => a.type.toLowerCase() === "flavor")?.value || ""
        }));
    };

    const handleClear = () => {
        setNewItem(prev => ({
            ...prev,
            productName: "",
            brand: "",
            variantSize: "",
            variantColor: "",
            variantMaterial: "",
            variantFlavor: ""
        }));
    };

    return (
        <div className="border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/40">
            <div className="mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
                Live Working Workspace Sync View
            </div>
            <ProductVariantElement
                variant={variantContext}
                product={productContext}
                onUpdate={handleUpdate}
                onRemove={handleClear}
            />
        </div>
    );
}