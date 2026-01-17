import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Hexagon,
    Package,
    ImageIcon,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 left-0 p-4 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
                <Hexagon className="w-7 h-7 text-primary fill-primary/20" />
                <span className="text-lg font-bold font-sans text-gray-800">GAK</span>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="mb-6">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                        Menu
                    </h3>
                    <nav className="space-y-1">
                        <NavItem
                            href="/"
                            icon={<LayoutDashboard size={18} />}
                            label="Dashboard"
                            active={pathname === "/"}
                        />
                        <NavItem
                            href="/congregations"
                            icon={<Users size={18} />}
                            label="Jemaat"
                            active={pathname === "/congregations"}
                        />
                        <NavItem
                            href="/attendance"
                            icon={<Calendar size={18} />}
                            label="Kehadiran"
                            active={pathname === "/attendance"}
                        />
                        <NavItem
                            href="/inventory"
                            icon={<Package size={18} />}
                            label="Inventaris"
                            active={pathname === "/inventory"}
                        />
                        <NavItem
                            href="/media"
                            icon={<ImageIcon size={18} />}
                            label="Media"
                            active={pathname === "/media"}
                            disabled
                        />
                    </nav>
                </div>

                <div>
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                        Umum
                    </h3>
                    <nav className="space-y-1">
                        <NavItem
                            href="/settings"
                            icon={<Settings size={18} />}
                            label="Pengaturan"
                            active={pathname === "/settings"}
                        />
                        <LogoutButton />
                    </nav>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-4 mx-auto w-full">
                <div className="bg-gray-900 rounded-xl p-3 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-7 h-7 bg-gray-700/50 rounded-lg flex items-center justify-center mb-2">
                            <Hexagon className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-xs mb-0.5">Dashboard GAK</h4>
                        <p className="text-[9px] text-gray-400">Kelola jemaat Anda</p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full blur-xl -mr-4 -mb-4"></div>
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
    disabled?: boolean;
    className?: string;
}

function NavItem({ href, icon, label, active, disabled, className }: NavItemProps) {
    if (disabled) {
        return (
            <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed ${className || ""}`}
            >
                <span className="text-gray-400">
                    {icon}
                </span>
                <span className="flex-1">{label}</span>
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group text-sm ${active
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
