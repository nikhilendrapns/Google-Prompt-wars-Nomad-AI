import React, { useState } from "react";
import { Send, MapPin, Calendar, Wallet, Compass, Users, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  const handleInterestInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(",")) {
      const tag = value.slice(0, -1).trim();
      if (tag && !interests.includes(tag)) {
        setInterests([...interests, tag]);
        setCurrentInterest("");
      }
    } else {
      setCurrentInterest(value);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  return (
    <motion.form
      variants={container}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 bg-white p-10 rounded-[32px] border border-apple-border shadow-sm"
    >
      <div className="space-y-6">
        <motion.div variants={item} className="relative">
          <label htmlFor="destination-input" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Destination</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
            <input
              id="destination-input"
              type="text"
              placeholder="Where to? (e.g., Kyoto, Japan)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text placeholder-apple-secondary/50 font-medium"
              required
              aria-required="true"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item} className="relative">
            <label htmlFor="duration-input" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Duration</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
              <input
                id="duration-input"
                type="number"
                min="1"
                max="14"
                value={duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) setDuration(Math.min(14, Math.max(1, val)));
                }}
                className="w-full pl-12 pr-4 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text font-medium"
              />
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <label htmlFor="budget-select" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Budget Tier</label>
            <div className="relative group">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
              <select
                id="budget-select"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text font-medium appearance-none"
              >
                <option value="budget">Budget (Economy)</option>
                <option value="balanced">Balanced (Mid-range)</option>
                <option value="luxury">Luxury (Premium)</option>
              </select>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={item} className="relative">
            <label htmlFor="pacing-select" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Pacing & Style</label>
            <div className="relative group">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
              <select
                id="pacing-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text font-medium appearance-none"
              >
                <option value="relaxed">Relaxed (Slow Travel)</option>
                <option value="balanced">Balanced (The Classics)</option>
                <option value="fast-paced">Fast-paced (See it all)</option>
              </select>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <label htmlFor="travelers-select" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Traveling As</label>
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
              <select
                id="travelers-select"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text font-medium appearance-none"
              >
                <option value="solo">Solo Traveler</option>
                <option value="couple">Couple</option>
                <option value="family">Family (Kids)</option>
                <option value="friends">Group of Friends</option>
              </select>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60 mb-2 ml-1">Interests</label>
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-secondary group-focus-within:text-apple-blue transition-colors" />
              <input
                type="text"
                placeholder="Food, Hiking, Museums..."
                value={currentInterest}
                onChange={handleInterestInput}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                className="w-full pl-12 pr-4 py-4 bg-apple-bg border border-apple-border rounded-2xl focus:ring-4 focus:ring-apple-blue/5 focus:border-apple-blue transition-all focus:outline-none text-apple-text placeholder-apple-secondary/50 font-medium"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-apple-secondary/40 uppercase tracking-widest hidden sm:block">Press Enter or use comma</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <AnimatePresence>
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-apple-border rounded-full text-[11px] font-bold text-apple-text shadow-sm"
                >
                  {interest}
                  <button type="button" onClick={() => removeInterest(interest)} className="hover:text-red-500 transition-colors">&times;</button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.button
        variants={item}
        type="submit"
        disabled={isLoading || !destination}
        className="w-full py-5 bg-apple-blue text-white font-bold rounded-[20px] flex items-center justify-center gap-3 hover:bg-blue-600 disabled:opacity-50 transition-all shadow-xl hover:shadow-blue-500/20 active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">{loadingMessage}</span>
          </div>
        ) : (
          <>
            Create My Voyage
            <Send className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
};
