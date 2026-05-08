import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TravelForm } from "./components/TravelForm";
import { PlanDisplay } from "./components/PlanDisplay";
import { WeatherWidget } from "./components/WeatherWidget";
import { generateTravelPlan } from "./services/geminiService";
import { TravelPlan } from "./types";
import { Globe, Plane, Coffee, Zap, ChevronDown, LogIn, LogOut, History, User } from "lucide-react";
import { auth, signInWithGoogle, logout, saveTravelPlan, getUserPlans, getPlanById } from "./lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

export default function App() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [recentPlans, setRecentPlans] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Auth & Persistence Layer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        loadUserPlans(u.uid);
      }
    });

    const checkSharedPlan = async () => {
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get("voyage");
      if (sharedId) {
        try {
          setIsLoading(true);
          const sharedPlan = await getPlanById(sharedId);
          if (sharedPlan) {
            setPlan(sharedPlan as any);
            setTimeout(() => {
              document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" });
            }, 500);
          }
        } catch (err) {
          console.error("Error loading shared plan", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        const cached = localStorage.getItem("travel_plan_cache");
        if (cached) {
          try {
            setPlan(JSON.parse(cached));
          } catch (e) {
            localStorage.removeItem("travel_plan_cache");
          }
        }
      }
    };

    checkSharedPlan();
    
    return () => unsubscribe();
  }, []);

  const loadUserPlans = async (uid: string) => {
    try {
      const plans = await getUserPlans(uid);
      setRecentPlans(plans);
    } catch (err) {
      console.error("Failed to load plans", err);
    }
  };

  const handleGenerate = async (dest: string, dur: number, bud: string, ints: string[], style: string, travelers: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTravelPlan(dest, dur, bud, ints, style, travelers);
      
      let finalPlan = result;
      if (user) {
        const planId = await saveTravelPlan(user.uid, result);
        finalPlan = { ...result, id: planId };
        loadUserPlans(user.uid);
      }
      
      setPlan(finalPlan);
      localStorage.setItem("travel_plan_cache", JSON.stringify(finalPlan));
      
      // Scroll to result
      setTimeout(() => {
        document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Failed to create your itinerary. Please try a different destination or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearPlan = () => {
    setPlan(null);
    localStorage.removeItem("travel_plan_cache");
    // Clear URL params without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete("voyage");
    window.history.replaceState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-apple-text font-sans selection:bg-apple-blue selection:text-white relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#fbfbfd]">
        <div className="absolute inset-0 bg-topo opacity-10" />
        <div className="absolute inset-0 bg-noise mix-blend-overlay" />
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[140px] animate-blob filter" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-sky-100/60 rounded-full blur-[120px] animate-blob animation-delay-2000 filter" />
        <div className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] bg-indigo-50/50 rounded-full blur-[160px] animate-blob animation-delay-4000 filter" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/60" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-apple-border bg-white/80 backdrop-blur-xl no-print">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" aria-label="NomadAI Home" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">NomadAI</span>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex gap-6 text-sm font-medium text-apple-secondary">
              {plan ? (
                <button 
                  onClick={clearPlan}
                  className="hover:text-apple-blue transition-colors font-bold uppercase tracking-widest text-[10px]"
                >
                  New Plan
                </button>
              ) : (
                <a href="#itinerary" className="hover:text-apple-text transition-colors">My Voyage</a>
              )}
              {user && (
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="hover:text-apple-text transition-colors flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              )}
            </div>
            <div className="h-6 w-px bg-apple-border hidden sm:block" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <img src={user.photoURL || ""} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-apple-border" />
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-apple-bg rounded-full transition-colors text-apple-secondary"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-apple-blue text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && user && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] p-8 overflow-y-auto no-print"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Recent Voyages</h2>
                <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-apple-bg rounded-full transition-colors">&times;</button>
              </div>
              
              <div className="space-y-4">
                {recentPlans.length === 0 ? (
                  <p className="text-apple-secondary text-center py-12">No saved plans yet. Start planning!</p>
                ) : (
                  recentPlans.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => { setPlan(p); setShowHistory(false); }}
                      className="group p-4 bg-apple-bg rounded-2xl border border-apple-border hover:border-apple-blue transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-apple-text">{p.destination}</h3>
                        <span className="text-[10px] font-bold text-apple-blue px-2 py-0.5 bg-blue-50 rounded-full">{p.duration}d</span>
                      </div>
                      <p className="text-xs text-apple-secondary line-clamp-1">{p.style} voyage • {p.travelers}</p>
                      <div className="mt-4 flex items-center gap-2 text-[10px] text-apple-secondary opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-widest">
                        View Itinerary →
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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

      <footer className="py-20 px-6 border-t border-apple-border text-center space-y-4 bg-white no-print">
        <div className="flex justify-center gap-8 text-apple-secondary">
          <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-apple-blue transition-all hover:scale-125" title="Google">
            <Globe className="w-6 h-6" />
          </a>
          <a href="https://www.skyscanner.com" target="_blank" rel="noopener noreferrer" className="hover:text-apple-blue transition-all hover:scale-125" title="Skyscanner">
            <Plane className="w-6 h-6" />
          </a>
          <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-apple-blue transition-all hover:scale-125" title="Gemini AI">
            <Zap className="w-6 h-6" />
          </a>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-apple-secondary/60">
            Official Travel Partners & AI Powered by Gemini
          </p>
          <p className="text-[10px] font-mono text-apple-secondary/30">
            © 2026 NomadAI. Built for the future of travel.
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-4 rounded-2xl border border-apple-border shadow-sm space-y-1 hover:border-apple-blue transition-colors cursor-default"
    >
      <div className="flex items-center gap-2 text-apple-secondary mb-1">
        <div className="p-1.5 bg-apple-bg rounded-lg">
          {React.cloneElement(icon as React.ReactElement, { className: "w-3.5 h-3.5 text-apple-blue" })}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-lg font-bold text-apple-text tracking-tight">{value}</p>
    </motion.div>
  );
}
