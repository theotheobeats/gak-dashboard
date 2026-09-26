"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu, X } from "lucide-react";
import { LoadingBlock } from "@/components/ui/Feedback";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingBlock label="Memuat sesi…" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r-2 border-edge bg-surface transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-64">
        <div className="flex items-center justify-between gap-3 border-b-2 border-edge bg-surface p-3 lg:hidden">
          <button
            type="button"
            aria-label={sidebarOpen ? "Tutup menu" : "Buka menu"}
            onClick={() => setSidebarOpen((open) => !open)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-edge bg-surface text-ink shadow-[0_4px_0_var(--device-edge-dark)] active:translate-y-[4px] active:shadow-none"
          >
            {sidebarOpen ? (
              <X size={24} strokeWidth={3} />
            ) : (
              <Menu size={24} strokeWidth={3} />
            )}
          </button>
          <span className="truncate text-sm font-black uppercase tracking-tight text-ink">
            GAK Dashboard
          </span>
          <span className="w-12" />
        </div>

        <div className="flex-1 overflow-auto p-3 sm:p-5 lg:p-7">
          {children}
        </div>

        <footer className="border-t-2 border-edge bg-surface px-4 py-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-mute sm:flex-row">
            <p>© {new Date().getFullYear()} Gereja Anugerah Kristus</p>
            <p>Developed by TITU LABS</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
