"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import { fetchWeather, type WeatherSnapshot } from "@/src/lib/fetch-weather";
import type { WeatherIconKey } from "@/src/lib/weather-codes";

interface WeatherWidgetProps {
  city: string | null;
  country: string | null;
}

const ICONS: Record<WeatherIconKey, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
};

type Status = "loading" | "ready" | "unavailable";

export function WeatherWidget({ city, country }: WeatherWidgetProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!city && !country) {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    fetchWeather(city, country)
      .then((data) => {
        if (cancelled) return;
        setWeather(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, [city, country]);

  if (status === "unavailable") return null;

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 bg-black/5 text-black/40 text-xs font-semibold px-3 py-1.5 rounded-full animate-pulse">
        <Cloud className="w-3.5 h-3.5" aria-hidden="true" />
        Loading weather…
      </div>
    );
  }

  if (!weather) return null;
  const Icon = ICONS[weather.icon];

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="inline-flex items-center gap-2 bg-black/5 text-black/70 text-xs font-semibold px-3 py-1.5 rounded-full">
        <Icon className="w-3.5 h-3.5 text-[#0038FF]" aria-hidden="true" />
        <span>
          {weather.temperature}
          {weather.temperatureUnit} &middot; {weather.condition} in {weather.locationLabel}
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-black/40">
          <Droplets className="w-3 h-3" aria-hidden="true" />
          {weather.humidity}%
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-black/40">
          <Wind className="w-3 h-3" aria-hidden="true" />
          {weather.windSpeed}
          {weather.windSpeedUnit}
        </span>
      </div>
      <span className="text-[10px] text-black/25 pl-1">Weather by Open-Meteo.com</span>
    </div>
  );
}
