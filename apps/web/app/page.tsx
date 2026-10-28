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

const Card = ({
  number,
  title,
  description,
  className,
  rotate,
  colors,
}: CardProps) => (
  <div
    className={`relative w-full transition-transform duration-300 hover:z-30 hover:scale-105 md:w-[280px] ${rotate ?? ""} ${className ?? ""}`}
  >
    <div className="rounded-[25px] border border-[var(--tourmate-line)] bg-white p-2 shadow-[0_10px_20px_0_var(--tourmate-line)]">
      <Pin
        className={`z-20 mx-auto mb-6 h-8 w-8 ${colors.text}`}
      />

      <div
        className={`${colors.bg} ${colors.border} relative flex h-full flex-col overflow-hidden rounded-[15px] border p-[15px]`}
      >
        <span
          className={`mb-5 text-4xl ${colors.text}`}
          style={{
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          }}
        >
          {number}
        </span>

        <h3 className="mb-[10px] text-2xl font-semibold leading-none text-[var(--tourmate-ink)]">
          {title}
        </h3>

        <p className="text-sm/5 tracking-tight text-[var(--tourmate-dim)]">
          {description}
        </p>
      </div>
    </div>
  </div>
);

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
  {
    className: "md:absolute md:top-[120px] md:right-[15%]",
    rotate: "-rotate-8",
  },
  {
    className: "md:absolute md:top-[450px] md:left-[15%]",
    rotate: "rotate-8",
  },
  {
    className: "md:absolute md:top-[570px] md:right-[10%]",
    rotate: "-rotate-8",
  },
  {
    className: "md:absolute md:top-[850px] md:left-[15%]",
    rotate: "rotate-8",
  },
];

const SKY: CardColors = {
  bg: "bg-[var(--tourmate-sky)]",
  text: "text-[var(--tourmate-teal-dark)]",
  border: "border-[var(--tourmate-line)]",
};

const SAND: CardColors = {
  bg: "bg-[var(--tourmate-sand)]",
  text: "text-[var(--tourmate-coral-dark)]",
  border: "border-[var(--tourmate-line)]",
};

const DEFAULT_FEATURES: Step[] = [
  {
    title: "Sign In",
    description:
      "Continue with Google and you're in -- no forms, no passwords to remember.",
    colors: SKY,
  },
  {
    title: "Snap Any Landmark",
    description:
      "Point your camera at a monument or building and let our AI recognize it instantly.",
    colors: SAND,
  },
  {
    title: "Discover Its Story",
    description:
      "Get history, fun facts, nearby food, and weather -- all in one tap.",
    colors: SKY,
  },
  {
    title: "Find Your Crew",
    description:
      "Match with travelers heading your way and swap plans before you land.",
    colors: SAND,
  },
  {
    title: "Share The Journey",
    description:
      "Post your trip, tag your squad, and turn it into a travel diary worth revisiting.",
    colors: SKY,
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
      <div
        className={`relative bg-[var(--tourmate-sky)] px-8 max-md:pt-10 max-md:pb-25 md:py-20 ${className ?? ""}`}
      >
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-14 text-center md:mb-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--tourmate-teal-dark)]">
              How it works
            </p>

            <h2
              className="text-3xl font-black uppercase leading-[1.05] text-[var(--tourmate-ink)] sm:text-4xl md:text-5xl"
              style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
            >
              Five steps to your next story
            </h2>
          </div>

          <div
            className="relative mx-auto flex h-auto w-full max-w-[1000px] flex-col space-y-8 md:block md:space-y-0 md:h-[var(--md-height)]"
            style={{ "--md-height": `${height}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-full md:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;

                    if (index === 0) {
                      return "M 290 150 C 500 150, 550 270, 710 270";
                    }

                    if (index === 1) {
                      return acc + " C 850 270, 500 350, 290 450";
                    }

                    if (index === 2) {
                      return acc + " C 290 600, 550 720, 750 720";
                    }

                    if (index === 3) {
                      return acc + " C 950 720, 500 800, 290 850";
                    }

                    return acc;
                  }, "");

                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-[var(--tourmate-coral)]/45"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -140 }}
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
              const position: StepPosition =
                positions[index % positions.length] ?? {};

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
