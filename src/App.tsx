import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TravelForm } from "./components/TravelForm";
import { PlanDisplay } from "./components/PlanDisplay";
import { WeatherWidget } from "./components/WeatherWidget";
import { generateTravelPlan } from "./services/geminiService";
import { TravelPlan } from "./types";
import { Globe, Plane, Coffee, Zap, ChevronDown } from "lucide-react";

export default function App() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (dest: string, dur: number, bud: string, ints: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTravelPlan(dest, dur, bud, ints);
      setPlan(result);
      // Scroll to result
      setTimeout(() => {
        document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to create your itinerary. Please try a different destination or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text font-sans selection:bg-apple-blue selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-apple-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-apple-blue/5 rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-apple-border bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NomadAI</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-apple-secondary">
            <a href="#" className="hover:text-apple-text transition-colors">Destinations</a>
            <a href="#" className="hover:text-apple-text transition-colors">Pricing</a>
            <a href="#" className="hover:text-apple-text transition-colors">Resources</a>
          </div>
          <button className="px-5 py-2 bg-apple-text text-white text-sm font-bold rounded-full hover:bg-black transition-all">
            Get Pro
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-apple-border rounded-full mb-4 shadow-sm"
          >
            <Zap className="w-4 h-4 text-apple-blue fill-apple-blue" />
            <span className="text-xs font-bold uppercase tracking-widest text-apple-secondary">Next-Gen Travel Planning</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-none text-apple-text"
          >
            Escape the <br />
            <span className="italic font-serif text-apple-secondary">Ordinary.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-apple-secondary leading-relaxed font-light"
          >
            Our AI-driven engine crafts perfectly balanced itineraries tailored to your unique passions and budget. 
            No crowds, no stress, just pure discovery.
          </motion.p>

          <div className="pt-12">
            <TravelForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-24 animate-bounce text-white/20"
          >
            <ChevronDown className="w-8 h-8 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Dynamic Results */}
      <AnimatePresence mode="wait">
        {(plan || error) && (
          <section id="itinerary" className="relative py-32 px-6 border-t border-apple-border overflow-hidden bg-white">
             {/* Extra background highlights for result section */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-apple-bg -rotate-12 rounded-[100%] blur-[100px] -z-10" />
             
            <div className="max-w-7xl mx-auto space-y-12">
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center text-red-200"
                >
                  {error}
                </motion.div>
              ) : plan && (
                <>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/3">
                      <WeatherWidget destination={plan.destination} />
                    </div>
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      <StatCard icon={<Globe className="w-4 h-4" />} title="Region" value={plan.destination.split(',').pop()?.trim() || "Global"} />
                      <StatCard icon={<Plane className="w-4 h-4" />} title="Duration" value={`${plan.duration} Days`} />
                      <StatCard icon={<Coffee className="w-4 h-4" />} title="Intensity" value="Moderate" />
                      <StatCard icon={<Zap className="w-4 h-4" />} title="Type" value={plan.budget === 'luxury' ? 'Premium' : 'Standard'} />
                    </div>
                  </div>
                  <PlanDisplay plan={plan} />
                </>
              )}
            </div>
          </section>
        )}
      </AnimatePresence>

      <footer className="py-20 px-6 border-t border-apple-border text-center space-y-4 bg-white">
        <div className="flex justify-center gap-6 text-apple-secondary">
          <Globe className="w-5 h-5 cursor-pointer hover:text-apple-text transition-colors" />
          <Plane className="w-5 h-5 cursor-pointer hover:text-apple-text transition-colors" />
          <Zap className="w-5 h-5 cursor-pointer hover:text-apple-text transition-colors" />
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-apple-secondary/40">
          © 2026 NomadAI. Built for the future of travel.
        </p>
      </footer>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-apple-border shadow-sm space-y-1">
      <div className="flex items-center gap-2 text-apple-secondary mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-lg font-medium text-apple-text tracking-tight">{value}</p>
    </div>
  );
}
