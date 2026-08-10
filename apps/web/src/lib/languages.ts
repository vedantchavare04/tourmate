
export interface SupportedLanguage {
  code: string;
  label: string;
  englishName: string;
  speechLang: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", label: "English", englishName: "English", speechLang: "en-US" },
  { code: "es", label: "Español", englishName: "Spanish", speechLang: "es-ES" },
  { code: "fr", label: "Français", englishName: "French", speechLang: "fr-FR" },
  { code: "de", label: "Deutsch", englishName: "German", speechLang: "de-DE" },
  { code: "hi", label: "हिन्दी", englishName: "Hindi", speechLang: "hi-IN" },
  { code: "ja", label: "日本語", englishName: "Japanese", speechLang: "ja-JP" },
  { code: "zh", label: "中文", englishName: "Chinese (Simplified)", speechLang: "zh-CN" },
  { code: "ar", label: "العربية", englishName: "Arabic", speechLang: "ar-SA" },
  { code: "pt", label: "Português", englishName: "Portuguese", speechLang: "pt-BR" },
  { code: "ru", label: "Русский", englishName: "Russian", speechLang: "ru-RU" },
];

export const DEFAULT_LANGUAGE_CODE = "en";

export function getLanguage(code: string): SupportedLanguage {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) ?? SUPPORTED_LANGUAGES[0]!;
}

export function isSupportedLanguageCode(code: unknown): code is string {
  return typeof code === "string" && SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}
