# Cafe Template

A modern cafe website template built with React, Vite, and Tailwind CSS. Ships a polished marketing site, a dynamic menu page backed by MongoDB, a contact flow for email inquiries, multilingual content, and an admin interface for editing menu sections and items.

## Live Preview
https://template-cafe.netlify.app/

## Tech Stack
- **Vite** · React · JavaScript
- **React Router** · Tailwind CSS
- **Motion** · Phosphor Icons · DnD Kit
- **MongoDB** menu persistence · **Nodemailer** contact email
- **Express** for local APIs · **Netlify Functions** for production APIs

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/menu` | Dynamic cafe menu loaded from the menu API |
| `/contact` | Contact page for customer inquiries |
| `/admin` | Menu editor with drag-and-drop reordering and reset/save controls |

## Admin & APIs
The template uses local and production APIs for menu management and contact handling.

- `GET /api/menu` loads the menu from MongoDB
- `PUT /api/menu` saves menu changes from the admin page
- `POST /api/contact` sends contact emails
- Local development uses `server/server.js`
- Production uses Netlify Functions in `netlify/functions/`

## Getting Started
```bash
npm install
npm run dev
npm run dev:server
```

## Environment Variables
Copy `.env.example` to `.env` and configure:

```env
MONGODB_URI=
MONGODB_DB=
MONGODB_COLLECTION=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL=
FRONTEND_URL=
FRONTEND_URLS=
PORT=3001
```

## Scripts
```bash
npm run dev         # local frontend dev server
npm run dev:server  # local Express API server
npm run build       # production build
npm run preview     # preview the production build
npm run start       # start the local Express server
npm run seed:menu   # seed MongoDB with the default menu
```

## Deployment
This project is configured for Netlify.

- `netlify/functions/menu.js` handles menu API requests
- `netlify/functions/contact.cjs` handles contact submissions
- MongoDB stores the editable menu data
