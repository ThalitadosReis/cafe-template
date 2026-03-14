# [Cafe Template](https://template-cafe.netlify.app/)

Modern cafe website template built with React, Vite, Tailwind CSS v4, Netlify Functions for production APIs, and an Express backend for local development.

## Stack

- React 18
- React Router 6
- Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Motion (`motion`)
- Phosphor Icons (`@phosphor-icons/react`)
- DnD Kit (`@dnd-kit/*`)
- Netlify Functions + Nodemailer (production email API)
- Express + Nodemailer (local development API)
- MongoDB (menu persistence)

## Run Locally

```bash
npm install
npm run dev         # frontend (Vite)
npm run dev:server  # backend email API (Express)
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

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

## Production

Production is configured for Netlify:

- static frontend from `dist`
- Netlify Functions for `/api/contact` and `/api/menu`
- MongoDB Atlas for menu persistence

Set these Netlify environment variables:

- `MONGODB_URI`
- `MONGODB_DB=boldbrew`
- `MONGODB_COLLECTION=menus`
- `SMTP_HOST`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`