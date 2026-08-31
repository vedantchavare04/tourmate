import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";
import { getLanguage, isSupportedLanguageCode } from "@/src/lib/languages";

const MODEL = "gemini-3.6-flash";
const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_MESSAGES = 20; 

interface ChatHistoryMessage {
  role: "user" | "assistant";
  text: string;
}

function isChatHistory(value: unknown): value is ChatHistoryMessage[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (typeof item !== "object" || item === null) return false;
      const v = item as Record<string, unknown>;
      return (v.role === "user" || v.role === "assistant") && typeof v.text === "string";
    })
  );
}

function isLandmarkAnalysisInput(value: unknown): value is LandmarkAnalysis {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.identified === "boolean" && typeof v.description === "string";
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
  const { result, language, history, question } = body as {
    result?: unknown;
    language?: unknown;
    history?: unknown;
    question?: unknown;
  };

  if (!isLandmarkAnalysisInput(result)) {
    return NextResponse.json({ error: "Malformed landmark result." }, { status: 400 });
  }
  if (!isSupportedLanguageCode(language)) {
    return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  }
  if (!isChatHistory(history)) {
    return NextResponse.json({ error: "Malformed conversation history." }, { status: 400 });
  }
  if (typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Please ask a question." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json({ error: "That question is too long." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set on the server.");
    return NextResponse.json({ error: "Chat isn't configured on the server yet." }, { status: 500 });
  }

  const target = getLanguage(language);
  const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const systemInstruction = `You are a friendly, knowledgeable tour guide chatbot inside TourMate AI, currently discussing one specific place with a traveler.

Here is what's already been established about the place (from an earlier photo analysis) — treat it as ground truth and don't contradict it:
${JSON.stringify(result)}

Rules:
- Answer naturally and conversationally, like a real guide standing next to the traveler — a few sentences, not an essay, unless the question genuinely needs more.
- Stay grounded in the facts above plus well-established general knowledge about this place. If you're unsure about something, say so honestly rather than inventing details.
- Never state opening hours, ticket prices, current weather, or temporary closures — that live data isn't available to you. If asked, say so plainly.
- If the question isn't about this place at all, gently steer back to what you can help with here.
- Respond in ${target.englishName}.`;

  const client = new GoogleGenAI({ apiKey });

  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents: [
        ...trimmedHistory.map((message) => ({
          role: message.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: message.text }],
        })),
        { role: "user" as const, parts: [{ text: question }] },
      ],
      config: {
        systemInstruction,
        maxOutputTokens: 512,
      },
    });

    const answer = response.text;
    if (!answer) {
      return NextResponse.json(
        { error: "The AI didn't return a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Landmark chat failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while answering. Please try again." },
      { status: 502 }
    );
  }
}
