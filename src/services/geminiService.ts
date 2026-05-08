import { TravelPlan } from "../types";

export async function generateTravelPlan(
  destination: string,
  duration: number,
  budget: string,
  interests: string[],
  style: string = "balanced",
  travelers: string = "solo"
): Promise<TravelPlan> {
  try {
    const response = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, duration, budget, interests, style, travelers }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to generate travel plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Travel Plan Generation Error:", error);
    throw error;
  }
}

export async function getWeatherData(lat: number, lon: number) {
  const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  return response.json();
}

export async function getCountryData(name: string) {
  const response = await fetch(`/api/country/${encodeURIComponent(name)}`);
  return response.json();
}
