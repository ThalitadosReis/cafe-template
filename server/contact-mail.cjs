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
  // brand palette
  const C = {
    bg: "#faf8f4",
    card: "#ffffff",
    border: "#e8ded4",
    divider: "#ede6db",
    espresso: "#3c2e22",
    dark: "#5b4a3e",
    mid: "#8a8077",
    light: "#cbbfaf",
    muted: "#f6f2eb",
  };

  const sans = "Georgia,'Times New Roman',serif";
  const ui = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

  const emailContent = `
  <div style="width:100%;background:${C.bg};padding:40px 16px;font-family:${ui};">
    <div style="max-width:600px;margin:0 auto;">

      <!-- header bar -->
      <div style="padding:0 0 24px 0;">
        <p style="margin:0;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${C.mid};font-family:${ui};">
          BoldBrew · Café &amp; More
        </p>
      </div>

      <!-- card -->
      <div style="background:${C.card};border:1px solid ${C.border};">

        <!-- hero -->
        <div style="padding:40px 40px 32px;border-bottom:1px solid ${C.divider};">
          <h1 style="margin:0 0 10px;font-family:${sans};font-size:34px;font-weight:400;font-style:italic;line-height:1.12;color:${C.espresso};">
            New message
          </h1>
          <p style="margin:0;font-size:13px;line-height:1.7;color:${C.mid};font-family:${ui};">
            Submitted via the contact form on boldbrew.ch
          </p>
        </div>

        <!-- sender details -->
        <div style="padding:32px 40px 0;">
          <p style="margin:0 0 16px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:${C.light};font-family:${ui};">
            Sender
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid ${C.divider};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.mid};font-family:${ui};width:90px;vertical-align:top;">
                Name
              </td>
              <td style="padding:12px 0 12px 16px;border-bottom:1px solid ${C.divider};font-size:14px;color:${C.espresso};font-family:${ui};vertical-align:top;">
                ${name}
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid ${subject ? C.divider : "transparent"};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.mid};font-family:${ui};width:90px;vertical-align:top;">
                Email
              </td>
              <td style="padding:12px 0 12px 16px;border-bottom:1px solid ${subject ? C.divider : "transparent"};font-size:14px;font-family:${ui};vertical-align:top;">
                <a href="mailto:${email}" style="color:${C.dark};text-decoration:none;">${email}</a>
              </td>
            </tr>
            ${
              subject
                ? `
            <tr>
              <td style="padding:12px 0;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${C.mid};font-family:${ui};width:90px;vertical-align:top;">
                Subject
              </td>
              <td style="padding:12px 0 12px 16px;font-size:14px;color:${C.espresso};font-family:${ui};vertical-align:top;">
                ${subject}
              </td>
            </tr>`
                : ""
            }
          </table>
        </div>

        <!-- message -->
        <div style="padding:32px 40px 40px;">
          <p style="margin:0 0 16px;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:${C.light};font-family:${ui};">
            Message
          </p>
          <div style="background:${C.muted};border-left:2px solid ${C.border};padding:20px 24px;">
            <p style="margin:0;font-family:${sans};font-size:15px;font-style:italic;line-height:1.8;color:${C.dark};">
              ${String(message).replace(/\n/g, "<br>")}
            </p>
          </div>
        </div>

        <!-- reply CTA -->
        <div style="padding:0 40px 40px;">
          <a href="mailto:${email}" style="display:inline-block;background:${C.espresso};color:#faf8f4;font-family:${ui};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;text-decoration:none;padding:12px 24px;">
            Reply to ${name}
          </a>
        </div>

      </div>

      <!-- footer -->
      <div style="padding:24px 0 0;text-align:left;">
        <p style="margin:0;font-size:11px;color:${C.light};font-family:${ui};line-height:1.6;">
          BoldBrew · Bahnhofstrasse 12, 8001 Zurich · hello@boldbrew.ch
        </p>
      </div>

    </div>
  </div>`;

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
