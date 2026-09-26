"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex min-h-12 w-full items-center gap-3 rounded-2xl border-2 border-transparent px-3 text-sm font-semibold text-mute transition-all duration-100 hover:bg-canvas hover:text-ink"
    >
      <LogOut size={20} />
      <span className="flex-1 text-left">Keluar</span>
    </button>
  );
}
