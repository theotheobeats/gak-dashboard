"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Hexagon, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { PageShell } from "@/components/ui/Shell";
import { BigButton } from "@/components/ui/BigButton";
import { IconField } from "@/components/ui/Input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal masuk");
    } finally {
      setLoading(false);
    }
  };

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
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
                Dashboard GAK
              </p>
              <h1 className="mt-2 text-xl font-black uppercase tracking-tight text-ink">
                Selamat Datang Kembali
              </h1>
              <p className="mt-1 text-sm text-mute">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <IconField
                label="Alamat email"
                icon={<Mail size={20} />}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="anda@contoh.com"
              />

              <IconField
                label="Kata sandi"
                icon={<Lock size={20} />}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="•••••••••"
              />

              <BigButton type="submit" size="xl" block disabled={loading}>
                {loading ? (
                  "Masuk…"
                ) : (
                  <>
                    Masuk
                    <ArrowRight size={24} strokeWidth={3} />
                  </>
                )}
              </BigButton>
            </form>

            <p className="text-center text-sm text-mute">
              Belum punya akun?{" "}
              <Link href="/sign-up" className="font-bold text-accent-dark">
                Daftar
              </Link>
            </p>
          </div>
        </PageShell>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
          © {new Date().getFullYear()} Gereja Anugerah Kristus
        </p>
      </div>
    </main>
  );
}
