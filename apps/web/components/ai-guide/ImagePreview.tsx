"use client";

import {
  AlertCircle,
  ImageIcon,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

interface ImagePreviewProps {
  previewUrl: string;
  fileName: string;
  onChange: () => void;
  onRemove: () => void;
  onAnalyze: () => void;
  error?: string | null;
}

export function ImagePreview({
  previewUrl,
  fileName,
  onChange,
  onRemove,
  onAnalyze,
  error,
}: ImagePreviewProps) {
  return (
    <div>
      <div className="relative h-[280px] w-full overflow-hidden rounded-[1.5rem] border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] sm:h-[360px] md:h-[420px]">
        <img
          src={previewUrl}
          alt={`Preview of ${fileName}, ready to analyze`}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--tourmate-dim)]">
        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="max-w-[220px] truncate">{fileName}</span>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onChange}
          className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-white px-5 py-2.5 text-sm font-bold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-teal)] active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Change Image
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent px-5 py-2.5 text-sm font-bold text-[var(--tourmate-dim)] transition hover:border-[var(--tourmate-coral)]/30 hover:bg-[var(--tourmate-sand)] hover:text-[var(--tourmate-coral-dark)] active:scale-[0.98]"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remove
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onAnalyze}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tourmate-coral)] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[var(--tourmate-coral-dark)] active:scale-[0.98] sm:w-auto md:text-base"
        >
          <Sparkles
            className="h-4 w-4 text-[var(--tourmate-gold)]"
            aria-hidden="true"
          />
          Analyze Landmark
        </button>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-5 flex items-start gap-2 rounded-xl border border-[var(--tourmate-coral)]/30 bg-[var(--tourmate-sand)] px-4 py-3 text-sm text-[var(--tourmate-coral-dark)]"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
          />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
