"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { NavAuthTrigger } from "@/components/auth/NavAuthTrigger";

const travelTextShadow = Array.from(
  { length: 14 },
  (_, index) =>
    `${index + 1}px ${index + 1}px 0 var(--tourmate-coral-dark)}`
).join(", ");

const ArrowGoldLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[var(--tourmate-gold)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGoldRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[var(--tourmate-gold)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const ArrowInkLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[var(--tourmate-ink)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const ArrowInkRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible text-[var(--tourmate-ink)]"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const CircularBadge = ({ onStart }: { onStart: () => void }) => {
  const { status } = useSession();
  const label = "START YOUR JOURNEY NOW";

  return (
    <button
      type="button"
      onClick={onStart}
      aria-label={
        status === "authenticated"
          ? "View your profile"
          : "Start your journey with Google"
      }
      className="relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-[3px] border-[var(--tourmate-line)] bg-[var(--tourmate-gold)] shadow-xl transition-transform hover:scale-105 md:h-36 md:w-36"
    >
      <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            id="circlePath"
            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
          <text
            className="text-[11px] font-black uppercase tracking-[0.18em]"
            fill="var(--tourmate-ink)"
          >
            <textPath href="#circlePath" startOffset="0%">
              {label} •
            </textPath>
          </text>
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-10 w-10 overflow-visible text-[var(--tourmate-ink)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20,80 Q 40,50 30,30 T 80,20" />
          <path d="M60,10 L80,20 L70,40" />
        </svg>
      </div>
    </button>
  );
};

export const HeroComponent = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleOpenAuth = () => {
    setShowDialog(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[var(--tourmate-ink)] font-sans selection:bg-[var(--tourmate-gold)] selection:text-[var(--tourmate-ink)]">
      <nav className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-1">
          <div className="relative rounded-2xl rounded-bl-sm bg-[var(--tourmate-paper)] px-3 py-1.5 text-xs font-black tracking-tight text-[var(--tourmate-ink)] shadow-sm md:text-sm">
            Tour
            <div
              className="absolute -bottom-1.5 left-0 h-3 w-3 bg-[var(--tourmate-paper)]"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
          </div>

          <div className="rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-[var(--tourmate-gold)] px-3 py-1.5 text-xs font-black text-[var(--tourmate-ink)] shadow-sm md:text-sm">
            Mate.AI
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://homepage-indol-psi.vercel.app/"
            aria-label="Return to TourMate Home"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-4 sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            <span className="hidden sm:inline">TourMate Home</span>
            <span className="sm:hidden">Home</span>
          </a>

          <NavAuthTrigger onClick={handleOpenAuth} />
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-32 pt-8 md:pb-48 md:pt-12">
        <div className="relative z-10 mx-auto mb-16 mt-4 flex w-full max-w-5xl flex-col items-center justify-center text-center">
          <div className="relative z-10 flex w-full flex-col items-center space-y-2 md:space-y-4">
            <div className="relative z-30 flex w-full justify-start pl-[10%] md:pl-[25%]">
              <h1
                className="m-0 p-0 text-[clamp(4.5rem,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter text-[var(--tourmate-gold)]"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: travelTextShadow,
                }}
              >
                #TRAVEL
              </h1>
            </div>

            <div className="relative z-20 flex w-full justify-center">
              <h1
                className="m-0 p-0 text-[clamp(5rem,15vw,220px)] font-black uppercase leading-[0.85] tracking-tighter text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: travelTextShadow,
                }}
              >
                SOCIALIFY
              </h1>
            </div>

            <div className="relative z-10 flex w-full justify-start pl-[15%] md:pl-[30%]">
              <h1
                className="m-0 p-0 text-[clamp(4.5rem,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: travelTextShadow,
                }}
              >
                PEOPLE
              </h1>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-auto absolute bottom-[-10%] left-[10%] z-30 md:left-[7%]"
            >
              <div className="flex aspect-[3/3.5] w-40 rotate-[-12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-52">
                <div className="mb-4 flex h-20 w-30 items-center justify-center overflow-hidden rounded-lg border-[3px] border-white/50 bg-[var(--tourmate-sand)] shadow-inner md:h-24 md:w-24">
                  <Image
                    src="/tour1.jpg"
                    alt="A sample travel photograph"
                    className="h-full w-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-white md:text-lg">
                    POV: You Actually Planned the Trip.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="pointer-events-auto absolute right-[10%] top-[2%] z-30 md:right-[-20%]"
            >
              <div className="flex aspect-[3/3.5] w-40 rotate-[12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-52">
                <div className="mb-4 flex h-20 w-30 items-center justify-center overflow-hidden rounded-lg border-[3px] border-white/50 bg-[var(--tourmate-ink)] shadow-inner md:h-24 md:w-24">
                  <Image
                    src="/tour2.jpg"
                    alt="A sample travel photograph"
                    className="h-full w-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>

                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-white md:text-lg">
                    Your Passport Deserves Better.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-[0%] left-[0%] z-20 h-24 w-24 md:left-[-5%] md:h-32 md:w-32">
              <ArrowGoldLeft />
            </div>

            <div className="absolute right-[10%] top-[-23%] z-20 h-24 w-24 md:right-[-20%] md:h-32 md:w-32">
              <ArrowGoldRight />
            </div>

            <div className="pointer-events-auto absolute bottom-[-10%] right-[0%] z-40 md:right-[-10%]">
              <CircularBadge onStart={handleOpenAuth} />
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-20 mt-auto w-full rounded-t-[2.5rem] bg-[var(--tourmate-paper)] px-6 py-12 text-[var(--tourmate-ink)] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] md:rounded-t-[3.5rem] md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Snap the Moment
            </h3>

            <p className="mb-auto text-[10px] font-bold text-[var(--tourmate-dim)] md:text-xs">
              Upload a photo of any landmark or monument and let AI recognize
              it.
            </p>

            <div className="relative mt-6 flex w-full justify-center">
              <div className="relative z-10 flex items-center rounded-2xl bg-[var(--tourmate-coral)] p-2 pr-16 text-white shadow-lg">
                <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-white/30 bg-[var(--tourmate-sky)]">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=c4e9f7"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">
                    Scan Place
                  </p>
                </div>
              </div>

              <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-xl bg-[var(--tourmate-gold)] px-3 py-2 text-[10px] font-black text-[var(--tourmate-ink)] shadow-md">
                Scan now
              </div>
            </div>

            <div className="absolute -right-12 bottom-8 z-30 hidden h-16 w-16 md:block">
              <ArrowInkLeft />
            </div>
          </div>

          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Discover the Story
            </h3>

            <p className="mb-auto text-[10px] font-bold text-[var(--tourmate-dim)] md:text-xs">
              Learn the history, fun facts, nearby attractions, restaurants,
              weather, and travel tips.
            </p>

            <div className="relative mt-6 flex w-full justify-center">
              <div className="flex items-center rounded-full bg-[var(--tourmate-teal)] p-1.5 text-white shadow-lg">
                <div className="mr-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">
                  Explore
                </div>
                <div className="px-4 text-xs font-bold">Now</div>
              </div>

              <div className="absolute -bottom-6 right-1/3 z-20 rotate-12 rounded-full bg-[var(--tourmate-gold)] p-2.5 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[var(--tourmate-ink)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>

            <div className="absolute -right-12 bottom-8 z-30 hidden h-16 w-16 md:block">
              <ArrowInkRight />
            </div>
          </div>

          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Start Exploring
            </h3>

            <p className="mb-auto text-[10px] font-bold text-[var(--tourmate-dim)] md:text-xs">
              Find travel buddies, join local groups, and turn every
              destination into an unforgettable experience.
            </p>

            <div className="relative mt-6 flex w-full max-w-[200px] flex-col items-center rounded-[2rem] bg-[var(--tourmate-gold)] px-6 py-4 text-[var(--tourmate-ink)] shadow-lg">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider">
                Begin Journey
              </p>
              <p className="text-l font-black">Begin your journey now</p>
              <div className="absolute -bottom-2 left-8 h-5 w-5 rotate-45 bg-[var(--tourmate-gold)]" />
            </div>
          </div>
        </div>
      </section>

      <AuthDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};
