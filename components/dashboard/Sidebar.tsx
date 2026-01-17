import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Hexagon,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 left-0 p-6 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <Hexagon className="w-8 h-8 text-primary fill-primary/20" />
                <span className="text-xl font-bold font-sans text-gray-800">GAK</span>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="mb-8">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                        Menu
                    </h3>
                    <nav className="space-y-1">
                        <NavItem
                            href="/"
                            icon={<LayoutDashboard size={20} />}
                            label="Dashboard"
                            active={pathname === "/"}
                        />
                        <NavItem
                            href="/congregations"
                            icon={<Users size={20} />}
                            label="Congregations"
                            active={pathname === "/congregations"}
                        />
                        <NavItem
                            href="/attendance"
                            icon={<Calendar size={20} />}
                            label="Attendance"
                            active={pathname === "/attendance"}
                        />
                    </nav>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                        General
                    </h3>
                    <nav className="space-y-1">
                        <NavItem
                            href="/settings"
                            icon={<Settings size={20} />}
                            label="Settings"
                            active={pathname === "/settings"}
                        />
                        <LogoutButton />
                    </nav>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-6 mx-auto w-full">
                <div className="bg-gray-900 rounded-2xl p-4 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center mb-3">
                            <Hexagon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">GAK Dashboard</h4>
                        <p className="text-[10px] text-gray-400">Manage your congregation</p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-xl -mr-5 -mb-5"></div>
                </div>
            </div>
        </aside>
    );
}

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    className?: string;
}

function NavItem({ href, icon, label, active, className }: NavItemProps) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                } ${className || ""}`}
        >
            <span className={active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}>
                {icon}
            </span>
            <span className="flex-1">{label}</span>
        </Link>
    );
}
