
export type WeatherIconKey = "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export function describeWeatherCode(code: number): { label: string; icon: WeatherIconKey } {
  if (code === 0) return { label: "Clear sky", icon: "clear" };
  if (code === 1) return { label: "Mostly clear", icon: "clear" };
  if (code === 2) return { label: "Partly cloudy", icon: "cloudy" };
  if (code === 3) return { label: "Overcast", icon: "cloudy" };
  if (code === 45 || code === 48) return { label: "Foggy", icon: "fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: "drizzle" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain", icon: "rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: "snow" };
  if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "storm" };
  return { label: "Unknown", icon: "cloudy" };
}
