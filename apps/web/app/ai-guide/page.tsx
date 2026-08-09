"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { AlertTriangle, RotateCcw, Upload } from "lucide-react";
import { GuideHero } from "@/components/ai-guide/GuideHero";
import { ImageUploader } from "@/components/ai-guide/ImageUploader";
import { ImagePreview } from "@/components/ai-guide/ImagePreview";
import { AnalysisState } from "@/components/ai-guide/AnalysisState";
import { LandmarkResult } from "@/components/ai-guide/LandmarkResult";
import { analyzeLandmark, type LandmarkAnalysis } from "@/src/lib/analyze-landmark";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

type GuideStage = "empty" | "preview" | "analyzing" | "result" | "error";

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "That image is larger than 10MB. Please choose a smaller file.";
  }
  return null;
}

export default function AiGuidePage() {
  const [stage, setStage] = useState<GuideStage>("empty");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<LandmarkAnalysis | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelected = useCallback((candidate: File) => {
    const validationError = validateImageFile(candidate);
    if (validationError) {
      setSelectionError(validationError);
      return;
    }

    setSelectionError(null);
    setFile(candidate);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(candidate);
    });
    setStage("preview");
  }, []);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const picked = event.target.files?.[0];
      if (picked) handleFileSelected(picked);
      event.target.value = "";
    },
    [handleFileSelected]
  );

  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);
  const openCamera = useCallback(() => cameraInputRef.current?.click(), []);

  const handleRemove = useCallback(() => {
    setFile(null);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setResult(null);
    setSelectionError(null);
    setAnalysisError(null);
    setStage("empty");
  }, []);

  const runAnalysis = useCallback(async (targetFile: File) => {
    setAnalysisError(null);
    setStage("analyzing");
    try {
      const analysis = await analyzeLandmark(targetFile);
      setResult(analysis);
      setStage("result");
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your photo. Please try again."
      );
      setStage("error");
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!file) return;
    void runAnalysis(file);
  }, [file, runAnalysis]);

  const handleRetry = useCallback(() => {
    if (!file) return;
    void runAnalysis(file);
  }, [file, runAnalysis]);

  return (
    <main className="min-h-screen bg-[#0038FF] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 pt-32 pb-20 md:pt-40 md:pb-28">
        <GuideHero compact={stage !== "empty"} />

        <div className="max-w-2xl mx-auto mt-10 md:mt-14">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 md:p-10">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              onChange={handleInputChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            />

            {stage === "empty" && (
              <ImageUploader
                onFileSelected={handleFileSelected}
                onOpenFilePicker={openFilePicker}
                onOpenCamera={openCamera}
                error={selectionError}
              />
            )}

            {stage === "preview" && previewUrl && (
              <ImagePreview
                previewUrl={previewUrl}
                fileName={file?.name ?? "Selected image"}
                onChange={openFilePicker}
                onRemove={handleRemove}
                onAnalyze={handleAnalyze}
                error={selectionError}
              />
            )}

            {stage === "analyzing" && <AnalysisState previewUrl={previewUrl} />}

            {stage === "result" && result && (
              <LandmarkResult result={result} onAnalyzeAnother={handleRemove} />
            )}

            {stage === "error" && (
              <div className="text-center" role="alert" aria-live="assertive">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 border border-rose-200">
                  <AlertTriangle className="w-6 h-6 text-rose-600" aria-hidden="true" />
                </div>
                <h2 className="font-black text-xl md:text-2xl mt-4">Analysis failed</h2>
                <p className="text-black/60 text-sm md:text-base mt-2 max-w-sm mx-auto">
                  {analysisError ?? "Something went wrong while analyzing your photo. Please try again."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0038FF] text-white font-black text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-sm px-6 py-3.5 rounded-full border-[1.5px] border-black/15 hover:border-black/30 active:scale-[0.98] transition"
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    Choose a Different Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-white/70 text-xs md:text-sm mt-6">
            Supported formats: JPG, PNG, WEBP &middot; Max size 10MB
          </p>
        </div>
      </div>
    </main>
  );
}
