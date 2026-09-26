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
    <aside className="flex h-screen w-64 flex-col bg-surface p-4">
      <div className="mb-6 flex items-center gap-3 px-1">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-ink">
          <Hexagon className="h-5 w-5 text-screen-ink" strokeWidth={2.5} />
        </span>
        <span className="min-w-0">
          <span className="block text-base font-black uppercase tracking-tight text-ink">
            GAK
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
            Dashboard
          </span>
        </span>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            Menu
          </h3>
          <nav className="space-y-2">
            <NavItem
              href="/"
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active={pathname === "/"}
            />
            <NavItem
              href="/congregations"
              icon={<Users size={20} />}
              label="Jemaat"
              active={pathname.startsWith("/congregations")}
            />
            <NavItem
              href="/attendance"
              icon={<Calendar size={20} />}
              label="Kehadiran"
              active={pathname.startsWith("/attendance")}
            />
            <NavItem
              href="/inventory"
              icon={<Package size={20} />}
              label="Inventaris"
              active={pathname.startsWith("/inventory")}
            />
            <NavItem
              href="/media"
              icon={<ImageIcon size={20} />}
              label="Media"
              active={pathname.startsWith("/media")}
              disabled
            />
          </nav>
        </div>

        <div>
          <h3 className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            Umum
          </h3>
          <nav className="space-y-2">
            <NavItem
              href="/settings"
              icon={<Settings size={20} />}
              label="Pengaturan"
              active={pathname.startsWith("/settings")}
            />
            <LogoutButton />
          </nav>
        </div>
      </div>

      <div className="mt-4">
        <div className="relative overflow-hidden rounded-[24px] border-2 border-ink bg-screen p-4 text-screen-ink">
          <div className="relative z-10">
            <Hexagon className="mb-2 h-5 w-5 text-screen-ink/70" strokeWidth={2.5} />
            <h4 className="text-sm font-black uppercase tracking-tight">
              GAK Palembang
            </h4>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-screen-ink/60">
              Kelola jemaat
            </p>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 opacity-30 bg-[radial-gradient(circle,#93c5fd_1px,transparent_1px)] bg-[size:7px_7px]"
          />
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
}

function NavItem({ href, icon, label, active, disabled }: NavItemProps) {
  if (disabled) {
    return (
      <div className="flex min-h-12 items-center gap-3 rounded-2xl border-2 border-transparent px-3 text-sm font-semibold text-mute/60">
        {icon}
        <span className="flex-1">{label}</span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex min-h-12 items-center gap-3 rounded-2xl border-2 px-3 text-sm font-semibold transition-all duration-100 ${
        active
          ? "border-accent-dark bg-accent/10 text-accent-dark"
          : "border-transparent text-mute hover:bg-canvas hover:text-ink"
      }`}
    >
      <span className={active ? "text-accent" : "text-mute"}>{icon}</span>
      <span className="flex-1">{label}</span>
    </Link>
  );
}
