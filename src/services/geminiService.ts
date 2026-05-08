import { GoogleGenAI, Type } from "@google/genai";
import { TravelPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    duration: { type: Type.NUMBER },
    budget: { type: Type.STRING },
    interests: { type: Type.ARRAY, items: { type: Type.STRING } },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                estimatedCost: { type: Type.STRING },
              },
              required: ["time", "description", "location"],
            },
          },
        },
        required: ["day", "activities"],
      },
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
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
  },
  required: ["destination", "duration", "budget", "itinerary", "tips", "recommendedPlaces"],
};

export async function generateTravelPlan(
  destination: string,
  duration: number,
  budget: string,
  interests: string[]
): Promise<TravelPlan> {
  const prompt = `Generate a detailed travel itinerary for ${duration} days in ${destination} with a ${budget} budget. 
  Interests: ${interests.join(", ")}. 
  Provide specific activities with times, travel tips, and recommended places.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: travelPlanSchema,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate travel plan");
  }

  return JSON.parse(response.text) as TravelPlan;
}
