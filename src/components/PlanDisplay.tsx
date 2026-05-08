import React from "react";
import { TravelPlan } from "../types";
import { motion } from "motion/react";
import { Clock, MapPin, Lightbulb, Star, Navigation } from "lucide-react";

interface PlanDisplayProps {
  plan: TravelPlan;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-16 space-y-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-apple-secondary">Your Curated Journey</span>
        <h2 className="text-5xl md:text-7xl font-light tracking-tight text-apple-text leading-none capitalize">
          {plan.destination}
        </h2>
        <div className="flex justify-center gap-4 text-apple-secondary">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {plan.duration} Days</span>
          <span className="flex items-center gap-1 uppercase tracking-tighter font-semibold"><Star className="w-4 h-4" /> {plan.budget}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {plan.itinerary.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-8 border-l border-apple-border space-y-6"
            >
              <div className="absolute -left-[7px] top-0 w-3.5 h-3.5 bg-apple-blue rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-medium text-apple-text">Day {day.day}</h3>
                <span className="text-[11px] font-bold text-apple-blue uppercase tracking-widest">Optimized Route</span>
              </div>
              <div className="space-y-6">
                {day.activities.map((activity, aIdx) => (
                  <div key={aIdx} className="bg-white p-5 rounded-2xl border border-apple-border shadow-sm hover:border-apple-blue/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-apple-blue uppercase tracking-widest">{activity.time}</span>
                      {activity.estimatedCost && (
                        <span className="text-[10px] px-2 py-1 bg-apple-bg rounded-md text-apple-secondary font-bold uppercase tracking-wider">{activity.estimatedCost}</span>
                      )}
                    </div>
                    <h4 className="text-lg font-medium text-apple-text group-hover:text-apple-blue transition-colors capitalize">{activity.description}</h4>
                    <p className="flex items-center gap-1 text-sm text-apple-secondary mt-2">
                      <MapPin className="w-3 h-3" /> {activity.location}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl border border-apple-border shadow-sm space-y-6"
          >
            <h3 className="flex items-center gap-2 text-xl font-medium text-apple-text">
              <Navigation className="w-5 h-5 text-apple-blue" /> Recommendations
            </h3>
            <div className="space-y-4">
              {plan.recommendedPlaces.map((place, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-apple-text">{place.name}</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-apple-bg rounded text-apple-secondary">{place.category}</span>
                  </div>
                  <p className="text-xs text-apple-secondary leading-relaxed">{place.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-apple-text p-7 rounded-3xl space-y-6 shadow-xl"
          >
            <h3 className="flex items-center gap-2 text-xl font-medium text-white">
              <Lightbulb className="w-5 h-5 text-apple-blue" /> Pro Tips
            </h3>
            <ul className="space-y-4">
              {plan.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-white/80 leading-relaxed group">
                  <span className="shrink-0 text-apple-blue font-bold text-xs mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
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
