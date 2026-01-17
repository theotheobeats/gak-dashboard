"use client";

import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "@/components/sign-out-button";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <SignOutButton />
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome back!
          </h2>

          {session?.user ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Name
                </p>
                <p className="text-lg text-zinc-900 dark:text-zinc-50">
                  {session.user.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Email
                </p>
                <p className="text-lg text-zinc-900 dark:text-zinc-50">
                  {session.user.email}
                </p>
              </div>

              {session.user.image && (
                <div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Profile Image
                  </p>
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="mt-2 h-20 w-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">
              No user session found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
