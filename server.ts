import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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

// --- API Endpoints ---

// Gemini Travel Plan Proxy
app.post("/api/plan", async (req, res) => {
  const { destination, duration, budget, interests, style, travelers } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Gemini API key not configured on server" });
  }

  const prompt = `Act as an elite global travel concierge. Curate a highly personalized itinerary for ${duration} days in ${destination}.
  Budget: ${budget}. Pace: ${style}. Travelers: ${travelers}. Interests: ${interests.join(", ")}.
  Sequence activities to minimize transit. Include neighborhood names and architectural/gastronomic highlights.
  Always include accurate latitude and longitude for the destination center.`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelPlanSchema,
      },
    });

    if (!result.text) {
      throw new Error("Empty response from AI");
    }

    res.json(JSON.parse(result.text));
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

// Weather Proxy (Open-Meteo)
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Weather data unavailable" });
  }
});

// Country Info Proxy (REST Countries)
app.get("/api/country/:name", async (req, res) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${req.params.name}?fullText=true`);
    const data = await response.json();
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: "Country data unavailable" });
  }
});

// --- Middleware Setup ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
