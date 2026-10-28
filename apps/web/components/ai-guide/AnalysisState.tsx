"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Eye, BookOpen } from "lucide-react";

interface AnalysisStateProps {
  previewUrl: string | null;
}

const STEPS = [
  { label: "Identifying the landmark", icon: Building2 },
  { label: "Examining visual details", icon: Eye },
  { label: "Preparing your travel guide", icon: BookOpen },
];

const STEP_ADVANCE_MS = 1600;

export function AnalysisState({ previewUrl }: AnalysisStateProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);

    const timers = STEPS.slice(0, -1).map((_, index) =>
      setTimeout(() => setActiveIndex(index + 1), (index + 1) * STEP_ADVANCE_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="flex flex-col items-center py-4 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative mb-6 h-24 w-24">
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-[var(--tourmate-gold)]"
          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.15, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute inset-2 overflow-hidden rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)]">
          {previewUrl && (
            <img
              src={previewUrl}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <h2 className="text-lg font-black text-[var(--tourmate-ink)] md:text-xl">
        Analyzing your photo&hellip;
      </h2>

      <p className="mt-1 text-sm text-[var(--tourmate-dim)]">
        Our AI is taking a close look — this can take a few seconds.
      </p>

      <ul className="mt-7 w-full max-w-xs space-y-3 text-left">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const Icon = step.icon;

          return (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isDone
                    ? "border-[var(--tourmate-teal)] bg-[var(--tourmate-teal)]"
                    : isActive
                      ? "border-[var(--tourmate-coral)] bg-white"
                      : "border-[var(--tourmate-line)] bg-white"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isDone
                      ? "text-white"
                      : isActive
                        ? "text-[var(--tourmate-coral)]"
                        : "text-[var(--tourmate-dim)]/50"
                  }`}
                  aria-hidden="true"
                />
              </span>

              <span
                className={`text-sm font-medium transition-colors ${
                  isDone || isActive
                    ? "text-[var(--tourmate-ink)]"
                    : "text-[var(--tourmate-dim)]"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
