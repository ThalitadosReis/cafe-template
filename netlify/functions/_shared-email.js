import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMAIL_CSS_PATH = path.resolve(__dirname, "../../server/emails.css");
const emailCss = fs.existsSync(EMAIL_CSS_PATH)
  ? fs.readFileSync(EMAIL_CSS_PATH, "utf8")
  : "";

let transporterPromise;

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
