const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailCssPath = path.join(__dirname, "../../server/emails.css");
const emailCss = fs.existsSync(emailCssPath)
  ? fs.readFileSync(emailCssPath, "utf8")
  : "";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
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

function buildContactMailOptions({ name, email, subject, message }) {
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
          <div class="email-message-body">${String(message).replace(/\n/g, "<br>")}</div>
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

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpUser || !smtpPass) {
    console.error("Missing SMTP credentials. Set SMTP_USER and SMTP_PASS.");
    return json(500, { error: "Missing SMTP credentials" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const { name, email, subject, message } = payload;

  if (!name || !email || !message) {
    return json(400, { error: "Missing required fields" });
  }

  if (!CONTACT_EMAIL_REGEX.test(email)) {
    return json(400, { error: "Invalid email address" });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    const info = await transporter.sendMail(
      buildContactMailOptions({ name, email, subject, message }),
    );

    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log(`Contact preview: ${preview}`);
    }

    return json(200, { ok: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email error:", error);
    return json(500, { error: "Failed to send email" });
  }
};
