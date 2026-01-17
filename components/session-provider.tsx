"use client";

import { useSession } from "@/lib/auth-client";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
