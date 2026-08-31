import { NextResponse } from "next/server";
import { describeWeatherCode } from "@/src/lib/weather-codes";

interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
}

interface ForecastResponse {
  current?: {
    temperature_2m: number;
    weather_code: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
  current_units?: {
    temperature_2m: string;
    wind_speed_10m: string;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim();
  const country = searchParams.get("country")?.trim();
  const geocodeQuery = city || country;

  if (!geocodeQuery) {
    return NextResponse.json({ error: "A location is required." }, { status: 400 });
  }

  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(geocodeQuery)}&count=1&language=en&format=json`
    );
    if (!geoResponse.ok) {
      return NextResponse.json({ error: "Couldn't look up that location." }, { status: 502 });
    }
    const geoData = (await geoResponse.json()) as { results?: GeocodingResult[] };
    const location = geoData.results?.[0];
    if (!location) {
      return NextResponse.json({ error: "Couldn't find weather for that location." }, { status: 404 });
    }

    const forecastResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );
    if (!forecastResponse.ok) {
      return NextResponse.json({ error: "Couldn't fetch the forecast." }, { status: 502 });
    }
    const forecastData = (await forecastResponse.json()) as ForecastResponse;
    if (!forecastData.current) {
      return NextResponse.json({ error: "No current weather is available." }, { status: 502 });
    }

    const { label, icon } = describeWeatherCode(forecastData.current.weather_code);

    return NextResponse.json({
      locationLabel: [location.name, location.country].filter(Boolean).join(", "),
      temperature: Math.round(forecastData.current.temperature_2m),
      temperatureUnit: forecastData.current_units?.temperature_2m ?? "°C",
      condition: label,
      icon,
      humidity: Math.round(forecastData.current.relative_humidity_2m),
      windSpeed: Math.round(forecastData.current.wind_speed_10m),
      windSpeedUnit: forecastData.current_units?.wind_speed_10m ?? "km/h",
    });
  } catch (error) {
    console.error("Weather lookup failed:", error);
    return NextResponse.json({ error: "Something went wrong fetching the weather." }, { status: 502 });
  }
}
