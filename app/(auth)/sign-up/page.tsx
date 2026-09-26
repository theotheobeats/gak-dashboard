"use client";

import Link from "next/link";
import { Hexagon, Lock } from "lucide-react";
import { PageShell } from "@/components/ui/Shell";
import { bigButtonClass } from "@/components/ui/BigButton";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-ink">
            <Hexagon className="h-6 w-6 text-screen-ink" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-black uppercase tracking-tight text-ink">
            GAK Palembang
          </span>
        </div>

        <PageShell>
          <div className="space-y-5">
            <div className="text-center">
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-edge bg-canvas">
                <Lock className="h-7 w-7 text-mute" strokeWidth={2.5} />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
                Pendaftaran
              </p>
              <h1 className="mt-2 text-xl font-black uppercase tracking-tight text-ink">
                Pendaftaran Ditutup
              </h1>
              <p className="mt-1 text-sm text-mute">
                Hubungi Dkn. Theo untuk request akun dan akses ke dashboard
              </p>
            </div>

            <div className="rounded-2xl border-2 border-edge bg-canvas p-4">
              <p className="text-sm text-mute">
                Untuk keamanan dan pengelolaan yang lebih baik, pembuatan akun
                baru dilakukan secara manual oleh administrator.
              </p>
            </div>

            <Link
              href="/sign-in"
              className={bigButtonClass("primary", "lg", { block: true })}
            >
              Kembali ke Halaman Masuk
            </Link>
          </div>
        </PageShell>
      </div>
    </main>
  );
}
