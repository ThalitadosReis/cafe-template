# [Cafe Template](https://template-cafe.netlify.app/)

Modern cafe website template built with React, Vite, Tailwind CSS v4, and an Express backend for contact emails plus MongoDB-backed menu persistence.

## Stack

- React 18
- React Router 6
- Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Motion (`motion`)
- Phosphor Icons (`@phosphor-icons/react`)
- DnD Kit (`@dnd-kit/*`)
- Express + Nodemailer (email API)
- MongoDB (menu persistence)

## Run Locally

```bash
npm install
npm run dev         # frontend (Vite)
npm run dev:server  # backend email API (Express)
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL` for the frontend in production
- `MONGODB_URI`
- `MONGODB_DB`
- `MONGODB_COLLECTION`

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`
- `FRONTEND_URL`
- `FRONTEND_URLS`
- `PORT`

### Gmail notes

If you use Gmail SMTP, use an App Password (requires 2FA). Regular account passwords will fail authentication.

## Routes

- `/` → `src/pages/Home.jsx`
- `/menu` → `src/pages/Menu.jsx`
- `/contact` → `src/pages/Contact.jsx`
- `/admin` → `src/pages/Admin.jsx`

## Content & Customization

- Navigation and section translations:
  - `src/i18n/translations/en.js`
  - `src/i18n/translations/de.js`
- Language provider: `src/i18n/LangContext.jsx`
- Global styles and tokens: `src/index.css`
- Main page content: files in `src/pages/`
- Footer contact/map: `src/components/Footer.jsx`
- Menu API/storage logic: `src/data/menu.js`
- Default menu seed: `src/data/defaultMenu.js`

## Build

```bash
npm run build
npm run preview
```

## Split Deployment

Recommended production setup:

- frontend on Netlify or Vercel
- backend `server/server.js` on Render or Railway
- MongoDB Atlas for the database

Frontend env:

- `VITE_API_BASE_URL=https://your-backend-domain`

Backend env:

- `FRONTEND_URL=https://your-frontend-domain`
- or `FRONTEND_URLS=https://your-frontend-domain,https://www.your-frontend-domain`

If `VITE_API_BASE_URL` is empty, the frontend falls back to same-origin `/api/...` requests for local development.

## Render Backend

This repo includes [render.yaml](/Users/thalitadosreis/Desktop/projects/cafe-template/render.yaml) for deploying the API on Render.

Use these settings:

- Root Directory: project root
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health`

Set these Render environment variables:

- `FRONTEND_URL=https://your-netlify-or-vercel-domain`
- `FRONTEND_URLS=https://your-netlify-or-vercel-domain,https://www.your-domain.com` if you need multiple origins
- `MONGODB_URI`
- `MONGODB_DB=boldbrew`
- `MONGODB_COLLECTION=menus`
- `SMTP_HOST`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`

Then set the frontend env on Netlify/Vercel:

- `VITE_API_BASE_URL=https://your-render-service.onrender.com`
