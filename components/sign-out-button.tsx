"use client";

import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      Sign out
    </button>
  );
}
