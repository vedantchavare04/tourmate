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
import { getLanguage } from "@/src/lib/languages";
import { LanguageSelector } from "@/components/ai-guide/LanguageSelector";
import { VoiceGuide } from "@/components/ai-guide/VoiceGuide";
import { WeatherWidget } from "@/components/ai-guide/WeatherWidget";
import { LandmarkChat } from "@/components/ai-guide/LandmarkChat";

interface LandmarkResultProps {
  result: LandmarkAnalysis;
  language: string;
  onLanguageChange: (code: string) => void;
  isTranslating: boolean;
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
      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--tourmate-dim)]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h3>

      <div className="mt-2 text-sm leading-relaxed text-[var(--tourmate-ink)] md:text-base">
        {children}
      </div>
    </div>
  );
}

function buildVoiceScript(result: LandmarkAnalysis): string {
  if (!result.identified) {
    return [result.description, result.uncertainty].filter(Boolean).join(". ");
  }

  return [
    result.name,
    result.description,
    result.history,
    result.architecture,
    result.culturalSignificance,
    ...result.interestingFacts,
    ...result.travelTips,
  ]
    .filter(Boolean)
    .join(". ");
}

export function LandmarkResult({
  result,
  language,
  onLanguageChange,
  isTranslating,
  onAnalyzeAnother,
}: LandmarkResultProps) {
  const confidencePercent = Math.round(result.confidence * 100);
  const locationLabel = [result.location.city, result.location.country]
    .filter(Boolean)
    .join(", ");
  const speechLang = getLanguage(language).speechLang;
  const voiceScript = buildVoiceScript(result);

  const controls = (
    <div className="flex flex-wrap items-center gap-2">
      <LanguageSelector
        language={language}
        onChange={onLanguageChange}
        isTranslating={isTranslating}
      />
      <VoiceGuide text={voiceScript} speechLang={speechLang} />
    </div>
  );

  if (!result.identified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="flex justify-center">{controls}</div>

        <div className="mt-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)]">
          <HelpCircle
            className="h-6 w-6 text-[var(--tourmate-teal-dark)]"
            aria-hidden="true"
          />
        </div>

        <h2 className="mt-4 text-xl font-black text-[var(--tourmate-ink)] md:text-2xl">
          Couldn&rsquo;t confidently identify this
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--tourmate-dim)] md:text-base">
          {result.description}
        </p>

        {result.uncertainty && (
          <div className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-xl border border-[var(--tourmate-coral)]/30 bg-[var(--tourmate-sand)] px-4 py-3 text-left text-sm text-[var(--tourmate-coral-dark)]">
            <Info
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{result.uncertainty}</span>
          </div>
        )}

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tourmate-coral)] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[var(--tourmate-coral-dark)] active:scale-[0.98] md:text-base"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-sky)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--tourmate-teal-dark)]">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            AI identification &middot; {confidencePercent}% confidence
          </div>

          {result.category && (
            <div className="inline-flex items-center rounded-full bg-[var(--tourmate-sand)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--tourmate-ink)]">
              {result.category}
            </div>
          )}
        </div>

        {controls}
      </div>

      <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-[var(--tourmate-ink)] md:text-3xl">
        {result.name}
      </h2>

      {locationLabel && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-[var(--tourmate-dim)]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {locationLabel}
          </div>

          <WeatherWidget
            city={result.location.city}
            country={result.location.country}
          />
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-[var(--tourmate-ink)] md:text-base">
        {result.description}
      </p>

      {(result.unescoStatus ||
        result.bestTimeToVisit ||
        result.estimatedVisitDuration) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {result.unescoStatus && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)]">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              {result.unescoStatus}
            </span>
          )}

          {result.bestTimeToVisit && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-sky)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)]">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {result.bestTimeToVisit}
            </span>
          )}

          {result.estimatedVisitDuration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-sky)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
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
          <ul className="list-inside list-disc space-y-1.5 marker:text-[var(--tourmate-coral)]">
            {result.interestingFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </Section>
      )}

      {result.travelTips.length > 0 && (
        <Section icon={Info} title="Travel tips">
          <ul className="list-inside list-disc space-y-1.5 marker:text-[var(--tourmate-coral)]">
            {result.travelTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </Section>
      )}

      <p className="mt-6 text-xs text-[var(--tourmate-dim)]">
        Opening hours and ticket prices aren&rsquo;t available yet — those will
        arrive once TourMate connects to live booking data.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <LandmarkChat result={result} language={language} />

        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-teal)] active:scale-[0.98] sm:w-auto"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Analyze Another Image
        </button>
      </div>
    </motion.div>
  );
}
