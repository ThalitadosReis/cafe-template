# Cafe Template

Modern cafe website template built with React, Vite, Tailwind CSS v4, and a small Express + Nodemailer backend for contact emails.

## Stack

- React 18
- React Router 6
- Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Motion (`motion`)
- Phosphor Icons (`@phosphor-icons/react`)
- DnD Kit (`@dnd-kit/*`)
- Express + Nodemailer (email API)

## Run Locally

```bash
npm install
npm run dev         # frontend (Vite)
npm run dev:server  # backend email API (Express)
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_EMAIL`
- `FRONTEND_URL`
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
- Menu seed/storage logic: `src/data/menu.js`

## Build

```bash
npm run build
npm run preview
```
