import React, { useEffect, useState } from "react";
import { getWeatherData, getCountryData, getTimeData } from "../services/geminiService";
import { Cloud, Thermometer, Globe, DollarSign, Languages, Info, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ConciergeInsightsProps {
  destination: string;
  coordinates: { lat: number; lng: number };
}

export const ConciergeInsights: React.FC<ConciergeInsightsProps> = ({ destination, coordinates }) => {
  const [weather, setWeather] = useState<any>(null);
  const [country, setCountry] = useState<any>(null);
  const [time, setTime] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const [wData, cData, tData] = await Promise.all([
          getWeatherData(coordinates.lat, coordinates.lng),
          getCountryData(destination.split(",")[destination.split(",").length - 1].trim()),
          getTimeData(coordinates.lat, coordinates.lng)
        ]);
        setWeather(wData);
        setCountry(cData);
        setTime(tData);
      } catch (error) {
        console.error("Failed to fetch concierge insights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [destination, coordinates]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-apple-border/20 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
      <AnimatePresence mode="wait">
        {weather && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-sky-50/80 backdrop-blur-lg p-6 rounded-3xl border border-sky-100 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">Local Weather</span>
              <Cloud className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-sky-900">{weather.current_weather.temperature}°C</span>
              <span className="text-sm font-medium text-sky-600">Wind: {weather.current_weather.windspeed} km/h</span>
            </div>
          </motion.div>
        )}

        {time && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-50/80 backdrop-blur-lg p-6 rounded-3xl border border-indigo-100 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Local Time</span>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-900">{time.localTime}</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase">{time.abbreviation}</span>
            </div>
          </motion.div>
        )}

        {country && (
          <>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-50/80 backdrop-blur-lg p-6 rounded-3xl border border-emerald-100 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Localization</span>
                <Languages className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-900 line-clamp-1">{Object.values(country.languages || {}).join(", ")}</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50/80 backdrop-blur-lg p-6 rounded-3xl border border-amber-100 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Currency</span>
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-amber-900">{Object.values(country.currencies || {}).map((c: any) => `${c.symbol}`).join(" / ")} · {Object.values(country.currencies || {}).map((c: any) => `${c.name}`).join(", ")}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
