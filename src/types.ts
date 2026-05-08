export interface ItineraryItem {
  day: number;
  activities: {
    time: string;
    description: string;
    location: string;
    estimatedCost?: string;
  }[];
}

export interface TravelPlan {
  destination: string;
  duration: number;
  budget: "budget" | "balanced" | "luxury";
  interests: string[];
  itinerary: ItineraryItem[];
  tips: string[];
  recommendedPlaces: {
    name: string;
    description: string;
    category: string;
  }[];
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
}
