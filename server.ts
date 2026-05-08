import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Weather Proxy (Open-Meteo)
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Weather data unavailable" });
  }
});

// Time Proxy
app.get("/api/time", async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    const data = await response.json() as any;
    
    const formatter = new Intl.DateTimeFormat([], {
      timeZone: data.timezone || 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    res.json({
      timezone: data.timezone,
      localTime: formatter.format(new Date()),
      abbreviation: data.timezone_abbreviation
    });
  } catch (error) {
    res.status(500).json({ error: "Time data unavailable" });
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
