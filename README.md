# CivicAI 🌆

> **AI-powered civic issue reporting platform** — citizens photograph potholes, garbage, broken lights, and more. Gemini Vision AI analyzes each photo, auto-generates a professional complaint, routes it to the correct municipal department, and displays everything on an interactive Leaflet/OpenStreetMap heatmap.

---

## 📸 Screenshots

| Landing Page | Citizen Dashboard |
|---|---|
| ![Landing Page](Screenshot%202026-07-09%20212222.png) | ![Citizen Dashboard](Screenshot%202026-07-09%20212252.png) |

| Admin Console | Complaint Tracking |
|---|---|
| ![Admin Console](Screenshot%202026-07-09%20212315.png) | ![Complaint Tracking](Screenshot%202026-07-09%20212515.png) |

---

## 🗺️ How It Works

<p align="center">
  <img src="ChatGPT%20Image%20Jul%2010%2C%202026%2C%2002_38_47%20AM.png" alt="CivicAI Workflow" width="420"/>
</p>

### Citizen Journey

<p align="center">
  <img src="ChatGPT%20Image%20Jul%2010%2C%202026%2C%2003_40_08%20AM.png" alt="Citizen Journey" width="560"/>
</p>

---

## ✨ Features

| Area | Highlights |
|---|---|
| 📸 **Image Analysis** | Gemini Vision detects issue category, severity, confidence, and responsible department |
| 📝 **Complaint Generation** | AI writes a professional complaint with priority, impact, and resolution time estimate |
| 📍 **Geo-tagging** | Browser geolocation attaches GPS coordinates to every report |
| 🗺️ **Interactive Maps** | Leaflet + OpenStreetMap with markers, clustering, heatmap layer, and InfoWindows |
| 📊 **Admin Dashboard** | Municipal officers see metrics, charts, filters, severity distribution, and the full complaint queue |
| 🔍 **Complaint Tracking** | Citizens look up any complaint by receipt ID to view real-time pipeline status |
| 🔔 **Toast Notifications** | Real-time feedback on submit, error, and success events |
| 🌙 **Light UI** | Clean card-based design with smooth Framer Motion animations |
| 🐳 **Docker Compose** | Single-command deployment for both services |

---

## 🏗️ Tech Stack

### Frontend

| Tech | Version | Notes |
|---|---|---|
| React | 18 | |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| TypeScript | 5 | |
| framer-motion | 12 | Animations & transitions |
| react-hook-form | 7 | Form state management |
| lucide-react | latest | Icon library |
| Leaflet + react-leaflet | 1.9 / 4 | Interactive map & heatmap |
| leaflet.heat | 0.2 | Heatmap overlay plugin |
| axios | 1 | HTTP client |

### Backend

| Tech | Notes |
|---|---|
| FastAPI | Python 3.11+ ASGI framework |
| Pydantic v2 | Request/response validation |
| Google Gemini API | `gemini-2.0-flash` model for image analysis (via `google-genai` SDK) |
| Supabase | PostgreSQL database + Storage for image uploads |
| python-multipart | Multipart file upload support |
| httpx | Async HTTP client (used in legacy IssueAnalyzer) |
| uvicorn | ASGI server |

---

## 📁 Project Structure

```
CivicAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminMetrics, ComplaintTable, ComplaintFilters,
│   │   │   │                   # ChartPanel, ComplaintsMap, SeverityDistribution, …
│   │   │   ├── common/         # Toast, Skeleton, Badge, EmptyState, AnimatedCounter
│   │   │   ├── dashboard/      # StatisticsCards, RecentComplaints, NearbyIssuesMap,
│   │   │   │                   # ComplaintStatusTimeline, CitizenGreeting, QuickReportButton
│   │   │   ├── forms/
│   │   │   │   └── report-issue/  # UploadDropzone, LocationCard, NotesField, AnalysisPanel
│   │   │   ├── layout/         # AppHeader
│   │   │   └── maps/           # MapLoader, MapMarkerLayer, MapHeatmapLayer,
│   │   │                       # MapInfoWindow, MapLayerToggle
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── HeatmapPage.tsx
│   │   │   ├── admin/          # AdminDashboardPage
│   │   │   └── citizen/        # CitizenDashboardPage, ReportIssuePage,
│   │   │                       # AIAnalysisPage, ComplaintTrackingPage
│   │   ├── services/           # reportApi.ts, googleMaps/mapConfig.ts
│   │   ├── types/              # analysis.ts, report.ts, dashboard.ts, adminDashboard.ts
│   │   └── utils/
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── backend/
    └── app/
        ├── api/v1/
        │   ├── api.py              # Router aggregation
        │   ├── dependencies.py     # FastAPI dependency injection
        │   └── endpoints/          # analyze.py, analysis.py (legacy), complaints.py,
        │                           # dashboard.py, heatmap.py, health.py, reports.py (legacy)
        ├── core/
        │   └── config.py           # Settings dataclass (env vars)
        ├── db/
        │   └── supabase.py         # Supabase client factory & helpers
        ├── integrations/           # ai/, maps/, storage/ sub-packages
        ├── models/                 # complaint.py, department.py, user.py,
        │                           # activity_log.py, enums.py
        ├── prompts/
        │   └── analysis_prompt.py  # Gemini Vision prompt template
        ├── repositories/
        │   ├── report_repository.py     # In-memory thread-safe store
        │   └── supabase_repository.py   # Supabase-backed persistence layer
        ├── schemas/                # analysis.py, complaint.py, dashboard.py,
        │                           # department.py, report.py, user.py, activity_log.py
        ├── services/
        │   ├── gemini_service.py        # Google Gemini Vision API client
        │   ├── image_analysis_service.py  # Legacy image analysis wrapper
        │   ├── issue_analyzer.py        # Legacy keyword + Gemini REST analyzer
        │   ├── report_service.py        # Business logic for all complaint operations
        │   └── storage_service.py       # Supabase Storage image upload service
        └── main.py
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- A Google Gemini API key
- A Supabase project (for storage and persistence)

---

## 🐳 Docker Deployment (Recommended)

The fastest way to run CivicAI end-to-end is with **Docker Compose**. This spins up both the FastAPI backend and the Nginx-served React frontend in isolated containers. Maps use Leaflet + OpenStreetMap — **no Google Maps API key required**.

### Prerequisites (Docker)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- A Google Gemini API key
- A Supabase project with the schema migrated

### Steps

**1. Configure environment variables**

```bash
# Create the backend secrets file
cp backend/.env.example backend/.env
# → Fill in GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

**2. Build and start**

```bash
docker compose up --build
# First build: ~3–5 min (downloads base images, installs deps)
# Subsequent starts: < 30 s (cached layers)
```

**3. Open the app**

| Service | URL |
|---|---|
| 🌐 **Frontend** (React app) | http://localhost |
| 🔌 **Backend API** (direct) | http://localhost:8000/api/v1/health |
| 📖 **Swagger UI** | http://localhost:8000/docs |

**Useful commands**

```bash
# View logs from a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild only the backend after a code change
docker compose up --build backend

# Stop and remove containers
docker compose down
```

---

## 💻 Local Development

### 1. Clone

```bash
git clone https://github.com/your-username/CivicAI.git
cd CivicAI
```

---

### 2. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

> **Note:** The interactive map is powered by **Leaflet + OpenStreetMap** and requires no API key.

Start the dev server:

```bash
npm run dev
# → http://localhost:5173
```

---

### 3. Backend setup

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # starts with eyJ...
SUPABASE_ANON_KEY=your_anon_key                   # optional fallback
SUPABASE_BUCKET=civic-uploads

# Comma-separated allowed frontend origins
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Run the backend:

```bash
# From the backend/ directory:
python -m uvicorn app.main:app --reload
# → http://localhost:8000
# → Swagger UI: http://localhost:8000/docs
```

---

### 4. Database (Supabase)

Run the schema migration in the Supabase SQL editor:

```bash
# Copy contents of backend/supabase/schema.sql into the Supabase SQL editor
# and run it. This creates: users, departments, complaints, activity_logs tables.
```

---

## 🔌 API Endpoints

### Primary Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/analyze` | Upload image (multipart) → Supabase Storage + Gemini Vision analysis |
| `POST` | `/api/v1/complaints` | Submit a complaint (base64 image + optional citizen details) |
| `GET`  | `/api/v1/complaints` | List complaints (filterable by status, category, severity, department + paginated) |
| `GET`  | `/api/v1/complaints/{id}` | Get a single complaint |
| `PATCH` | `/api/v1/complaints/{id}` | Update status / officer notes / department |
| `GET`  | `/api/v1/dashboard` | Admin aggregate stats (totals, breakdowns, 7-day trend) |
| `GET`  | `/api/v1/heatmap` | Geo-located points for map rendering |
| `GET`  | `/api/v1/health` | Health check |

### Legacy Endpoints (backward-compatible)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/analysis/image` | Legacy image analysis via multipart upload |
| `POST` | `/api/v1/reports` | Legacy report creation (base64) |
| `GET`  | `/api/v1/reports` | Legacy list reports |
| `GET`  | `/api/v1/reports/{id}` | Legacy get report |
| `PATCH` | `/api/v1/reports/{id}/status` | Legacy status update |

Full interactive docs: **`http://localhost:8000/docs`**

---

## 📸 Supported Issue Categories

| Category | Department | Severity Default |
|---|---|---|
| Pothole | Road Works | High |
| Garbage | Sanitation | Medium |
| Streetlight | Electricity | Medium |
| Water Leakage | Water Supply | High |
| Illegal Parking | Enforcement | Medium |
| Broken Road | Public Works | High |
| Traffic Signal | Traffic | Critical |
| Open Drain | Public Works | High |
| Construction Waste | Sanitation | Medium |
| Fallen Tree | Parks & Trees | High |

---

## 🎨 UI Design System

- **Font**: System sans-serif stack via Tailwind defaults
- **Color palette**: Background `Slate-50 / Gray-50` · Cards `White` · Primary Blue `#2563EB` · Success Emerald `#10B981` · Warning Amber `#F59E0B` · Danger Rose `#F43F5E`
- **Map**: Leaflet with OpenStreetMap tiles — zero API key cost
- **Premium Components**: `AnimatedCounter` stats, `ComplaintStatusTimeline`, `NearbyIssuesMap`, progress heatmap, category badge system
- **Animations**: Framer Motion `motion.div` grid tiles, staggered entrance effects, hover states on cards

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT — feel free to use this as a starting point for your own civic tech projects.

---

> Built with ❤️ for the CivicAI Hackathon · Powered by Google Gemini · Mapped with Leaflet + OpenStreetMap
