"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { StartJourneyButton } from "@/components/auth/StartJourneyButton";
import { getInitials } from "@/components/auth/get-initials";


export function AuthDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session, status } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      // signOut navigates away on success; only reachable on failure.
      setSigningOut(false);
    }
  }

  const user = session?.user;
  const initials = getInitials(user?.name, user?.email);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-dialog-title"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-8 text-center shadow-2xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-black/30" />
              </div>
            )}

            {status === "authenticated" && user && (
              <>
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-black/10 bg-[#CCFF00]">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "Profile picture"}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-black text-black">
                      {initials}
                    </div>
                  )}
                </div>

                <h2 id="auth-dialog-title" className="text-lg font-black text-black md:text-xl">
                  {user.name ?? "Signed in"}
                </h2>
                <p className="mt-1 text-xs font-bold text-black/60 md:text-sm">
                  {user.email}
                </p>

                <div className="mt-6 border-t border-black/10 pt-6">
                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {signingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing out…</span>
                      </>
                    ) : (
                      <span>Sign out</span>
                    )}
                  </button>
                </div>
              </>
            )}

            {status === "unauthenticated" && (
              <>
                <h2
                  id="auth-dialog-title"
                  className="text-xl font-black uppercase leading-tight text-black md:text-2xl"
                >
                  Ready to roll?
                </h2>
                <p className="mt-2 text-xs font-bold text-black/60 md:text-sm">
                  Sign in to start planning, sharing, and syncing your trips.
                </p>

                <div className="mt-6">
                  <StartJourneyButton
                    callbackUrl="/"
                    className="w-full justify-center rounded-full bg-black px-6 py-3 text-sm font-bold text-white hover:bg-black/90"
                  />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}