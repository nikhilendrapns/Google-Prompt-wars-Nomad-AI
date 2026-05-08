import { GoogleGenAI, Type } from "@google/genai";
import { TravelPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    duration: { type: Type.NUMBER },
    budget: { type: Type.STRING },
    travelStyle: { type: Type.STRING },
    travelers: { type: Type.STRING },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          vibe: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
                travelTip: { type: Type.STRING },
              },
              required: ["time", "description", "location"],
            },
          },
        },
        required: ["day", "vibe", "activities"],
      },
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    logistics: {
      type: Type.OBJECT,
      properties: {
        transportation: { type: Type.STRING },
        visaRequirement: { type: Type.STRING },
        bestTimeToVisit: { type: Type.STRING },
      },
      required: ["transportation", "visaRequirement", "bestTimeToVisit"],
    },
    recommendedPlaces: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ["name", "description", "category"],
      },
    },
    heroImagePrompt: { type: Type.STRING },
    coordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
      },
      required: ["lat", "lng"],
    },
  },
  required: [
    "destination", "duration", "budget", "travelStyle", "travelers",
    "itinerary", "tips", "logistics", "recommendedPlaces", "heroImagePrompt",
    "coordinates"
  ],
};

export async function generateTravelPlan(
  destination: string,
  duration: number,
  budget: string,
  interests: string[],
  style: string = "balanced",
  travelers: string = "solo"
): Promise<TravelPlan> {
  const prompt = `Act as an elite global travel concierge. Curate a highly personalized itinerary for ${duration} days in ${destination}.
  Budget: ${budget}. Pace: ${style}. Travelers: ${travelers}. Interests: ${interests.join(", ")}.
  Sequence activities to minimize transit. Include neighborhood names and architectural/gastronomic highlights.
  Always include accurate latitude and longitude for the destination center.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelPlanSchema as any,
      },
    });

    if (!result.text) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(result.text);
  } catch (error) {
    console.error("Travel Plan Generation Error:", error);
    throw error;
  }
}
