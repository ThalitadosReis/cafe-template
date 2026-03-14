import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cloneDefaultMenu } from "../../src/data/defaultMenu.js";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "boldbrew";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "menus";
const MENU_DOCUMENT_ID = "main";

let transporterPromise;
let menuCollectionPromise;
const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMAIL_CSS_PATH = path.resolve(__dirname, "../../server/emails.css");
const emailCss = fs.existsSync(EMAIL_CSS_PATH)
  ? fs.readFileSync(EMAIL_CSS_PATH, "utf8")
  : "";

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function parseBody(body) {
  if (!body) return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

export function isValidMenu(menu) {
  return Array.isArray(menu);
}

export async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }

      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    })();
  }

  return transporterPromise;
}

export function validateContactPayload(payload) {
  const { name, email, subject, message } = payload;

  if (!name || !email || !message) {
    return { error: "Missing required fields" };
  }

  if (!CONTACT_EMAIL_REGEX.test(email)) {
    return { error: "Invalid email address" };
  }

  return {
    data: {
      name,
      email,
      subject,
      message,
    },
  };
}

export function buildContactMailOptions({ name, email, subject, message }) {
  const emailContent = `
    <div class="email-shell">
      <div class="email-card">
        <div class="email-hero">
          <p class="email-kicker">BoldBrew Contact</p>
          <h1 class="email-title">New Message Received</h1>
          <p class="email-intro">
            A new message was submitted through the website contact form.
          </p>
        </div>

        <div class="email-panel">
          <div class="email-row">
            <span class="email-label">Name</span>
            <span class="email-value">${name}</span>
          </div>
          <div class="email-row">
            <span class="email-label">Email</span>
            <span class="email-value"><a href="mailto:${email}">${email}</a></span>
          </div>
          ${
            subject
              ? `<div class="email-row">
            <span class="email-label">Subject</span>
            <span class="email-value">${subject}</span>
          </div>`
              : ""
          }
        </div>

        <div class="email-message">
          <p class="email-section-title">Message</p>
          <div class="email-message-body">${message.replace(/\n/g, "<br>")}</div>
        </div>

        <p class="email-footnote">Sent via the contact form at boldbrew.ch</p>
      </div>
    </div>
  `;

  return {
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
    html: renderEmailHtml(emailContent),
  };
}

export function logTransportPreview(info, prefix = "Contact preview") {
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) {
    console.log(`${prefix}: ${preview}`);
  }
}

function renderEmailHtml(content) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${emailCss}</style>
      </head>
      <body>${content}</body>
    </html>
  `.trim();
}

export async function getMenuCollection() {
  if (!MONGODB_URI) {
    return null;
  }

  if (!menuCollectionPromise) {
    menuCollectionPromise = (async () => {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      return client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
    })().catch((err) => {
      menuCollectionPromise = null;
      throw err;
    });
  }

  return menuCollectionPromise;
}

export async function readMenu() {
  const collection = await getMenuCollection();
  if (!collection) {
    return cloneDefaultMenu();
  }

  const doc = await collection.findOne({ _id: MENU_DOCUMENT_ID });
  if (!doc?.menu || !isValidMenu(doc.menu)) {
    const menu = cloneDefaultMenu();
    await collection.updateOne(
      { _id: MENU_DOCUMENT_ID },
      { $set: { menu, updatedAt: new Date() } },
      { upsert: true },
    );
    return menu;
  }

  return doc.menu;
}

export async function writeMenu(menu) {
  if (!isValidMenu(menu)) {
    throw new Error("Invalid menu payload");
  }

  const collection = await getMenuCollection();
  if (!collection) {
    return menu;
  }

  await collection.updateOne(
    { _id: MENU_DOCUMENT_ID },
    { $set: { menu, updatedAt: new Date() } },
    { upsert: true },
  );

  return menu;
}
