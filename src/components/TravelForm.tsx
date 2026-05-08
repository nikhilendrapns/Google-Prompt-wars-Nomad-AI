import React, { useState } from "react";
import { Send, MapPin, Calendar, Wallet, Compass } from "lucide-react";
import { motion } from "motion/react";

interface TravelFormProps {
  onSubmit: (destination: string, duration: number, budget: string, interests: string[]) => void;
  isLoading: boolean;
}

export const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("balanced");
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination) {
      onSubmit(destination, duration, budget, interests);
    }
  };

  const addInterest = () => {
    if (currentInterest && !interests.includes(currentInterest)) {
      setInterests([...interests, currentInterest]);
      setCurrentInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-3xl border border-apple-border shadow-sm"
    >
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
            <input
              type="text"
              placeholder="Where to? (e.g., Kyoto, Japan)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text placeholder-apple-secondary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Duration (Days)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <input
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Budget</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text appearance-none"
              >
                <option value="budget">Budget</option>
                <option value="balanced">Balanced</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Interests</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <input
                type="text"
                placeholder="e.g., Food, Hiking, Museums"
                value={currentInterest}
                onChange={(e) => setCurrentInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text placeholder-apple-secondary"
              />
            </div>
            <button
              type="button"
              onClick={addInterest}
              className="px-6 py-3 bg-apple-text text-white font-semibold rounded-xl hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-3 py-1 bg-apple-bg border border-apple-border rounded-full text-xs font-medium text-apple-secondary"
              >
                {interest}
                <button type="button" onClick={() => removeInterest(interest)} className="hover:text-apple-text ml-1 opacity-60 hover:opacity-100 transition-opacity">&times;</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !destination}
        className="w-full py-4 bg-apple-blue text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Generate Plan
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.form>
  );
};
