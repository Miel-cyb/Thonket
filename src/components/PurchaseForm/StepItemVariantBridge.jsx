import React, { useMemo } from "react";
import { ProductVariantElement } from "../OperationsDashboard/setup/catalog/ProductVariant";

/**
 * Converts StepItem form state <-> ProductVariantElement schema
 * This is the ONLY transformation layer
 */
export default function StepItemVariantBridge({ newItem, setNewItem, product }) {

    // Convert flat state → ProductVariantElement format
    const variant = useMemo(() => ({
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

    // Convert ProductVariantElement → flat state
    const handleUpdate = (updated) => {
        const attrs = updated.attributes || [];

        setNewItem(prev => ({
            ...prev,
            sku: updated.sku ?? prev.sku,
            barcode: updated.barcode ?? prev.barcode,
            unitOfMeasure: updated.unitOfMeasure ?? prev.unitOfMeasure,
            packagingFactor: updated.packagingFactor ?? prev.packagingFactor,
            weightKg: updated.weightKg ?? prev.weightKg,
            volumeM3: updated.volumeM3 ?? prev.volumeM3,
            isActive: updated.isActive ?? prev.isActive,
            image: updated.image ?? prev.image,

            // Re-map attributes cleanly back to flat keys by ignoring case mismatch traps
            variantSize: attrs.find(a => a.type.toLowerCase() === "size")?.value || "",
            variantColor: attrs.find(a => a.type.toLowerCase() === "color")?.value || "",
            variantMaterial: attrs.find(a => a.type.toLowerCase() === "material")?.value || "",
            variantFlavor: attrs.find(a => a.type.toLowerCase() === "flavor")?.value || ""
        }));
    };

    const handleClear = () => {
        setNewItem(prev => ({
            ...prev,
            variantSize: "",
            variantColor: "",
            variantMaterial: "",
            variantFlavor: ""
        }));
    };

    return (
        <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <ProductVariantElement
                variant={variant}
                product={product}
                onUpdate={handleUpdate}
                onRemove={handleClear}
            />
        </div>
    );
}