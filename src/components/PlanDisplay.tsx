import React from "react";
import { TravelPlan } from "../types";
import { motion } from "motion/react";
import { Clock, MapPin, Lightbulb, Star, Navigation, Plane, ShieldCheck, Ticket } from "lucide-react";
import { ConciergeInsights } from "./ConciergeInsights";

interface PlanDisplayProps {
  plan: TravelPlan;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-16 space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        <div className="relative h-[400px] md:h-[550px] w-full rounded-[40px] overflow-hidden group shadow-2xl">
          <img
            src={`https://source.unsplash.com/featured/?${encodeURIComponent(plan.destination + " travel landscape")}`}
            alt={plan.destination}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold text-white uppercase tracking-widest">
              <Star className="w-3 h-3 text-apple-blue" /> Concierge AI Intelligence
            </div>
          </div>
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6 text-white text-left">
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none flex items-center">{plan.travelers}</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none flex items-center">{plan.travelStyle}</span>
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/60">The Grand Itinerary</span>
                <h2 className="text-5xl md:text-8xl font-sans font-medium tracking-tighter leading-none capitalize">
                  {plan.destination}
                </h2>
              </div>
            </div>
            <div className="flex gap-4 mb-2 no-print">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-white text-apple-text rounded-full text-xs font-bold hover:bg-apple-bg transition-all"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 no-print">
          <div className="bg-white p-6 rounded-3xl border border-apple-border flex flex-col gap-1 items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-apple-secondary/60">Transport</span>
            <span className="text-sm font-bold text-apple-text flex items-center gap-2"><Plane className="w-4 h-4 text-apple-blue" /> {plan.logistics.transportation}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-apple-border flex flex-col gap-1 items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-apple-secondary/60">Visa Status</span>
            <span className="text-sm font-bold text-apple-text flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-apple-blue" /> {plan.logistics.visaRequirement}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-apple-border flex flex-col gap-1 items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-apple-secondary/60">Optimum Season</span>
            <span className="text-sm font-bold text-apple-text flex items-center gap-2"><Clock className="w-4 h-4 text-apple-blue" /> {plan.logistics.bestTimeToVisit}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-apple-border flex flex-col gap-1 items-center md:items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-apple-secondary/60">Investment</span>
            <span className="text-sm font-bold text-apple-text flex items-center gap-2 uppercase"><Star className="w-4 h-4 text-apple-blue" /> {plan.budget}</span>
          </div>
        </div>

        <ConciergeInsights destination={plan.destination} coordinates={plan.coordinates} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Itinerary */}
        <div className="lg:col-span-2 space-y-16">
          {plan.itinerary.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="relative pl-12 border-l-2 border-apple-border space-y-8"
            >
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-apple-bg rounded-full border-[4px] border-apple-blue shadow-lg" />
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-4xl font-sans font-medium text-apple-text tracking-tight italic">Day {day.day}</h3>
                  <div className="px-3 py-1 bg-apple-bg rounded-full text-[10px] font-bold text-apple-blue uppercase tracking-widest border border-apple-blue/20">
                    {day.vibe}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {day.activities.map((activity, aIdx) => (
                  <div key={aIdx} className="group relative">
                    <div className="absolute -left-[48px] top-4 w-2 h-2 rounded-full bg-apple-blue group-hover:scale-150 transition-transform" />
                    <div className="bg-white p-8 rounded-[32px] border border-apple-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <span className="text-xs font-mono text-apple-blue font-bold uppercase tracking-widest">{activity.time}</span>
                          <h4 className="text-2xl font-medium text-apple-text tracking-tight capitalize">{activity.description}</h4>
                        </div>
                        {activity.estimatedCost && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-apple-bg rounded-xl border border-apple-border text-[10px] font-bold text-apple-secondary uppercase tracking-tight">
                            <Star className="w-3 h-3 text-apple-blue" />
                            {activity.estimatedCost}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mt-6 pt-6 border-t border-apple-bg">
                        <div className="flex items-center gap-2 text-sm text-apple-secondary font-medium">
                          <div className="p-2 bg-apple-bg rounded-full">
                            <MapPin className="w-4 h-4 text-apple-blue" />
                          </div>
                          {activity.location}
                        </div>
                        {activity.travelTip && (
                          <div className="flex items-center gap-3 bg-blue-50/50 px-4 py-2 rounded-2xl border border-blue-100 italic text-xs text-apple-blue/80 font-medium">
                            <Ticket className="w-4 h-4 shrink-0" />
                            "{activity.travelTip}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-apple-bg p-6 rounded-3xl border border-apple-border shadow-sm space-y-6"
          >
            <h3 className="flex items-center gap-2 text-lg font-bold text-apple-text uppercase tracking-tight">
              <Navigation className="w-5 h-5 text-apple-blue" /> Places to Visit
            </h3>
            <div className="space-y-5">
              {plan.recommendedPlaces.map((place, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-apple-text text-sm">{place.name}</h4>
                    <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-white border border-apple-border rounded text-apple-secondary">{place.category}</span>
                  </div>
                  <p className="text-xs text-apple-secondary leading-relaxed font-medium">{place.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-apple-text p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-apple-blue/10 rounded-full blur-3xl -mr-12 -mt-12" />
            <h3 className="flex items-center gap-2 text-xl font-medium text-white relative z-10">
              <Lightbulb className="w-5 h-5 text-apple-blue" /> Pro Tips
            </h3>
            <ul className="space-y-5 relative z-10">
              {plan.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-4 text-sm text-white/70 leading-relaxed">
                  <span className="shrink-0 text-apple-blue font-bold text-xs mt-0.5 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
