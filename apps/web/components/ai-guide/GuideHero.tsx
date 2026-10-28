import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface GuideHeroProps {
  compact?: boolean;
}

export function GuideHero({ compact = false }: GuideHeroProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-[var(--tourmate-gold)] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--tourmate-ink)] shadow-sm md:text-xs">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        AI Tourist Guide
      </div>

      <h1
        className={cn(
          "mt-4 font-black uppercase leading-[0.95] tracking-tight text-white",
          compact ? "text-3xl md:text-4xl" : "text-4xl sm:text-5xl md:text-6xl"
        )}
        style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
      >
        Discover the story
        <br />
        behind every place
      </h1>

      {!compact && (
        <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
          Point your camera at a landmark or upload a photo, and TourMate will
          identify it and turn it into an interactive travel guide.
        </p>
      )}
    </div>
  );
}
