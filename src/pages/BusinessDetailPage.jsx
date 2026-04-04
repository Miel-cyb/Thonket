import { useState, useEffect } from "react";
import BusinessHeader from "../components/BusinessDetails/BusinessHeader";
import BusinessTabs from "../components/BusinessDetails/BusinessTabs";
import OverviewTab from "../components/BusinessDetails/OverviewTab";
import BranchesTab from "../components/BusinessDetails/BranchesTab";
import TransactionsTab from "../components/BusinessDetails/TransactionsTab";

// Mock API
const mockBusiness = {
    id: 1,
    name: "ABC Trading",
    creditLimit: 10000,
    creditUsed: 5000,
    risk: "medium",
    totalPurchases: 20000,
    profit: 4000,
    branches: [
        {
            id: 1,
            name: "Accra Branch",
            location: "Accra",
            sales: 12000,
            outstanding: 3000,
            lastActivity: "2026-04-01",
        },
        {
            id: 2,
            name: "Kumasi Branch",
            location: "Kumasi",
            sales: 8000,
            outstanding: 2000,
            lastActivity: "2026-03-30",
        },
    ],
    transactions: [
        { id: 1, amount: 2000, type: "credit", date: "2026-04-01" },
        { id: 2, amount: 1000, type: "payment", date: "2026-03-29" },
    ],
};

export default function BusinessDetailPage() {
    const [business, setBusiness] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        // Replace with API call
        setBusiness(mockBusiness);
    }, []);

    if (!business) return <div>Loading...</div>;

    return (
        <div className="space-y-6">

            <BusinessHeader business={business} />

            <BusinessTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === "overview" && <OverviewTab business={business} />}
            {activeTab === "branches" && <BranchesTab branches={business.branches} />}
            {activeTab === "transactions" && (
                <TransactionsTab transactions={business.transactions} />
            )}

        </div>
    );
}