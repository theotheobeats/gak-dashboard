"use client";

import { useRouter } from "next/navigation";
import { Mail, LogOut, Shield, User } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { PageShell, Card } from "@/components/ui/Shell";
import { PageHeader } from "@/components/ui/PageHeader";
import { BigButton } from "@/components/ui/BigButton";
import { DisplayPanel } from "@/components/ui/DisplayPanel";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const name = session?.user?.name || "—";
  const email = session?.user?.email || "—";

  return (
    <PageShell>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Akun"
          title="Pengaturan"
          subtitle="Kelola profil dan pengaturan akun Anda"
        />

        <DisplayPanel
          label="Masuk sebagai"
          value={name}
          sub={email}
          hint="admin"
        />

        <Card title="Informasi profil">
          <div className="space-y-3">
            <div className="flex min-h-16 items-center gap-4 rounded-2xl border-2 border-edge bg-canvas px-4 py-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <User size={24} strokeWidth={2.5} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                  Nama
                </span>
                <span className="block truncate text-base font-bold text-ink">
                  {name}
                </span>
              </span>
            </div>

            <div className="flex min-h-16 items-center gap-4 rounded-2xl border-2 border-edge bg-canvas px-4 py-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Mail size={24} strokeWidth={2.5} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                  Email
                </span>
                <span className="block truncate text-base font-bold text-ink">
                  {email}
                </span>
              </span>
            </div>

            <div className="flex min-h-16 items-center gap-4 rounded-2xl border-2 border-edge bg-canvas px-4 py-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Shield size={24} strokeWidth={2.5} />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                  Peran
                </span>
                <span className="block text-base font-bold text-ink">Admin</span>
              </span>
            </div>
          </div>
        </Card>

        <Card title="Sesi">
          <p className="mb-4 text-sm text-mute">
            Keluar dari dashboard pada perangkat ini.
          </p>
          <BigButton variant="danger" block onClick={handleLogout}>
            <LogOut size={22} strokeWidth={3} />
            Keluar
          </BigButton>
        </Card>
      </div>
    </PageShell>
  );
}
