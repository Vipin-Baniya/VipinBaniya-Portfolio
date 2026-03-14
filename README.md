# Structify — Where Systems Take Shape

A Spotify-inspired personal engineering identity platform. Show your projects (with live GitHub code explorer), achievements, certificates, and work experience. Manage everything from a private admin panel.

---

## ✅ Features

- **Spotify-style UI** — dark immersive layout with sidebar navigation
- **GitHub Code Explorer** — browse and view file contents of any linked GitHub repo
- **Projects** — full detail pages with file tree + Monaco code viewer
- **Achievements** — hackathons, awards, competitions with proof links
- **Certificates** — with image upload (Cloudinary) and verification links
- **Experience** — roles, impact metrics, technologies
- **Admin Panel** — full CRUD at `/admin` (protected with your email/password)
- **Free Deployment** — designed for Vercel + MongoDB Atlas (both free)

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://mongodb.com/atlas) account
- A free [Vercel](https://vercel.com) account

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `OWNER_ID` | Your identifier (e.g. `vipin`) |
| `ADMIN_EMAIL` | Your login email |
| `ADMIN_PASSWORD` | Your login password (plain text for simplicity) |
| `NEXTAUTH_SECRET` | Random string — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for dev |

**Optional (for image uploads):**

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub PAT for private repos / higher rate limits |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 How to Use

### As a Visitor
- Visit `/home` to browse the platform
- Click any project to view code in the GitHub explorer

### As Admin
1. Go to `/admin/login`
2. Login with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Manage everything from the dashboard

### Adding a Project
1. Go to `/admin/projects` → Add Project
2. Fill in title, description, GitHub owner/repo name
3. Toggle "Featured" to show on homepage
4. The code explorer will auto-fetch from GitHub

### Uploading Certificates
1. Go to `/admin/certificates` → Add Certificate
2. Upload an image OR paste an image URL
3. Add verification link if available

---

## 🌐 Deploy to Vercel (Free)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Structify setup"
git remote add origin https://github.com/yourusername/structify.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Add environment variables (same as `.env.local` but change `NEXTAUTH_URL` to your Vercel domain)
4. Deploy!

### 3. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster (M0 is free forever)
3. Create database user
4. Allow all IPs: `0.0.0.0/0` in Network Access
5. Copy connection string to `MONGODB_URI`

---

## 🎨 Customization

### Update your info
Edit these files to personalize:

- `src/app/about/page.tsx` — Your bio, philosophy
- `src/app/contact/page.tsx` — Your social links
- `src/components/layout/Sidebar.tsx` — "Architect: Vipin Baniya" footer

### Change accent color
In `src/app/globals.css`, change:
```css
--green: #1ED760;
```

### Change site name
In `src/app/layout.tsx` update the metadata title/description.

---

## 🏗 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Code Viewer**: Monaco Editor (@monaco-editor/react)
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Auth**: NextAuth.js (credentials provider)
- **Images**: Cloudinary (optional)
- **GitHub**: REST API for live repo sync

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public pages)
│   ├── admin/         # Protected admin panel
│   └── api/           # REST API routes
├── components/
│   ├── layout/        # Sidebar, PublicLayout
│   ├── public/        # HomeView, ProjectsView, etc.
│   └── admin/         # AdminSidebar, FormFields
├── lib/               # DB, GitHub, auth utils
├── models/            # Mongoose schemas
└── types/             # TypeScript interfaces
```

---

## 🤖 AI Code Explainer

Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-proj-your-key-here
```

Get a free key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). The explainer uses `gpt-4o-mini` — very cheap, works on free tier. You must be logged into the admin panel for the Explain button to appear (prevents public API key abuse).

## 🎯 Recruiter Mode

Go to `/admin/projects`, open any project, and toggle **Featured** on. Then visit `/projects` and click **Recruiter Mode** for a full-screen guided walkthrough with keyboard navigation (← →, Escape).

## 📊 Analytics

Available at `/admin/analytics` — views leaderboard, content distribution, and project status breakdown. No setup needed.

## 🌐 Public API

```
GET /api/v1/profile.json
```

Returns your entire profile as JSON — projects, skills, achievements, experience, posts, and stats. Public CORS, 5-min cache. No auth required.
