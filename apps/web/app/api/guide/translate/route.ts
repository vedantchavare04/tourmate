import { NextResponse } from "next/server";
import { GoogleGenAI, Type, type Schema } from "@google/genai";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";
import { getLanguage, isSupportedLanguageCode } from "@/src/lib/languages";

const MODEL = "gemini-3.6-flash";

const TRANSLATABLE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, nullable: true },
    location: {
      type: Type.OBJECT,
      properties: {
        city: { type: Type.STRING, nullable: true },
        country: { type: Type.STRING, nullable: true },
      },
      required: ["city", "country"],
    },
    category: { type: Type.STRING, nullable: true },
    description: { type: Type.STRING },
    history: { type: Type.STRING, nullable: true },
    architecture: { type: Type.STRING, nullable: true },
    culturalSignificance: { type: Type.STRING, nullable: true },
    unescoStatus: { type: Type.STRING, nullable: true },
    bestTimeToVisit: { type: Type.STRING, nullable: true },
    estimatedVisitDuration: { type: Type.STRING, nullable: true },
    interestingFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
    travelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    uncertainty: { type: Type.STRING, nullable: true },
  },
  required: [
    "name",
    "location",
    "category",
    "description",
    "history",
    "architecture",
    "culturalSignificance",
    "unescoStatus",
    "bestTimeToVisit",
    "estimatedVisitDuration",
    "interestingFacts",
    "travelTips",
    "uncertainty",
  ],
};

type TranslatableFields = Omit<LandmarkAnalysis, "identified" | "confidence">;

function isTranslatableFields(value: unknown): value is TranslatableFields {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.description === "string" &&
    typeof v.location === "object" &&
    v.location !== null &&
    Array.isArray(v.interestingFacts) &&
    Array.isArray(v.travelTips)
  );
}

function isLandmarkAnalysisInput(value: unknown): value is LandmarkAnalysis {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.identified === "boolean" && typeof v.confidence === "number" && isTranslatableFields(v);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const { language, result } = body as { language?: unknown; result?: unknown };

  if (!isSupportedLanguageCode(language)) {
    return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  }
  if (!isLandmarkAnalysisInput(result)) {
    return NextResponse.json({ error: "Malformed landmark result." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set on the server.");
    return NextResponse.json(
      { error: "Translation isn't configured on the server yet." },
      { status: 500 }
    );
  }

  const target = getLanguage(language);
  const translatable: TranslatableFields = {
    name: result.name,
    location: result.location,
    category: result.category,
    description: result.description,
    history: result.history,
    architecture: result.architecture,
    culturalSignificance: result.culturalSignificance,
    unescoStatus: result.unescoStatus,
    bestTimeToVisit: result.bestTimeToVisit,
    estimatedVisitDuration: result.estimatedVisitDuration,
    interestingFacts: result.interestingFacts,
    travelTips: result.travelTips,
    uncertainty: result.uncertainty,
  };

  const client = new GoogleGenAI({ apiKey });

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate the following tourist-guide JSON into ${target.englishName}, for a native ${target.englishName} speaker.

Rules:
- Keep the exact same JSON keys and structure.
- Translate naturally, the way a real ${target.englishName} travel guide would phrase it — not a literal word-for-word translation.
- For place names ("name", "location.city", "location.country"), use the name commonly used by ${target.englishName} speakers (e.g. the standard exonym) if one exists; otherwise keep the original.
- Leave any null value as null, and any empty array as an empty array. Do not invent content that wasn't in the source.

Source JSON:
${JSON.stringify(translatable)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: TRANSLATABLE_SCHEMA,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json({ error: "Translation returned no result." }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Translation response was malformed." }, { status: 502 });
    }

    if (!isTranslatableFields(parsed)) {
      console.error("Gemini translation failed shape validation:", parsed);
      return NextResponse.json({ error: "Translation response was malformed." }, { status: 502 });
    }

    const translated: LandmarkAnalysis = {
      ...parsed,
      identified: result.identified,
      confidence: result.confidence,
    };

    return NextResponse.json(translated);
  } catch (error) {
    console.error("Translation failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while translating. Please try again." },
      { status: 502 }
    );
  }
}
