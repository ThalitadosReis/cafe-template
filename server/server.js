import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { cloneDefaultMenu } from "../src/data/defaultMenu.js";
import {
  buildContactMailOptions,
  getTransporter,
  logTransportPreview,
  validateContactPayload,
} from "./contact-mail.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "boldbrew";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "menus";
const MENU_DOCUMENT_ID = "main";

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

let menuCollection = null;

async function connectToMongo() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    menuCollection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
    console.log(`MongoDB connected: ${MONGODB_DB}.${MONGODB_COLLECTION}`);
  } catch (err) {
    console.error(
      "MongoDB connection failed. Falling back to default menu data.",
      err,
    );
  }
}

function isValidMenu(menu) {
  return Array.isArray(menu) && menu.length > 0;
}

async function readMenu() {
  if (!menuCollection) throw new Error("MongoDB is not connected");

  const doc = await menuCollection.findOne({ _id: MENU_DOCUMENT_ID });
  if (!doc?.menu || !isValidMenu(doc.menu)) {
    const menu = cloneDefaultMenu();
    await menuCollection.updateOne(
      { _id: MENU_DOCUMENT_ID },
      { $set: { menu, updatedAt: new Date() } },
      { upsert: true },
    );
    return menu;
  }

  return doc.menu;
}

async function writeMenu(menu) {
  if (!isValidMenu(menu)) {
    throw new Error("Invalid menu payload");
  }

  if (!menuCollection) throw new Error("MongoDB is not connected");

  await menuCollection.updateOne(
    { _id: MENU_DOCUMENT_ID },
    { $set: { menu, updatedAt: new Date() } },
    { upsert: true },
  );

  return menu;
}

// ── Contact form endpoint ───────────────────────────────
app.get("/api/menu", async (_req, res) => {
  try {
    const menu = await readMenu();
    res.json({ ok: true, menu });
  } catch (err) {
    console.error("Menu load error:", err);
    res.status(500).json({ error: "Failed to load menu" });
  }
});

app.put("/api/menu", async (req, res) => {
  const { menu } = req.body;

  if (!isValidMenu(menu)) {
    return res.status(400).json({ error: "Invalid menu payload" });
  }

  try {
    const savedMenu = await writeMenu(menu);
    res.json({ ok: true, menu: savedMenu });
  } catch (err) {
    console.error("Menu save error:", err);
    res.status(500).json({ error: "Failed to save menu" });
  }
});

app.post("/api/contact", async (req, res) => {
  const validation = validateContactPayload(req.body);
  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(
      buildContactMailOptions(validation.data),
    );
    logTransportPreview(info, "Mail preview");

    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ── Health check ────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ───────────────────────────────────────────────
Promise.all([getTransporter(), connectToMongo()]).then(() => {
  app.listen(PORT, () => {
    console.log(`🌿  BoldBrew backend listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Server startup failed:", err);
  process.exit(1);
});
