# Pose Navigator

**The pose is the beginning, not the point.**

A navigable graph of yoga poses. Every pose connects to what prepares you for it, what sits alongside it, and what it unlocks next — with a written explanation for each connection.

Live at **[posenavigator.com](https://posenavigator.com)**

---

## What it is

Most pose resources give you a bullet list or a video to follow. Pose Navigator treats each pose as a node in a graph. The edges — the relationships between poses — are the real product. Each one is hand-written, explaining *why* the connection exists, not just that it does.

From any pose you can navigate to:
- ↑ **Prepares You** — poses to practice before this one
- ↔ **Alongside It** — complementary poses that work the same territory differently
- ↓ **What It Unlocks** — poses this one builds toward

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, React Router |
| Backend (local) | Node.js + Express |
| Backend (production) | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Image storage | Supabase Storage |
| Hosting | Vercel |

---

## Project structure

```
pose-navigator/
├── api/                        # Vercel serverless functions (production)
│   └── poses/
│       ├── index.js            # GET /api/poses — all poses
│       └── [id].js             # GET /api/poses/:id — single pose + relationships
├── client/                     # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx        # Pose grid at /explore
│       │   ├── PoseNavigator.jsx  # Three-column navigator at /poses/:id
│       │   └── *.css
│       └── App.jsx
├── server/                     # Local Express server (dev only)
│   ├── index.js
│   ├── routes/poses.js
│   └── *.js                    # One-off data scripts (insert, fix edges, etc.)
├── setup.sql                   # Database schema
└── vercel.json                 # Build config + API rewrites
```

---

## Database schema

Two tables in Supabase:

**`poses`**
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| slug | text | URL-safe identifier (e.g. `pigeon-pose`) |
| name | text | Display name |
| sanskrit | text | Sanskrit name |
| body_areas | text[] | e.g. `["hips", "hamstrings"]` |
| flags | text[] | Caution/contraindication notes |
| image_url | text | Supabase Storage public URL |

**`pose_relationships`**
| Column | Type | Notes |
|---|---|---|
| from_pose_id | uuid | The pose you are on |
| to_pose_id | uuid | The related pose |
| relationship | enum | `prepares` / `complements` / `unlocks` |
| explanation | text | Written explanation of the connection |

Unique constraint on `(from_pose_id, to_pose_id, relationship)`.

---

## Running locally

### 1. Clone and install

```bash
git clone https://github.com/suba-learning/pose-navigator.git
cd pose-navigator

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Set environment variables

Create `server/.env`:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
```

> The service role key bypasses Row Level Security — keep it server-side only, never in the browser or committed to git.

### 3. Start the dev server

In one terminal:
```bash
cd server && npm run dev
```

In another terminal:
```bash
cd client && npm run dev
```

The app runs at `http://localhost:5173`. The React dev server proxies `/api/*` requests to the Express server on port 3001.

---

## Deployment

The app is deployed on Vercel. The `api/` folder is served as serverless functions. Environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) are set in the Vercel dashboard under Settings → Environment Variables — they are never stored in the repository.

```bash
# Deploy (requires Vercel CLI)
vercel --prod
```

---

## Content

The v1 graph contains **50 poses** and **298 hand-curated relationships**. Data scripts in `server/` were used to seed and maintain the database — they are kept in the repo as a record of what was built and when.

New relationships can be added directly in the Supabase table editor, or by writing a small script following the pattern in `server/fix-bridge-complements.js`.
