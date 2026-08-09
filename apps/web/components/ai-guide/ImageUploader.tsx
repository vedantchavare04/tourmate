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
          "flex flex-col items-center justify-center text-center rounded-[1.5rem] border-2 border-dashed px-6 py-14 md:py-16 cursor-pointer transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[#0038FF] focus-visible:ring-offset-2",
          isDragging
            ? "border-[#0038FF] bg-[#0038FF]/5"
            : "border-black/15 bg-[#F8F9FA] hover:border-black/30 hover:bg-black/[0.03]"
        )}
      >
        <div className="w-14 h-14 rounded-full bg-[#0038FF] flex items-center justify-center shadow-md">
          <ImagePlus className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <p className="font-black text-base md:text-lg mt-4">
          {isDragging ? "Drop it right here" : "Drag & drop a landmark photo"}
        </p>
        <p className="text-black/50 text-xs md:text-sm mt-1">
          or choose an option below
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onOpenFilePicker}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#CCFF00] text-black font-bold text-sm px-6 py-3 rounded-full border-[1.5px] border-black/5 shadow-sm hover:brightness-95 active:scale-[0.98] transition"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          Upload Image
        </button>
        <button
          type="button"
          onClick={onOpenCamera}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-6 py-3 rounded-full border-[1.5px] border-black/15 hover:border-black/30 active:scale-[0.98] transition"
        >
          <Camera className="w-4 h-4" aria-hidden="true" />
          Take a Photo
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
