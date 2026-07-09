# CivicAI 🌆

> **AI-powered civic issue reporting platform** — citizens report potholes, garbage, broken lights, and more. Gemini Vision analyzes each photo, auto-generates professional complaints, routes them to the right municipal department, and displays everything on a Google Maps heatmap.

---

## ✨ Features

| Area | Highlights |
|---|---|
| 📸 **Image Analysis** | Gemini Vision detects issue category, severity, confidence, and department |
| 📝 **Complaint Generation** | AI writes a professional complaint text from the photo |
| 📍 **Geo-tagging** | Browser geolocation attaches GPS coordinates to every report |
| 🗺️ **Interactive Maps** | Google Maps with markers, clustering, and heatmap layer |
| 📊 **Admin Dashboard** | Municipal officers see metrics, charts, filters, and the full complaint queue |
| 🔔 **Toast Notifications** | Real-time feedback on submit, error, and success events |
| 🌙 **Dark-first UI** | Glassmorphism, smooth animations, premium SaaS aesthetics |

---

## 🏗️ Tech Stack

### Frontend
| Tech | Version |
|---|---|
| React | 19 |
| Vite | 6 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| react-hook-form | 7 |
| lucide-react | latest |
| @vis.gl/react-google-maps | latest |
| axios | 1 |

### Backend
| Tech | Notes |
|---|---|
| FastAPI | Python 3.11+ |
| Pydantic v2 | Request/response validation |
| Google Gemini API | `gemini-2.0-flash` model for image analysis |
| Supabase | PostgreSQL + Auth + Storage |
| python-multipart | File upload support |
| uvicorn | ASGI server |

---

## 📁 Project Structure

```
CivicAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminMetrics, ComplaintTable, ChartPanel, …
│   │   │   ├── common/         # Toast, Skeleton, Badge, EmptyState
│   │   │   ├── dashboard/      # StatisticsCards, RecentComplaints, Timeline, …
│   │   │   ├── forms/          # UploadDropzone, LocationCard, AnalysisPanel, …
│   │   │   ├── layout/         # AppHeader
│   │   │   └── maps/           # MapLoader, MapMarkerLayer, MapHeatmapLayer
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboardPage
│   │   │   └── citizen/        # CitizenDashboardPage, ReportIssuePage, AIAnalysisPage
│   │   ├── services/           # reportApi.ts, googleMaps/
│   │   ├── types/              # analysis.ts, report.ts, dashboard.ts, adminDashboard.ts
│   │   └── utils/              # image.ts
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── backend/
    └── app/
        ├── api/v1/
        │   ├── endpoints/       # analyze.py, complaints.py, dashboard.py, heatmap.py
        │   └── dependencies.py
        ├── models/              # complaint.py, enums.py
        ├── repositories/        # report_repository.py
        ├── schemas/             # report.py, analysis.py, dashboard.py
        ├── services/            # report_service.py, issue_analyzer.py, image_analysis_service.py
        └── main.py
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- A Google Gemini API key
- A Supabase project

---

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
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
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

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/analyze` | Analyze image with Gemini Vision |
| `POST` | `/api/v1/complaints` | Submit a new complaint |
| `GET`  | `/api/v1/complaints` | List complaints (filterable + paginated) |
| `GET`  | `/api/v1/complaints/{id}` | Get a single complaint |
| `PATCH` | `/api/v1/complaints/{id}` | Update status / officer notes |
| `GET`  | `/api/v1/dashboard` | Admin aggregate stats |
| `GET`  | `/api/v1/heatmap` | Geo-located points for map |
| `GET`  | `/api/v1/health` | Health check |

Full interactive docs: **`http://localhost:8000/docs`**

---

## 📸 Supported Issue Categories

| Category | Department |
|---|---|
| Pothole | Road Works |
| Garbage | Sanitation |
| Streetlight | Electricity |
| Water Leakage | Water Supply |
| Illegal Parking | Enforcement |
| Broken Road | Road Works |
| Traffic Signal | Traffic |
| Open Drain | Public Works |
| Construction Waste | Public Works |
| Fallen Tree | Parks & Trees |

---

## 🎨 UI Design System

- **Font**: Inter (Geometric sans-serif optimized for screen legibility)
- **Color palette**: Background `Slate-50 (#F5F7FA)` · Cards `White (#FFFFFF)` · Primary Blue `#2563EB` · Success Green `#16A34A` · Warning Amber `#F59E0B` · Danger Red `#DC2626`
- **Premium Components**: Reusable `AnimatedCounter` statistics, step-by-step progressive AI checkloader, ChatGPT-style chatbot responses with SVG confidence rings, and official receipt verification templates
- **Animations**: Framer-motion rise-in grid tiles, progressive checklist checking, character-by-character typing logs, and custom-defined skeleton shimmer bars

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

> Built with ❤️ for the CivicAI Hackathon · Powered by Google Gemini · Mapped with Google Maps
