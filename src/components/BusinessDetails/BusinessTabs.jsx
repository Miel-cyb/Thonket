export default function BusinessTabs({ activeTab, setActiveTab }) {
    const tabs = ["overview", "branches", "transactions"];

    return (
        <div className="flex gap-4 border-b">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize ${activeTab === tab
                            ? "border-b-2 border-black font-semibold"
                            : "text-gray-500"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}