import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface GuideHeroProps {
  compact?: boolean;
}

export function GuideHero({ compact = false }: GuideHeroProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="inline-flex items-center gap-1.5 bg-[#CCFF00] text-black font-black text-[10px] md:text-xs tracking-wider uppercase px-3.5 py-1.5 rounded-full border-[1.5px] border-white/60 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        AI Tourist Guide
      </div>

      <h1
        className={cn(
          "font-black uppercase tracking-tight text-white leading-[0.95] mt-4",
          compact ? "text-3xl md:text-4xl" : "text-4xl sm:text-5xl md:text-6xl"
        )}
        style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}
      >
        Discover the story
        <br />
        behind every place
      </h1>

      {!compact && (
        <p className="text-white/80 text-sm md:text-base mt-4 leading-relaxed">
          Point your camera at a landmark or upload a photo, and TourMate will
          identify it and turn it into an interactive travel guide.
        </p>
      )}
    </div>
  );
}
