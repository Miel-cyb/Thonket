import {
    ShoppingCart,
    UserPlus,
    ClipboardList,
    AlertTriangle
} from "lucide-react";

export default function QuickActionsBar() {
    const actions = [
        {
            title: "New Order",
            description: "Create order for customer",
            icon: ShoppingCart,
            color: "bg-purple-600",
            hover: "hover:bg-purple-700",
            onClick: () => console.log("Create Order"),
        },
        {
            title: "Add Customer",
            description: "Register new customer",
            icon: UserPlus,
            color: "bg-blue-600",
            hover: "hover:bg-blue-700",
            onClick: () => console.log("Add Customer"),
        },
        {
            title: "View Orders",
            description: "Check all orders",
            icon: ClipboardList,
            color: "bg-gray-800",
            hover: "hover:bg-gray-900",
            onClick: () => console.log("View Orders"),
        },
        {
            title: "Pending Issues",
            description: "Resolve problems",
            icon: AlertTriangle,
            color: "bg-red-600",
            hover: "hover:bg-red-700",
            onClick: () => console.log("View Issues"),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {actions.map((action, index) => {
                const Icon = action.icon;

                return (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`flex items-center gap-4 rounded-2xl p-4 text-white shadow-md transition-all 
              ${action.color} ${action.hover} hover:shadow-lg hover:-translate-y-1`}
                    >
                        {/* Icon */}
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Icon size={20} />
                        </div>

                        {/* Text */}
                        <div className="text-left">
                            <p className="font-semibold">{action.title}</p>
                            <p className="text-xs text-white/80">
                                {action.description}
                            </p>
                        </div>
                    </button>
                );
            })}

        </div>
    );
}