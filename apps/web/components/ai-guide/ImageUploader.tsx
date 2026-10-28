"use client";

import { useState, type DragEvent, type KeyboardEvent } from "react";
import { AlertCircle, Camera, ImagePlus, Upload } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  onOpenFilePicker: () => void;
  onOpenCamera: () => void;
  error?: string | null;
}

export function ImageUploader({
  onFileSelected,
  onOpenFilePicker,
  onOpenCamera,
  error,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onFileSelected(dropped);
  };

  const handleDropzoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenFilePicker();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a landmark photo. Drag and drop an image, or press Enter to browse your files."
        onClick={onOpenFilePicker}
        onKeyDown={handleDropzoneKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed px-6 py-14 text-center outline-none transition-colors md:py-16",
          "focus-visible:ring-2 focus-visible:ring-[var(--tourmate-coral)] focus-visible:ring-offset-2",
          isDragging
            ? "border-[var(--tourmate-coral)] bg-[var(--tourmate-sand)]"
            : "border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] hover:border-[var(--tourmate-coral)]"
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tourmate-teal)] shadow-md">
          <ImagePlus
            className="h-6 w-6 text-white"
            aria-hidden="true"
          />
        </div>

        <p className="mt-4 text-base font-black text-[var(--tourmate-ink)] md:text-lg">
          {isDragging ? "Drop it right here" : "Drag & drop a landmark photo"}
        </p>

        <p className="mt-1 text-xs text-[var(--tourmate-dim)] md:text-sm">
          or choose an option below
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onOpenFilePicker}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--tourmate-coral-dark)] bg-[var(--tourmate-coral)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--tourmate-coral-dark)] active:scale-[0.98] sm:w-auto"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Upload Image
        </button>

        <button
          type="button"
          onClick={onOpenCamera}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-white px-6 py-3 text-sm font-bold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-teal)] active:scale-[0.98] sm:w-auto"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Take a Photo
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
