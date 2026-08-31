import type { LandmarkAnalysis } from "@/src/lib/landmark-schema";


export async function translateLandmark(
  result: LandmarkAnalysis,
  language: string
): Promise<LandmarkAnalysis> {
  let response: Response;
  try {
    response = await fetch("/api/guide/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, result }),
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
        : "Something went wrong while translating. Please try again.";
    throw new Error(message);
  }

  return payload as LandmarkAnalysis;
}
