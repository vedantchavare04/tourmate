import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  text: string;
}

interface AskLandmarkChatInput {
  result: LandmarkAnalysis;
  language: string;
  history: ChatHistoryMessage[];
  question: string;
}

export async function askLandmarkChat({
  result,
  language,
  history,
  question,
}: AskLandmarkChatInput): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/guide/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, language, history, question }),
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Received an unexpected response from the server.");
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "error" in payload
        ? String((payload as { error: unknown }).error)
        : "Something went wrong. Please try again.";
    throw new Error(message);
  }

  const answer =
    typeof payload === "object" && payload !== null && "answer" in payload
      ? (payload as { answer: unknown }).answer
      : null;

  if (typeof answer !== "string") {
    throw new Error("Received an unexpected response from the server.");
  }

  return answer;
}
