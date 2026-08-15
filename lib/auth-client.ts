import { createAuthClient } from "better-auth/react";

// No baseURL: better-auth infers the current origin (window.location.origin),
// so auth calls are always same-origin in dev and production. Pinning it to a
// NEXT_PUBLIC_* env var gets inlined at build time and breaks deployed domains.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
