"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechStatus = "unsupported" | "idle" | "speaking" | "paused";


export function useSpeechSynthesis() {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const supported = useRef(true);

  useEffect(() => {
    supported.current = typeof window !== "undefined" && "speechSynthesis" in window;
    if (!supported.current) setStatus("unsupported");
    return () => {
      if (supported.current) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang: string) => {
    if (!supported.current) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
    setStatus("speaking");
  }, []);

  const pause = useCallback(() => {
    if (!supported.current) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (!supported.current) return;
    window.speechSynthesis.resume();
    setStatus("speaking");
  }, []);

  const stop = useCallback(() => {
    if (!supported.current) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, []);

  return { status, speak, pause, resume, stop };
}
