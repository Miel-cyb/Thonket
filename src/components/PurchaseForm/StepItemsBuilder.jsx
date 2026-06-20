import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StepItemFormPanel from "./StepItemFormPanel";
import StepItemsTable from "./StepItemsTable";
import { API_ENDPOINTS } from "../../utils/urls";

/**
 * StepItemsBuilder
 * Orchestrates global master data streams for Categories and Products down
 * through creation interfaces and tracking tables seamlessly.
 */
export default function StepItemsBuilder({ form, setForm }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`${API_ENDPOINTS.CATEGORIES}/hierarchy/all`),
                axios.get(`${API_ENDPOINTS.PRODUCTS}/catalog`)
            ]);

            setCategories(catRes.data?.data || catRes.data || []);
            setProducts(prodRes.data?.data || prodRes.data || []);
        } catch (err) {
            console.error("Failed to load catalog data", err);
            setError("Could not synchronize global catalog feeds. Check network connectivity.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 text-sm font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
                    {error}
                </div>
            )}

            <StepItemFormPanel
                categories={categories}
                products={products}
                setForm={setForm}
                globalLoading={loading}
            />

            <StepItemsTable
                items={form?.items || []}
                setForm={setForm}
            />
        </div>
    );
}