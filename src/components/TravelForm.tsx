import React, { useState } from "react";
import { Send, MapPin, Calendar, Wallet, Compass, Users, Activity } from "lucide-react";
import { motion } from "motion/react";

interface TravelFormProps {
  onSubmit: (destination: string, duration: number, budget: string, interests: string[], style: string, travelers: string) => void;
  isLoading: boolean;
}

export const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("balanced");
  const [style, setStyle] = useState("balanced");
  const [travelers, setTravelers] = useState("solo");
  const [interests, setInterests] = useState<string[]>([]);
  const [currentInterest, setCurrentInterest] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("Consulting AI travel experts...");

  const loadingMessages = [
    "Consulting AI travel experts...",
    "Finding hidden local gems...",
    "Optimizing your route for speed...",
    "Checking local weather patterns...",
    "Curating unique experiences...",
    "Finalizing your dream itinerary..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination) {
      onSubmit(destination, duration, budget, interests, style, travelers);
    }
  };

  const addInterest = () => {
    if (currentInterest) {
      // Allow comma separated interests
      const newInterests = currentInterest
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && !interests.includes(s));
      
      if (newInterests.length > 0) {
        setInterests([...interests, ...newInterests]);
      }
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
            <label htmlFor="duration-input" className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Duration (1-14 Days)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <input
                id="duration-input"
                type="number"
                min="1"
                max="14"
                value={duration}
                aria-label="Travel duration in days"
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setDuration(Math.min(14, Math.max(1, val)));
                }}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="budget-select" className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Budget Tier</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <select
                id="budget-select"
                value={budget}
                aria-label="Travel budget level"
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text appearance-none"
              >
                <option value="budget">Budget (Economy)</option>
                <option value="balanced">Balanced (Mid-range)</option>
                <option value="luxury">Luxury (Premium)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Pacing & Style</label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text appearance-none"
              >
                <option value="relaxed">Relaxed (Slow Travel)</option>
                <option value="balanced">Balanced (The Classics)</option>
                <option value="fast-paced">Fast-paced (See it all)</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-apple-secondary mb-1.5 ml-1">Traveling As</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary" />
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-apple-bg border border-apple-border rounded-xl focus:ring-2 focus:ring-apple-blue/20 focus:outline-none text-apple-text appearance-none"
              >
                <option value="solo">Solo Traveler</option>
                <option value="couple">Couple</option>
                <option value="family">Family (Kids)</option>
                <option value="friends">Group of Friends</option>
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
        className="w-full py-4 bg-apple-blue text-white font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md overflow-hidden relative"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">{loadingMessage}</span>
          </div>
        ) : (
          <>
            Generate AI Itinerary
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.form>
  );
};
