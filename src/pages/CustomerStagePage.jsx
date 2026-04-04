import { useState, useEffect } from "react";
import StageHeader from "./components/StageHeader";
import StageBoard from "./components/StageBoard";

// Mock Data
const mockCustomers = [
    { id: 1, name: "ABC Trading", type: "business", stage: "active", creditUsed: 5000 },
    { id: 2, name: "John Doe", type: "individual", stage: "new" },
    { id: 3, name: "XYZ Ventures", type: "business", stage: "credit" },
    { id: 4, name: "Kofi Store", type: "business", stage: "risk" },
];

export default function CustomerStagePage() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        setCustomers(mockCustomers);
    }, []);

    const updateStage = (id, newStage) => {
        setCustomers((prev) =>
            prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
        );
    };

    return (
        <div className="space-y-6">
            <StageHeader />
            <StageBoard customers={customers} onMove={updateStage} />
        </div>
    );
}