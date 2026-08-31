"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * SessionProvider itself is a client-only export, so it needs this thin
 * client wrapper to be usable from a (server) root layout.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}