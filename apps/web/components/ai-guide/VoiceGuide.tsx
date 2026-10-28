"use client";

import { useEffect } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/src/hooks/use-speech-synthesis";

interface VoiceGuideProps {
  text: string;
  speechLang: string;
}

export function VoiceGuide({ text, speechLang }: VoiceGuideProps) {
  const { status, speak, pause, resume, stop } = useSpeechSynthesis();

  useEffect(() => {
    stop();
  }, [text, speechLang, stop]);

  if (status === "unsupported") return null;

  return (
    <div className="inline-flex items-center gap-2">
      {status === "idle" && (
        <button
          type="button"
          onClick={() => speak(text, speechLang)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-teal)]"
        >
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          Listen to this guide
        </button>
      )}

      {status === "speaking" && (
        <>
          <button
            type="button"
            onClick={pause}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-coral)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-coral-dark)] transition hover:bg-[var(--tourmate-coral)]/20"
          >
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            Pause
          </button>

          <button
            type="button"
            onClick={stop}
            aria-label="Stop reading"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tourmate-sand)] text-[var(--tourmate-dim)] transition hover:bg-[var(--tourmate-line)]"
          >
            <Square className="h-3 w-3" aria-hidden="true" />
          </button>
        </>
      )}

      {status === "paused" && (
        <>
          <button
            type="button"
            onClick={resume}
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tourmate-coral)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-coral-dark)] transition hover:bg-[var(--tourmate-coral)]/20"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </button>

          <button
            type="button"
            onClick={stop}
            aria-label="Stop reading"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tourmate-sand)] text-[var(--tourmate-dim)] transition hover:bg-[var(--tourmate-line)]"
          >
            <Square className="h-3 w-3" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
