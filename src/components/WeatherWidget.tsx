import React, { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Wind, Thermometer } from "lucide-react";
import { WeatherData } from "../types";

interface WeatherWidgetProps {
  destination: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ destination }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // First search for coordinates using Nominatim (no key)
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
        );
        const geoData = await geoRes.json();
        
        if (geoData && geoData[0]) {
          const { lat, lon } = geoData[0];
          // Use our backend proxy for Open-Meteo
          const weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
          const weatherData = await weatherRes.json();
          setWeather(weatherData);
        }
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) return <div className="h-24 animate-pulse bg-white rounded-2xl border border-apple-border shadow-sm" />;
  if (!weather) return null;

  const { temperature, weathercode, windspeed } = weather.current_weather;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-orange-400" />;
    if (code < 4) return <Cloud className="w-8 h-8 text-apple-secondary" />;
    return <CloudRain className="w-8 h-8 text-apple-blue" />;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-apple-border shadow-sm flex items-center justify-between w-full">
      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-widest text-apple-secondary">Local Weather</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-light text-apple-text">{temperature}°C</span>
          <div className="h-8 w-px bg-apple-border" />
          <div className="flex flex-col text-[11px] text-apple-secondary font-medium">
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {windspeed} km/h</span>
            <span className="flex items-center gap-1 font-bold text-apple-blue tracking-tighter uppercase text-[9px] mt-0.5">Live Data</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        {getWeatherIcon(weathercode)}
      </div>
    </div>
  );
};
