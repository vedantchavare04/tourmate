"use client";

import { useEffect, useState, type ComponentType } from "react";
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

const ICONS: Record<WeatherIconKey, ComponentType<{ className?: string }>> = {
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
      <div className="animate-pulse flex items-center gap-2 rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-dim)]">
        <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
        Loading weather…
      </div>
    );
  }

  if (!weather) return null;

  const Icon = ICONS[weather.icon];

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tourmate-line)] bg-[var(--tourmate-sand)] px-3 py-1.5 text-xs font-semibold text-[var(--tourmate-ink)]">
        <Icon
          className="h-3.5 w-3.5 text-[var(--tourmate-teal-dark)]"
          aria-hidden="true"
        />

        <span>
          {weather.temperature}
          {weather.temperatureUnit} &middot; {weather.condition} in{" "}
          {weather.locationLabel}
        </span>

        <span className="hidden items-center gap-1 text-[var(--tourmate-dim)] sm:inline-flex">
          <Droplets className="h-3 w-3" aria-hidden="true" />
          {weather.humidity}%
        </span>

        <span className="hidden items-center gap-1 text-[var(--tourmate-dim)] sm:inline-flex">
          <Wind className="h-3 w-3" aria-hidden="true" />
          {weather.windSpeed}
          {weather.windSpeedUnit}
        </span>
      </div>

      <span className="pl-1 text-[10px] text-[var(--tourmate-dim)]">
        Weather by Open-Meteo.com
      </span>
    </div>
  );
}
