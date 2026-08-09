"use client";

import { AlertCircle, ImageIcon, RefreshCw, Sparkles, Trash2 } from "lucide-react";

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
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] rounded-[1.5rem] overflow-hidden bg-[#F8F9FA] border border-black/5">
        <img
          src={previewUrl}
          alt={`Preview of ${fileName}, ready to analyze`}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center justify-center gap-2 text-black/50 text-xs mt-3">
        <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
        <span className="truncate max-w-[220px]">{fileName}</span>
      </div>

      <div className="flex items-center justify-center gap-3 mt-5">
        <button
          type="button"
          onClick={onChange}
          className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-5 py-2.5 rounded-full border-[1.5px] border-black/15 hover:border-black/30 active:scale-[0.98] transition"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Change Image
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center gap-2 text-black/60 font-bold text-sm px-5 py-2.5 rounded-full border-[1.5px] border-transparent hover:text-rose-600 hover:bg-rose-50 active:scale-[0.98] transition"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          Remove
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={onAnalyze}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0038FF] text-white font-black text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition"
        >
          <Sparkles className="w-4 h-4 text-[#CCFF00]" aria-hidden="true" />
          Analyze Landmark
        </button>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mt-5 text-sm"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
