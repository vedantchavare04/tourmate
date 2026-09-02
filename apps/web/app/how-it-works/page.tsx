"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

interface CardColors {
  bg: string;
  text: string;
  border: string;
}

interface CardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
  rotate?: string;
  colors: CardColors;
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({ number, title, description, className, rotate, colors }: CardProps) => {
  return (
    <div
      className={`relative w-full md:w-[280px] transition-transform duration-300 hover:z-30 hover:scale-105 ${rotate} ${className}`}
    >
      <div className="bg-white p-2 rounded-[25px] shadow-[0px_10px_20px_0px_#D3D3D3] border border-neutral-100">
        <Pin className={`w-8 h-8 ${colors.text} z-20 mb-6 mx-auto`} />
        <div
          className={`${colors.bg} border ${colors.border} rounded-[15px] p-[15px] h-full flex flex-col relative overflow-hidden`}
        >
          <span
            className={`${colors.text} text-4xl mb-5`}
            style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            {number}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-800 leading-none mb-[10px]">
            {title}
          </h3>
          <p className="text-neutral-500 text-sm/5 tracking-tight">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  colors: CardColors;
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[15%]", rotate: "rotate-8" },
  { className: "md:absolute md:top-[120px] md:right-[15%]", rotate: "-rotate-8" },
  { className: "md:absolute md:top-[450px] md:left-[15%]", rotate: "rotate-8" },
  { className: "md:absolute md:top-[570px] md:right-[10%]", rotate: "-rotate-8" },
  { className: "md:absolute md:top-[850px] md:left-[15%]", rotate: "rotate-8" },
];

// Two brand tints, alternated across steps -- same blue/lime pairing as the
// rest of the site instead of the generic orange/blue/purple defaults.
const BLUE: CardColors = {
  bg: "bg-[#EEF1FF]",
  text: "text-[#0038FF]",
  border: "border-[#0038FF]/15",
};

const LIME: CardColors = {
  bg: "bg-[#F9FFDD]",
  text: "text-[#7A8F00]",
  border: "border-[#CCFF00]/50",
};

const DEFAULT_FEATURES: Step[] = [
  {
    title: "Sign In",
    description:
      "Continue with Google and you're in -- no forms, no passwords to remember.",
    colors: BLUE,
  },
  {
    title: "Snap Any Landmark",
    description:
      "Point your camera at a monument or building and let our AI recognize it instantly.",
    colors: LIME,
  },
  {
    title: "Discover Its Story",
    description:
      "Get history, fun facts, nearby food, and weather -- all in one tap.",
    colors: BLUE,
  },
  {
    title: "Find Your Crew",
    description:
      "Match with travelers heading your way and swap plans before you land.",
    colors: LIME,
  },
  {
    title: "Share The Journey",
    description:
      "Post your trip, tag your squad, and turn it into a travel diary worth revisiting.",
    colors: BLUE,
  },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const data = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3) height = 800;
  else if (data.length === 4) height = 900;
  else height = 1130;

  return (
    <LazyMotion features={domAnimation}>
      <div className={`bg-white max-md:pt-10 max-md:pb-25 md:py-20 px-8 relative ${className}`}>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-14 text-center md:mb-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-black/50">
              How it works
            </p>
            <h2
              className="text-3xl font-black uppercase leading-[1.05] text-black sm:text-4xl md:text-5xl"
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              Five steps to your next story
            </h2>
          </div>

          <div
            className="relative w-full max-w-[1000px] mx-auto flex flex-col space-y-8 md:space-y-0 md:block h-auto md:h-[var(--md-height)]"
            style={{ "--md-height": `${height}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    if (index === 0)
                      return "M 290 150 C 500 150, 550 270, 710 270"; // 1 -> 2
                    if (index === 1)
                      return acc + " C 850 270, 500 350, 290 450"; // 2 -> 3
                    if (index === 2)
                      return acc + " C 290 600, 550 720, 750 720"; // 3 -> 4
                    if (index === 3)
                      return acc + " C 950 720, 500 800, 290 850"; // 4 -> 5
                    return acc;
                  }, "");
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-black/15"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{
                        strokeDashoffset: -140, // multiple of 14 (8+6) for a seamless loop
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position: StepPosition = positions[index % positions.length] ?? {};

              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  description={step.description}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}