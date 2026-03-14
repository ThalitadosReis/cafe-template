import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { cloneDefaultMenu } from "./src/data/defaultMenu.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "boldbrew";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "menus";
const MENU_DOCUMENT_ID = "main";

// ── Middleware ──────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// ── Nodemailer transporter ──────────────────────────────
let transporter;
let menuCollection = null;

async function createTransporter() {
  if (process.env.SMTP_HOST) {
    // Production SMTP (e.g. Mailgun, SendGrid, Gmail, Infomaniak)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Dev: Ethereal fake SMTP (emails viewable at ethereal.email)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`📧  Ethereal test account: ${testAccount.user}`);
    console.log(`🔍  Preview emails at: https://ethereal.email`);
  }
}

async function connectToMongo() {
  if (!MONGODB_URI) {
    console.warn("MongoDB not configured. Falling back to default menu data.");
    return;
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
  return Array.isArray(menu);
}

async function readMenu() {
  if (!menuCollection) {
    return cloneDefaultMenu();
  }

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

  if (!menuCollection) {
    return menu;
  }

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
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"BoldBrew Website" <${process.env.SMTP_USER || "noreply@boldbrew.ch"}>`,
      to:
        process.env.CONTACT_EMAIL ||
        process.env.SALON_EMAIL ||
        "hello@boldbrew.ch",
      replyTo: `"${name}" <${email}>`,
      subject: subject
        ? `[BoldBrew Contact] ${subject}`
        : `[BoldBrew Contact] New message from ${name}`,
      text: `
Name:    ${name}
Email:   ${email}
Subject: ${subject || "—"}

Message:
${message}
      `.trim(),
      html: `
<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;background:#faf7f2;color:#3d2b1f">
  <div style="border-bottom:1px solid #e8dcc8;padding-bottom:16px;margin-bottom:24px">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8b6f47;margin:0">
      BoldBrew — New Contact Message
    </p>
  </div>
  <table style="width:100%;font-size:14px;color:#5c4033;margin-bottom:24px">
    <tr><td style="padding:6px 0;width:80px;color:#7a6a5a">Name</td><td><strong>${name}</strong></td></tr>
    <tr><td style="padding:6px 0;color:#7a6a5a">Email</td><td><a href="mailto:${email}" style="color:#8b6f47">${email}</a></td></tr>
    ${subject ? `<tr><td style="padding:6px 0;color:#7a6a5a">Subject</td><td>${subject}</td></tr>` : ""}
  </table>
  <div style="background:#f5f0e8;border-left:3px solid #8b6f47;padding:16px 20px;font-size:14px;line-height:1.7;color:#3d2b1f">
    ${message.replace(/\n/g, "<br>")}
  </div>
  <p style="font-size:11px;color:#b8a896;margin-top:24px">
    Sent via the contact form at boldbrew.ch
  </p>
</div>
      `.trim(),
    });

    // Log preview URL for dev (Ethereal)
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log(`📬  Preview: ${preview}`);

    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// ── Health check ────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ───────────────────────────────────────────────
Promise.all([createTransporter(), connectToMongo()]).then(() => {
  app.listen(PORT, () => {
    console.log(`🌿  BoldBrew backend listening on http://localhost:${PORT}`);
  });
});
