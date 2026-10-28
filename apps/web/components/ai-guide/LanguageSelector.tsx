"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguage } from "@/src/lib/languages";

interface LanguageSelectorProps {
  language: string;
  onChange: (code: string) => void;
  isTranslating: boolean;
}

export function LanguageSelector({
  language,
  onChange,
  isTranslating,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = getLanguage(language);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
        onClick={() => setOpen((previous) => !previous)}
        disabled={isTranslating}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-teal)] disabled:opacity-60"
      >
        {isTranslating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        )}

        {current.label}

        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute left-0 z-20 mt-2 max-h-64 min-w-[170px] overflow-auto rounded-2xl border border-[var(--tourmate-line)] bg-white py-1.5 shadow-xl"
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
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm text-[var(--tourmate-ink)] transition-colors hover:bg-[var(--tourmate-sand)]"
              >
                {lang.label}

                {lang.code === language && (
                  <Check
                    className="h-3.5 w-3.5 text-[var(--tourmate-coral)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
