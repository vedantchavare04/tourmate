"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AlertTriangle, RotateCcw, Upload } from "lucide-react";
import { GuideHero } from "@/components/ai-guide/GuideHero";
import { ImageUploader } from "@/components/ai-guide/ImageUploader";
import { ImagePreview } from "@/components/ai-guide/ImagePreview";
import { AnalysisState } from "@/components/ai-guide/AnalysisState";
import { LandmarkResult } from "@/components/ai-guide/LandmarkResult";
import {
  analyzeLandmark,
  type LandmarkAnalysis,
} from "@/src/lib/analyze-landmark";
import { translateLandmark } from "@/src/lib/translate-landmark";
import { DEFAULT_LANGUAGE_CODE } from "@/src/lib/languages";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

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

  const [language, setLanguage] = useState(DEFAULT_LANGUAGE_CODE);
  const [translations, setTranslations] = useState<
    Record<string, LandmarkAnalysis>
  >({});
  const [isTranslating, setIsTranslating] = useState(false);

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
    setLanguage(DEFAULT_LANGUAGE_CODE);
    setTranslations({});
    setStage("empty");
  }, []);

  const runAnalysis = useCallback(async (targetFile: File) => {
    setAnalysisError(null);
    setStage("analyzing");

    try {
      const analysis = await analyzeLandmark(targetFile);
      setResult(analysis);
      setLanguage(DEFAULT_LANGUAGE_CODE);
      setTranslations({});
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

  const handleLanguageChange = useCallback(
    async (code: string) => {
      if (!result || code === language) return;

      setLanguage(code);

      if (code === DEFAULT_LANGUAGE_CODE || translations[code]) return;

      setIsTranslating(true);

      try {
        const translated = await translateLandmark(result, code);
        setTranslations((previous) => ({ ...previous, [code]: translated }));
      } catch {
        setLanguage(DEFAULT_LANGUAGE_CODE);
      } finally {
        setIsTranslating(false);
      }
    },
    [result, language, translations]
  );

  const displayedResult =
    language === DEFAULT_LANGUAGE_CODE
      ? result
      : (translations[language] ?? result);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--tourmate-ink)]">
      <div className="relative z-10 px-4 pb-20 pt-32 md:pb-28 md:pt-40">
        <GuideHero compact={stage !== "empty"} />

        <div className="mx-auto mt-10 max-w-2xl md:mt-14">
          <div className="rounded-[2rem] bg-[var(--tourmate-paper)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:rounded-[2.5rem] md:p-10">
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

            {stage === "analyzing" && (
              <AnalysisState previewUrl={previewUrl} />
            )}

            {stage === "result" && displayedResult && (
              <LandmarkResult
                result={displayedResult}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                onAnalyzeAnother={handleRemove}
              />
            )}

            {stage === "error" && (
              <div className="text-center" role="alert" aria-live="assertive">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--tourmate-coral)]/30 bg-[var(--tourmate-sand)]">
                  <AlertTriangle
                    className="h-6 w-6 text-[var(--tourmate-coral-dark)]"
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-4 text-xl font-black text-[var(--tourmate-ink)] md:text-2xl">
                  Analysis failed
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--tourmate-dim)] md:text-base">
                  {analysisError ??
                    "Something went wrong while analyzing your photo. Please try again."}
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tourmate-coral)] px-8 py-3.5 text-sm font-black text-white shadow-lg transition hover:bg-[var(--tourmate-coral-dark)] active:scale-[0.98] sm:w-auto md:text-base"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Try Again
                  </button>

                  <button
                    type="button"
                    onClick={handleRemove}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[var(--tourmate-line)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--tourmate-ink)] transition hover:border-[var(--tourmate-coral)] active:scale-[0.98] sm:w-auto"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    Choose a Different Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-white/70 md:text-sm">
            Supported formats: JPG, PNG, WEBP &middot; Max size 10MB
          </p>
        </div>
      </div>
    </main>
  );
}
