# AgriChain / FarmTrace

A full‑stack agriculture supply chain transparency platform that combines:

- A **Next.js** frontend (FarmTrace) with role‑based dashboards for farmers, distributors, retailers, and consumers.
- A **FastAPI** backend (AgriChain) providing APIs for supply chain data, alerts, blockchain provenance, and AI assistant / RAG features.

> Codebase currently lives in a single repository with both frontend and backend under the same project.

---

## ✨ Features

- **Role‑based portals**
  - **Farmer**: create and manage harvest batches, track quality and payments.
  - **Distributor**: manage logistics, pickups, and transit updates.
  - **Retailer**: manage incoming batches, prices, and discounts.
  - **Consumer**: explore products and view provenance with transparent pricing.

- **Supply chain transparency**
  - End‑to‑end batch tracking from farm to retailer.
  - Blockchain ledger view (`/blockchain` in the UI) using on‑chain data (`agrichain_abi.json`).

- **AI & RAG assistant**
  - Research‑augmented answers based on domain papers/documents.
  - Chat/assistant endpoints exposed via FastAPI (`chat`, `ai_assistant` routers).

- **Modern UI**
  - Next.js App Router.
  - Tailwind CSS with shadcn/Radix UI components.
  - Responsive dashboard layout for all roles.

---

## 🧱 Tech Stack

### Frontend

- **Framework**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, `tailwindcss-animate`, `tw-animate-css`
- **UI Components**:
  - Radix UI (`@radix-ui/react-*`)
  - shadcn‑style component set (`components/ui`)
  - `lucide-react` icons
- **Forms & Validation**:
  - `react-hook-form`
  - `zod` + `@hookform/resolvers`
- **Other**:
  - `recharts`, `react-resizable-panels`, `react-day-picker`, `embla-carousel-react`
  - `sonner` for toasts
  - `@vercel/analytics` for basic analytics

### Backend

- **Framework**: FastAPI
- **DB & Models**:
  - `database.py` and `db_models.py` for DB connection & ORM models
  - `models/` and `repositories/` for Pydantic schemas and data access logic
- **Routers / Domains**:
  - `auth`, `farmer`, `distributor`, `retailer`, `consumer`, `alerts`, `chat`, `ai_assistant`
- **AI / RAG**:
  - `rag/`, `chroma_db/`, `research_papers/`, `ingest_papers.py`
- **Security & Config**:
  - `config.py`, `security.py`, `settings/`

---

## 📁 Project Structure

High‑level layout:

```text
.
├── app/                     # Next.js app router + FastAPI backend
│   ├── layout.tsx           # Root layout (Next.js)
│   ├── page.tsx             # Landing page (Next.js)
│   ├── globals.css          # Global styles
│   ├── main.py              # FastAPI entrypoint
│   ├── database.py          # DB connection
│   ├── db_models.py         # ORM models
│   ├── models/              # Pydantic schema models
│   ├── repositories/        # Data access / repository layer
│   ├── routers/             # FastAPI routers (auth, farmer, etc.)
│   ├── rag/                 # RAG/AI utilities
│   ├── settings/            # App / environment settings
│   ├── blockchain.py        # Blockchain integration helpers
│   └── agrichain_abi.json   # Smart contract ABI
│
├── components/
│   ├── dashboard-layout.tsx # Role-based dashboard shell
│   ├── stat-card.tsx        # Dashboard stat card
│   ├── theme-provider.tsx   # Theme provider
│   └── ui/                  # shadcn/Radix-style UI components
│
├── contexts/
│   └── auth-context.tsx     # Frontend auth context (mock login)
│
├── hooks/                   # Reusable frontend hooks
├── lib/
│   ├── auth-context.tsx     # Auth provider used in layout
│   ├── types.ts             # Shared TypeScript domain types
│   └── utils.ts             # Utility helpers (e.g. cn)
│
├── public/                  # Static assets
├── styles/                  # Additional styling
├── chroma_db/               # Local Chroma DB (RAG)
├── ingest_papers.py         # Ingestion script for research docs
├── ingest_log.txt           # Ingestion logs
├── research_papers/         # Source documents for RAG
│
├── package.json             # Node dependencies & scripts
├── pnpm-lock.yaml           # pnpm lockfile
├── requirements.txt         # Python dependencies
├── next.config.mjs          # Next.js config
├── postcss.config.mjs       # PostCSS config
├── tsconfig.json            # TypeScript config
└── .env                     # Environment variables (not committed)
```

---

## ✅ Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** (or npm/yarn, but scripts assume `pnpm`)
- **Python 3.10+** (for FastAPI backend)
- **Git**

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (if not already present).

Typical values you might need:

```env
# Database
DATABASE_URL=mysql+mysqlconnector://user:password@host:3306/db_name

# JWT / Auth
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS / Backend config
BACKEND_CORS_ORIGINS=["http://localhost:3000"]

# AI / RAG (example)
OPENAI_API_KEY=your-openai-key
CHROMA_DB_DIR=./chroma_db
```

> Adjust according to your actual configuration used in `config.py`, `settings/`, and `rag/`.

---

## 🖥️ Running the Frontend (Next.js)

Install Node dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

By default, the app will be available at:

- Frontend: `http://localhost:3000`

Useful scripts (from `package.json`):

```bash
pnpm dev       # Start Next.js in development mode
pnpm build     # Build for production
pnpm start     # Start production server (after build)
pnpm lint      # Run ESLint
```

---

## 🔧 Running the Backend (FastAPI)

> Backend code lives inside the `app/` directory but should be run as a separate Python service.

1. Create and activate a virtual environment (recommended):

```bash
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Run the FastAPI app with Uvicorn:

```bash
uvicorn app.main:app --reload
```

By default, the backend will be available at:

- API: `http://localhost:8000`
- API docs (Swagger UI): `http://localhost:8000/docs`

---

## 🔗 Frontend–Backend Integration

- The frontend can call the FastAPI backend using HTTP (e.g. `fetch` or `axios`) with base URL:
  - `http://localhost:8000` in development.
- Auth and domain‑specific endpoints are under routers like:
  - `/auth/*`
  - `/farmer/*`
  - `/distributor/*`
  - `/retailer/*`
  - `/consumer/*`
  - `/alerts/*`
  - `/chat/*`
  - `/ai-assistant/*` (exact paths depend on router implementations).

> At the moment, parts of the frontend use **mock auth** via `AuthProvider` and `localStorage`. These can be gradually migrated to use real backend auth.

---

## 🧪 Development Notes

- **TypeScript**  
  `next.config.mjs` currently has `typescript.ignoreBuildErrors: true`. For production, its recommended to:
  - Fix existing TS errors and
  - Remove `ignoreBuildErrors` so builds fail on type errors.

- **Auth**  
  - UI uses an `AuthProvider` that stores a mock `User` in `localStorage`.
  - A future iteration can replace this with real JWT-based auth from FastAPI.

- **Folder layout**  
  - Frontend and backend currently coexist in the same root/app directory.
  - A future improvement is to split into `/frontend` and `/backend` for cleaner deployment.

---

## 🚀 Deployment

Typical approach:

- **Frontend (Next.js)**:
  - Build with `pnpm build` and deploy to a Node/Next-capable host (or Vercel with some adjustments, noting backend is separate).

- **Backend (FastAPI)**:
  - Deploy with Uvicorn/Gunicorn + Nginx or inside a Docker container.
  - Expose your API base URL and configure CORS to allow requests from the frontend domain.

Make sure to:

- Set all environment variables on your deployment platform.
- Update frontend API base URL to point to the deployed backend.

---

## 📄 License

Specify your license here (e.g. MIT, Apache 2.0, proprietary).

```text
MIT License (c) 2025 YOUR NAME
```

---

## 🤝 Contributing

1. Fork the repo.
2. Create your feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

---

## 🧩 Contact

- GitHub: [@chethan-9242](https://github.com/chethan-9242)
- Project repo: https://github.com/chethan-9242/agri_backend
