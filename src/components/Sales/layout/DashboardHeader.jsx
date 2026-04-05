import UserMenu from "../../UserMenu";

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Left */}
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Sales Dashboard
                    </h1>
                    <p className="text-sm text-gray-500">
                        Welcome back here’s what’s happening today
                    </p>
                </div>

                {/* Right */}
                <UserMenu />

            </div>
        </header>
    );
}