"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StartJourneyButton } from "@/components/auth/StartJourneyButton";

/**
 * Centered confirmation dialog. Open it from any "Start your journey" /
 * "Continue with Google" trigger; the actual sign-in call lives inside
 * StartJourneyButton, this just frames it.
 */
export function GoogleSignInDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
            aria-labelledby="journey-dialog-title"
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

            <h2
              id="journey-dialog-title"
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}