import { TravelPlan } from "../types";
import { generateTravelPlan as generatePlanAI } from "./aiService";

export async function generateTravelPlan(
  destination: string,
  duration: number,
  budget: string,
  interests: string[],
  style: string = "balanced",
  travelers: string = "solo"
): Promise<TravelPlan> {
  return generatePlanAI(destination, duration, budget, interests, style, travelers);
}

export async function getWeatherData(lat: number, lon: number) {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  return response.json();
}

export async function getTimeData(lat: number, lon: number) {
  const response = await fetch(`/api/time?lat=${lat}&lon=${lon}`);
  return response.json();
}

export async function getCountryData(name: string) {
  const response = await fetch(`/api/country/${encodeURIComponent(name)}`);
  return response.json();
}
