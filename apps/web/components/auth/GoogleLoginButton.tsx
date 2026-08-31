"use client";

import { StartJourneyButton } from "@/components/auth/StartJourneyButton";

export default function GoogleLoginButton() {
  return (
    <StartJourneyButton className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90">
      Continue with Google
    </StartJourneyButton>
  );
}
