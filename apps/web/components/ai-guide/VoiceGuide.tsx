"use client";

import { useEffect } from "react";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/src/hooks/use-speech-synthesis";

interface VoiceGuideProps {
  /** The full text to read aloud. */
  text: string;
  /** BCP-47 language tag, e.g. "es-ES". */
  speechLang: string;
}

export function VoiceGuide({ text, speechLang }: VoiceGuideProps) {
  const { status, speak, pause, resume, stop } = useSpeechSynthesis();

  // If the guide's language or text changes (e.g. the user switches
  // language) while it's playing, stop rather than keep reading stale audio.
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
          className="inline-flex items-center gap-1.5 bg-black/5 hover:bg-black/10 text-black/70 text-xs font-semibold px-3 py-1.5 rounded-full transition"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          Listen to this guide
        </button>
      )}
      {status === "speaking" && (
        <>
          <button
            type="button"
            onClick={pause}
            className="inline-flex items-center gap-1.5 bg-[#0038FF]/10 text-[#0038FF] text-xs font-semibold px-3 py-1.5 rounded-full transition"
          >
            <Pause className="w-3.5 h-3.5" aria-hidden="true" />
            Pause
          </button>
          <button
            type="button"
            onClick={stop}
            aria-label="Stop reading"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 text-black/60 transition"
          >
            <Square className="w-3 h-3" aria-hidden="true" />
          </button>
        </>
      )}
      {status === "paused" && (
        <>
          <button
            type="button"
            onClick={resume}
            className="inline-flex items-center gap-1.5 bg-[#0038FF]/10 text-[#0038FF] text-xs font-semibold px-3 py-1.5 rounded-full transition"
          >
            <Play className="w-3.5 h-3.5" aria-hidden="true" />
            Resume
          </button>
          <button
            type="button"
            onClick={stop}
            aria-label="Stop reading"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 text-black/60 transition"
          >
            <Square className="w-3 h-3" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
