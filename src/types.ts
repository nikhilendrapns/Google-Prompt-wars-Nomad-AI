export interface ItineraryItem {
  day: number;
  vibe: string;
  activities: {
    time: string;
    description: string;
    location: string;
    estimatedCost?: string;
    travelTip?: string;
  }[];
}

export interface TravelPlan {
  id?: string;
  destination: string;
  duration: number;
  budget: "budget" | "balanced" | "luxury";
  travelStyle: "relaxed" | "balanced" | "fast-paced";
  travelers: "solo" | "couple" | "family" | "friends";
  interests: string[];
  itinerary: ItineraryItem[];
  tips: string[];
  logistics: {
    transportation: string;
    visaRequirement: string;
    bestTimeToVisit: string;
  };
  recommendedPlaces: {
    name: string;
    description: string;
    category: string;
  }[];
  heroImagePrompt: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
}
