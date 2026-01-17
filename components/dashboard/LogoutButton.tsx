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
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-gray-500 hover:bg-gray-50 hover:text-gray-900 w-full"
    >
      <span className="text-gray-400 group-hover:text-gray-600">
        <LogOut size={20} />
      </span>
      <span className="flex-1 text-left">Keluar</span>
    </button>
  );
}
