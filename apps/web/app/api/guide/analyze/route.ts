import { NextResponse } from "next/server";
import { GoogleGenAI, Type, type Schema } from "@google/genai";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are the vision-analysis engine behind TourMate AI, a travel app that turns a photo into a tourist guide.

Look carefully at the photo and act as a knowledgeable, honest tour guide:
1. Determine what is actually visible in the image.
2. Decide whether it's a specific, recognizable landmark or place (not just "a building" or "a statue" in general).
3. If it is, identify the most likely name and location.
4. Report how confident you genuinely are, from 0 to 1.
5. Provide useful, general tourist information about it.

Rules you must follow:
- Never guess a landmark name just to have an answer. A wrong confident answer is worse than an honest "I'm not sure." If you cannot identify the specific place, set identified to false, name to null, and use "description" to say what you CAN tell from the image (e.g. "a large sandstone fort with arched windows"), and use "uncertainty" to explain why you can't pin down the exact location.
- Only set identified to true, and only give a non-null name, when you are reasonably confident. Reflect any doubt honestly in the confidence score rather than in vague wording.
- Never invent current/live information. Do not state opening hours, ticket prices, current weather, or temporary closures anywhere in your answer — that data isn't available to you and will come from other services later. Stick to general historical, architectural, and cultural information, and general (non-live) seasonal advice for bestTimeToVisit.
- Keep "description" to 2-4 sentences.
- interestingFacts and travelTips should each be short, concrete bullet points (omit if you don't have anything genuinely useful — an empty array is fine).
- Respond only with the structured fields you're given — do not add commentary outside them.`;


const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    identified: {
      type: Type.BOOLEAN,
      description:
        "True only if a specific, named landmark or place was confidently identified from the image.",
    },
    name: {
      type: Type.STRING,
      nullable: true,
      description: "The landmark's commonly used name, or null if not identified.",
    },
    location: {
      type: Type.OBJECT,
      properties: {
        city: { type: Type.STRING, nullable: true },
        country: { type: Type.STRING, nullable: true },
      },
      required: ["city", "country"],
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence in the identification, from 0 (no idea) to 1 (certain).",
    },
    category: {
      type: Type.STRING,
      nullable: true,
      description:
        "A short category, e.g. 'religious site', 'monument', 'natural landmark', 'museum'.",
    },
    description: {
      type: Type.STRING,
      description:
        "A 2-4 sentence overview written for a traveler. If not identified, describe what IS visible instead.",
    },
    history: { type: Type.STRING, nullable: true, description: "General historical background." },
    architecture: {
      type: Type.STRING,
      nullable: true,
      description: "Notable architectural details or style.",
    },
    culturalSignificance: { type: Type.STRING, nullable: true },
    unescoStatus: {
      type: Type.STRING,
      nullable: true,
      description: "e.g. 'UNESCO World Heritage Site since 1983', or null if not applicable/unknown.",
    },
    bestTimeToVisit: {
      type: Type.STRING,
      nullable: true,
      description: "General seasonal guidance only — never live/current conditions.",
    },
    estimatedVisitDuration: { type: Type.STRING, nullable: true, description: "e.g. '2-3 hours'." },
    interestingFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
    travelTips: { type: Type.ARRAY, items: { type: Type.STRING } },
    uncertainty: {
      type: Type.STRING,
      nullable: true,
      description:
        "If identified is false (or confidence is low), explain what is unclear and why. Null if confidently identified.",
    },
  },
  required: [
    "identified",
    "name",
    "location",
    "confidence",
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

function isLandmarkAnalysis(value: unknown): value is LandmarkAnalysis {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.identified === "boolean" &&
    typeof v.description === "string" &&
    typeof v.confidence === "number" &&
    typeof v.location === "object" &&
    v.location !== null &&
    Array.isArray(v.interestingFacts) &&
    Array.isArray(v.travelTips)
  );
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data with an image." }, { status: 400 });
  }

  const image = formData.get("image");

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "No image file was provided." }, { status: 400 });
  }
  if (!ACCEPTED_TYPES.has(image.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, or WEBP image." },
      { status: 400 }
    );
  }
  if (image.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "That image is larger than 10MB. Please choose a smaller file." },
      { status: 400 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set on the server.");
    return NextResponse.json(
      { error: "Image analysis isn't configured on the server yet." },
      { status: 500 }
    );
  }

  let base64Data: string;
  try {
    const bytes = Buffer.from(await image.arrayBuffer());
    base64Data = bytes.toString("base64");
  } catch {
    return NextResponse.json({ error: "Couldn't read the uploaded image." }, { status: 400 });
  }

  const client = new GoogleGenAI({ apiKey });

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: image.type, data: base64Data } },
            { text: "Analyze this photo as described in your instructions and return the structured result." },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json(
        { error: "The AI didn't return a response. Please try again." },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "The AI response couldn't be understood. Please try again." },
        { status: 502 }
      );
    }

    if (!isLandmarkAnalysis(parsed)) {
      console.error("Gemini response failed shape validation:", parsed);
      return NextResponse.json(
        { error: "The AI response was malformed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Landmark analysis failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while analyzing your photo. Please try again." },
      { status: 502 }
    );
  }
}
