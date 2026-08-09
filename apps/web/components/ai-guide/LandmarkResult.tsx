"use client";

import { motion } from "motion/react";
import {
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  Clock,
  HelpCircle,
  Lightbulb,
  MapPin,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";

interface LandmarkResultProps {
  result: LandmarkAnalysis;
  onAnalyzeAnother: () => void;
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide text-black/40">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {title}
      </h3>
      <div className="text-black/80 text-sm md:text-base leading-relaxed mt-2">{children}</div>
    </div>
  );
}

export function LandmarkResult({ result, onAnalyzeAnother }: LandmarkResultProps) {
  const confidencePercent = Math.round(result.confidence * 100);
  const locationLabel = [result.location.city, result.location.country]
    .filter(Boolean)
    .join(", ");

  if (!result.identified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-200">
          <HelpCircle className="w-6 h-6 text-amber-600" aria-hidden="true" />
        </div>
        <h2 className="font-black text-xl md:text-2xl mt-4">Couldn&rsquo;t confidently identify this</h2>
        <p className="text-black/70 text-sm md:text-base leading-relaxed mt-3 max-w-md mx-auto">
          {result.description}
        </p>
        {result.uncertainty && (
          <div className="flex items-start gap-2 text-left text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4 text-sm max-w-md mx-auto">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{result.uncertainty}</span>
          </div>
        )}

        <div className="flex justify-center mt-7">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center justify-center gap-2 bg-[#0038FF] text-white font-black text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Try Another Photo
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 bg-[#0038FF]/5 text-[#0038FF] font-bold text-[11px] uppercase tracking-wide px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          AI identification &middot; {confidencePercent}% confidence
        </div>
        {result.category && (
          <div className="inline-flex items-center bg-black/5 text-black/60 font-bold text-[11px] uppercase tracking-wide px-3 py-1 rounded-full">
            {result.category}
          </div>
        )}
      </div>

      <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tight mt-3">
        {result.name}
      </h2>
      {locationLabel && (
        <div className="flex items-center gap-1.5 text-black/60 text-sm mt-1">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          {locationLabel}
        </div>
      )}

      <p className="text-black/80 text-sm md:text-base leading-relaxed mt-4">
        {result.description}
      </p>

      {(result.unescoStatus || result.bestTimeToVisit || result.estimatedVisitDuration) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {result.unescoStatus && (
            <span className="inline-flex items-center gap-1.5 bg-[#CCFF00]/20 text-black/80 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              {result.unescoStatus}
            </span>
          )}
          {result.bestTimeToVisit && (
            <span className="inline-flex items-center gap-1.5 bg-black/5 text-black/70 text-xs font-semibold px-3 py-1.5 rounded-full">
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              {result.bestTimeToVisit}
            </span>
          )}
          {result.estimatedVisitDuration && (
            <span className="inline-flex items-center gap-1.5 bg-black/5 text-black/70 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {result.estimatedVisitDuration}
            </span>
          )}
        </div>
      )}

      {result.history && (
        <Section icon={BookOpen} title="History">
          {result.history}
        </Section>
      )}

      {result.architecture && (
        <Section icon={Building2} title="Architecture">
          {result.architecture}
        </Section>
      )}

      {result.culturalSignificance && (
        <Section icon={Sparkles} title="Cultural significance">
          {result.culturalSignificance}
        </Section>
      )}

      {result.interestingFacts.length > 0 && (
        <Section icon={Lightbulb} title="Interesting facts">
          <ul className="space-y-1.5 list-disc list-inside marker:text-[#0038FF]">
            {result.interestingFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Section>
      )}

      {result.travelTips.length > 0 && (
        <Section icon={Info} title="Travel tips">
          <ul className="space-y-1.5 list-disc list-inside marker:text-[#0038FF]">
            {result.travelTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </Section>
      )}

      <p className="text-black/35 text-xs mt-6">
        Opening hours, ticket prices, and current weather aren&rsquo;t available yet — those will
        arrive once TourMate connects to live data sources.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          type="button"
          disabled
          title="Coming soon"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0038FF]/40 text-white font-black text-sm md:text-base px-8 py-3.5 rounded-full cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 text-[#CCFF00]/70" aria-hidden="true" />
          Explore Guide
        </button>
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-6 py-3.5 rounded-full border-[1.5px] border-black/15 hover:border-black/30 active:scale-[0.98] transition"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Analyze Another Image
        </button>
      </div>
    </motion.div>
  );
}
