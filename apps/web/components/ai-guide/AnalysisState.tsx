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
    <div className="flex flex-col items-center text-center py-4" role="status" aria-live="polite">
      <div className="relative w-24 h-24 mb-6">
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-[#CCFF00]"
          animate={{ scale: [1, 1.25, 1], opacity: [0.9, 0.15, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-2 rounded-full overflow-hidden bg-[#F8F9FA] border border-black/5">
          {previewUrl && (
            <img src={previewUrl} alt="" aria-hidden="true" className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      <h2 className="font-black text-lg md:text-xl">Analyzing your photo&hellip;</h2>
      <p className="text-black/50 text-sm mt-1">
        Our AI is taking a close look — this can take a few seconds.
      </p>

      <ul className="w-full max-w-xs mt-7 space-y-3 text-left">
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const Icon = step.icon;
          return (
            <li key={step.label} className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors ${
                  isDone
                    ? "bg-[#CCFF00] border-[#CCFF00]"
                    : isActive
                      ? "bg-white border-[#0038FF]"
                      : "bg-white border-black/15"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isDone || isActive ? "text-[#0038FF]" : "text-black/30"}`}
                  aria-hidden="true"
                />
              </span>
              <span
                className={`text-sm font-medium transition-colors ${
                  isDone || isActive ? "text-black" : "text-black/40"
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
