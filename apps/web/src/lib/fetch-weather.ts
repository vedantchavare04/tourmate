import type { WeatherIconKey } from "@/src/lib/weather-codes";

export interface WeatherSnapshot {
  locationLabel: string;
  temperature: number;
  temperatureUnit: string;
  condition: string;
  icon: WeatherIconKey;
  humidity: number;
  windSpeed: number;
  windSpeedUnit: string;
}

export async function fetchWeather(city: string | null, country: string | null): Promise<WeatherSnapshot> {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (country) params.set("country", country);

  let response: Response;
  try {
    response = await fetch(`/api/guide/weather?${params.toString()}`);
  } catch {
    throw new Error("Couldn't reach the server.");
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
        : "Couldn't fetch the weather.";
    throw new Error(message);
  }

  return payload as WeatherSnapshot;
}
