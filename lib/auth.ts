import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getPrisma } from "@/lib/prisma";

const appUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "";
const isSecure = appUrl.startsWith("https://");

type Auth = ReturnType<typeof betterAuth>;

let cachedAuth: Auth | null = null;

/**
 * Returns the Better Auth instance, initializing it lazily on first use so
 * the D1-backed Prisma client is only created inside a request context.
 */
export async function getAuth(): Promise<Auth> {
  if (cachedAuth) return cachedAuth;

  const prisma = await getPrisma();
  cachedAuth = betterAuth({
    baseURL: appUrl,
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    advanced: {
      useSecureCookies: isSecure,
    },
    trustedOrigins: appUrl ? [appUrl] : [],
  });

  return cachedAuth;
}
