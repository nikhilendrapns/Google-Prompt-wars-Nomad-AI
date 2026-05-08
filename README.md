# NomadAI: Premium AI Travel Planner

A full-stack, "Clean Minimalism" inspired travel planning engine built for speed and discovery. NomadAI uses Gemini AI to craft high-density, budget-aware itineraries.

## 🚀 Features
- **AI Itinerary Engine**: Real-time generation using Gemini 1.5 Flash.
- **Weather Insights**: Integrated current weather for target destinations.
- **Clean Minimalism UI**: Polished, responsive design inspired by high-end tech aesthetics.
- **Full-Stack Architecture**: Node.js/Express backend with a React/Vite frontend.
- **Deployment Ready**: Standardized for Google Cloud Run and Firebase Hosting.

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion (Motion).
- **Backend**: Node.js, Express.
- **AI**: Google Generative AI (Gemini).
- **Icons**: Lucide React.
- **Deployment**: Cloud Run (Backend/API), Firebase Hosting (Static Assets).

## 📦 Setup & Installation

### 1. Environment Variables
Create a `.env` file in the root (use `.env.example` as a template):
```env
GEMINI_API_KEY=your_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 🚢 Deployment

### Cloud Run (Backend)
The project includes a `Dockerfile` for easy deployment to Google Cloud Run.
```bash
gcloud run deploy nomad-ai --source .
```

### Firebase Hosting (Frontend)
Configuration is available in `firebase.json`.
```bash
firebase deploy
```

---

*Built with ❤️ for the Google PromptWars Travel Engine Challenge.*
