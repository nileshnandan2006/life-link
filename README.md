# 🩸 LifeLink – Emergency Blood Donation Service

> **"Find Blood. Find Hope. Save a Life."**  
> A modern, responsive, healthcare-focused emergency blood donation platform designed to quickly connect patients or hospital attendants in urgent need with eligible, verified blood donors in their immediate vicinity.

---

## 📁 Repository Architecture & Folder Setup

```
liife-link/
├── frontend/                  # Modern React + TypeScript + Vite + Tailwind CSS UI
│   ├── src/
│   │   ├── components/        # Reusable UI (Navbar, Footer, Wizard, Timelines, Modals)
│   │   ├── context/           # Reactive State & Auth Management
│   │   ├── data/              # Realistic Clinical Seed Data & Scenarios
│   │   ├── services/          # Firebase Auth Service (API Keys Loaded via Env)
│   │   ├── types/             # TypeScript Medical & User Interfaces
│   │   ├── utils/             # ABO/Rh Blood Compatibility Matrix & Haversine Distance
│   │   └── views/             # Landing, Dashboards, Directory, Live Map, Safety
│   ├── .env.example           # Frontend Environment Template (NO secrets committed)
│   ├── .gitignore             # Strictly ignores .env, node_modules, dist
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                   # Node.js + Express + TypeScript Emergency REST API
│   ├── src/
│   │   ├── routes/            # Blood Requests, Donors, Hospitals, Admin Routes
│   │   ├── utils/             # Compatibility logic & Distance helpers
│   │   └── server.ts          # Express API server entrypoint
│   ├── .env.example           # Backend Environment Template
│   ├── .gitignore             # Strictly ignores .env, node_modules, dist
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore                 # Root Security Exclusion (Blocks all .env files & secrets)
└── README.md                  # Project Documentation
```

---

## 🔒 Security & Environment Variables

For security compliance, **no sensitive API keys, service credentials, or `.env` files are pushed to GitHub**.

### 1. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Populate your Firebase configuration keys in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=series-942f9.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=series-942f9
   VITE_FIREBASE_STORAGE_BUCKET=series-942f9.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=459831912379
   VITE_FIREBASE_APP_ID=1:459831912379:web:13a11ec7d8ff8a6bf0869e
   VITE_FIREBASE_MEASUREMENT_ID=G-YTVT2G7XZQ
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Install dependencies and start development server:
   ```bash
   npm install
   npm run dev
   ```

### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies and start API service:
   ```bash
   npm install
   npm run dev
   ```

---

## 🚀 Cloud Deployment Guides

### 🌐 Frontend Deployment on Netlify
The repository is pre-configured with `netlify.toml` and `_redirects` for single-page application (SPA) routing.

1. Log into **[Netlify](https://app.netlify.com/)** and click **"Add new site" $\rightarrow$ "Import an existing project"**.
2. Connect **GitHub** and select your repository: `nileshnandan2006/life-link`.
3. Configure the build settings (automatically detected from `netlify.toml`):
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Under **Site configuration > Environment variables**, add your frontend variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_API_BASE_URL` (set to your deployed Render backend URL, e.g. `https://lifelink-backend.onrender.com/api`)
5. Click **"Deploy site"**.

---

### ⚡ Backend Deployment on Render
The repository includes a ready-to-deploy `render.yaml` blueprint.

1. Log into **[Render](https://dashboard.render.com/)** and click **"New +" $\rightarrow$ "Web Service"**.
2. Connect your repository: `nileshnandan2006/life-link`.
3. Configure the service settings:
   - **Name**: `lifelink-backend-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CORS_ORIGIN`: `*` (or your Netlify site URL)
   - `MONGODB_URI`: `mongodb+srv://<db_username>:<db_password>@cluster0.ah2ztwo.mongodb.net/lifelink?retryWrites=true&w=majority&appName=Cluster0`
5. Click **"Create Web Service"**.
6. Render will automatically install dependencies, build TypeScript (`tsc`), connect to MongoDB Atlas, and start the service with live health checks at `/api/health`.

---

## 🩺 Core Healthcare Capabilities

### 1. Blood Requester / Patient Attendant
- **Rapid 4-Step Emergency Creation Wizard**: Patient details, ABO/Rh Blood Group selection, units needed, hospital location, and urgency priority (**Critical / Urgent / Normal**).
- **Automated Compatibility Matching**: Scans compatible donor pools (e.g., $O^-$ universal donor matching, exact ABO matches).
- **Real-Time Request Timeline**: `Request Created` → `Searching for Donors` → `Donor Responded` → `Donation Coordinated` → `Request Fulfilled`.

### 2. Blood Donor
- **Live Availability Controller**: Switch between **Available Now**, **Emergencies Only**, or **Temporarily Unavailable**.
- **Proximity Radar Map**: Interactive GIS radar with distance rings (2 km, 5 km, 10 km) and privacy-fuzzed donor circles (exact residential addresses are never exposed).
- **Verified Donation Badges & History**: Hospital-authenticated donation certificates and lives impacted counter.

### 3. Administrator & Medical Governance
- **Command Center**: Real-time KPI analytics (Active, Fulfilled, Critical).
- **Abuse & Commercialization Moderation**: Strictly enforces non-remunerated voluntary donation principles with one-click suspension of abusive accounts.

---

## ⚖️ Medical & Clinical Disclaimer
LifeLink is a volunteer communication and coordination software tool. LifeLink does **not** perform medical diagnosis, laboratory compatibility screening, clinical testing, or blood collection. All actual blood donations, serological disease screening, ABO/Rh cross-matching, and transfusions must be executed and approved exclusively by licensed hospital blood banks and certified medical practitioners.
