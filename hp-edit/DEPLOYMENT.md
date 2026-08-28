# 🚀 HP Edit Enterprise — Production Deployment Guide

This guide covers everything needed to deploy **HP Edit Enterprise** in production.

---

## 1. Quick Start: 1-Command Docker Deployment

To launch the complete enterprise platform with Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/hp-edit/hp-edit-enterprise.git
cd hp-edit-enterprise

# 2. Launch container in detached mode
docker compose up -d --build

# 3. View live logs
docker compose logs -f
```

The application will be live at `http://localhost:3000`.

---

## 2. Deploying to Vercel (Recommended for Edge Speed)

1. Push your repository to **GitHub** / **GitLab**.
2. Go to [Vercel Dashboard](https://vercel.com) ➔ **Add New Project** ➔ Import `hp-edit-enterprise`.
3. Configure the following Environment Variables:
   - `DATABASE_URL`: `"file:./dev.db"` (or your production PostgreSQL connection string `postgres://user:pass@host:5432/db`)
   - `ADMIN_JWT_SECRET`: A secure 32+ character string (e.g. `your-super-secure-production-secret-key-2026`)
   - `GEMINI_API_KEY`: *(Optional)* Your free Google AI Studio Gemini API key for real-time chatbot RAG.
   - `META_WHATSAPP_TOKEN`: *(Optional)* Your Meta Cloud API access token for instant lead dispatch.
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js 15 application.

---

## 3. Deploying to VPS / Coolify / Railway / Render

### Using Docker on Ubuntu VPS:
```bash
# Install Docker & Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose

# Build and run container
sudo docker build -t hp-edit-enterprise:latest .
sudo docker run -d --name hp_edit -p 3000:3000 --restart unless-stopped hp-edit-enterprise:latest
```

---

## 4. Production Database Migrations & Seeding

```bash
# Push schema migrations
npx prisma db push

# Seed initial organization, services, case studies & demo client project
npx tsx prisma/seed.ts
```

---

## 5. Security & Access Checklists
- **Default Master Admin**:
  - URL: `http://localhost:3000/admin`
  - Master Username: `admin`
  - Master Password: `AdminPassword123!`
- **Portal Access**:
  - URL: `http://localhost:3000/portal`
  - Demo Project Code: `HPE-7849`
- **ROI Calculator**:
  - URL: `http://localhost:3000/roi`
- **Video Discovery Booking**:
  - URL: `http://localhost:3000/book`
