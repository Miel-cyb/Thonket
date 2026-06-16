import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import StepItemFormPanel from "./StepItemFormPanel";
import StepItemsTable from "./StepItemsTable";

import { API_ENDPOINTS } from "../../utils/urls";

// MAIN COMPONENT FOR STEP 2 - MANAGES ITEM SELECTION AND DISPLAY
export default function StepItemsBuilder({ form, setForm }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                axios.get(`${API_ENDPOINTS.CATEGORIES}/hierarchy/all`),
                axios.get(`${API_ENDPOINTS.PRODUCTS}/catalog`)
            ]);

            console.log("Fetched categories:", catRes.data);
            console.log("Fetched products:", prodRes.data);

            setCategories(catRes.data?.data || catRes.data || []);
            setProducts(prodRes.data?.data || prodRes.data || []);

        } catch (err) {
            console.error("Failed to load catalog data", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-6">
            <StepItemFormPanel
                categories={categories}
                products={products}
                setForm={setForm}
            />

            <StepItemsTable
                items={form?.items || []}
                setForm={setForm}
            />
        </div>
    );
}