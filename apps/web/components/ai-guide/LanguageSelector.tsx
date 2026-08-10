"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguage } from "@/src/lib/languages";

interface LanguageSelectorProps {
  language: string;
  onChange: (code: string) => void;
  isTranslating: boolean;
}

export function LanguageSelector({ language, onChange, isTranslating }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getLanguage(language);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isTranslating}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="inline-flex items-center gap-1.5 bg-black/5 hover:bg-black/10 text-black/70 text-xs font-semibold px-3 py-1.5 rounded-full transition disabled:opacity-60"
      >
        {isTranslating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        {current.label}
        <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute z-20 mt-2 left-0 bg-white rounded-2xl shadow-xl border border-black/5 py-1.5 min-w-[170px] max-h-64 overflow-auto"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={lang.code === language}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-left hover:bg-black/5 transition-colors"
              >
                {lang.label}
                {lang.code === language && (
                  <Check className="w-3.5 h-3.5 text-[#0038FF]" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
