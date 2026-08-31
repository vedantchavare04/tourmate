"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { getInitials } from "@/components/auth/get-initials";



export function NavAuthTrigger({ onClick }: { onClick: () => void }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-9 animate-pulse rounded-full bg-white/20"
      />
    );
  }

  if (status === "authenticated" && session.user) {
    const initials = getInitials(session.user.name, session.user.email);
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Open your profile"
        className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/70 bg-[#CCFF00] transition-colors hover:border-white"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Profile picture"}
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs font-black text-black">
            {initials}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white px-6 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-[#0038FF] md:text-sm"
    >
      Start Your Journey
    </button>
  );
}