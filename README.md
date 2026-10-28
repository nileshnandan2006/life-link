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
