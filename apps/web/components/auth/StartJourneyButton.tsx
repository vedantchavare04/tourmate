"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";


export function StartJourneyButton({
  callbackUrl = "/",
  className,
  children = "Continue with Google",
  icon = true,
}: {
  callbackUrl?: string;
  className?: string;
  children?: ReactNode;
  icon?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleClick}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-2.5",
          "rounded-xl bg-[#122019] px-6 py-3 text-[15px] font-medium text-[#F5F3EE]",
          "transition-colors duration-150 ease-out",
          "hover:bg-[#1B2E23] active:bg-[#0D1712]",
          "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#122019]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#122019]"
        ),
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="inline-flex items-center gap-2.5"
          >
            <Loader2 className="h-[18px] w-[18px] animate-spin" />
            <span>Connecting…</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="inline-flex items-center gap-2.5"
          >
            {icon && <GoogleMark />}
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
