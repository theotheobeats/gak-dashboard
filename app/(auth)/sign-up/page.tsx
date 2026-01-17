"use client";

import { Hexagon, Lock } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Hexagon className="w-8 h-8 text-primary fill-primary/20" />
          <span className="text-xl font-bold text-gray-900">GAK</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pendaftaran Ditutup
            </h1>
            <p className="text-gray-500 text-sm">
              Hubungi Dkn. Theo untuk request akun dan akses ke dashboard
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              Untuk keamanan dan pengelolaan yang lebih baik, pembuatan akun baru dilakukan secara manual oleh administrator.
            </p>
          </div>

          <Link
            href="/sign-in"
            className="block w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-primary/20 text-center text-sm"
          >
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
