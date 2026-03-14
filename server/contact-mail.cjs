const nodemailer = require("nodemailer");
const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function getTransporter() {
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpUser || !smtpPass) {
    throw new Error("Missing SMTP credentials");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function validateContactPayload(payload) {
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

function buildContactMailOptions({ name, email, subject, message }) {
  const shellStyle = "width:100%;padding:32px 16px;background:#f5f3ef;";
  const cardStyle =
    "max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8e3db;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(24,24,24,0.04);";
  const heroStyle =
    "padding:32px 32px 24px;background:#ffffff;border-bottom:1px solid #ece7e0;";
  const kickerStyle =
    "margin:0 0 12px;color:#8a8178;font-size:11px;font-weight:600;line-height:1;letter-spacing:0.18em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const titleStyle =
    "margin:0;color:#181818;font-size:30px;font-weight:600;line-height:1.12;letter-spacing:-0.03em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const introStyle =
    "margin:12px 0 0;max-width:480px;color:#6f6a64;font-size:14px;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const panelStyle =
    "margin:24px 28px 0;padding:10px 20px;background:#faf8f5;border:1px solid #ece7e0;border-radius:14px;";
  const rowStyle =
    "width:100%;margin:0;padding:14px 0;border-bottom:1px solid #ece7e0;font-size:0;";
  const lastRowStyle = `${rowStyle}border-bottom:0;`;
  const labelStyle =
    "display:inline-block;vertical-align:top;width:110px;color:#8a8178;font-size:10px;font-weight:700;line-height:1.6;letter-spacing:0.14em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const valueStyle =
    "display:inline-block;vertical-align:top;width:calc(100% - 110px);color:#222222;font-size:14px;font-weight:500;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const messageWrapStyle = "padding:24px 28px 0;";
  const sectionTitleStyle =
    "margin:0 0 10px;color:#8a8178;font-size:10px;font-weight:700;line-height:1;letter-spacing:0.14em;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const messageBodyStyle =
    "padding:18px 20px;background:#faf8f5;border:1px solid #ece7e0;border-radius:14px;color:#272727;font-size:14px;line-height:1.8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const footnoteStyle =
    "margin:22px 28px 30px;color:#9a9289;font-size:12px;line-height:1.6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;";
  const linkStyle = "color:#1f1f1f;text-decoration:none;";

  const emailContent = `
    <div class="email-shell" style="${shellStyle}">
      <div class="email-card" style="${cardStyle}">
        <div class="email-hero" style="${heroStyle}">
          <p class="email-kicker" style="${kickerStyle}">BoldBrew Contact</p>
          <h1 class="email-title" style="${titleStyle}">New Message Received</h1>
          <p class="email-intro" style="${introStyle}">
            A new message was submitted through the website contact form.
          </p>
        </div>

        <div class="email-panel" style="${panelStyle}">
          <div class="email-row" style="${rowStyle}">
            <span class="email-label" style="${labelStyle}">Name</span>
            <span class="email-value" style="${valueStyle}">${name}</span>
          </div>
          <div class="email-row" style="${subject ? rowStyle : lastRowStyle}">
            <span class="email-label" style="${labelStyle}">Email</span>
            <span class="email-value" style="${valueStyle}"><a href="mailto:${email}" style="${linkStyle}">${email}</a></span>
          </div>
          ${
            subject
              ? `<div class="email-row" style="${lastRowStyle}">
            <span class="email-label" style="${labelStyle}">Subject</span>
            <span class="email-value" style="${valueStyle}">${subject}</span>
          </div>`
              : ""
          }
        </div>

        <div class="email-message" style="${messageWrapStyle}">
          <p class="email-section-title" style="${sectionTitleStyle}">Message</p>
          <div class="email-message-body" style="${messageBodyStyle}">${String(message).replace(/\n/g, "<br>")}</div>
        </div>

        <p class="email-footnote" style="${footnoteStyle}">Sent via the contact form at boldbrew.ch</p>
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

function logTransportPreview(info, prefix = "Contact preview") {
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
      </head>
      <body>${content}</body>
    </html>
  `.trim();
}

module.exports = {
  buildContactMailOptions,
  getTransporter,
  logTransportPreview,
  validateContactPayload,
};
