"use client";

import { useSession } from "@/lib/auth-client";
import { User, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Pengaturan
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Kelola profil dan pengaturan akun Anda.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Informasi Profil
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Nama</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-medium text-gray-900">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
