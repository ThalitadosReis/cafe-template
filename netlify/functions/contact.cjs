const nodemailer = require("nodemailer");
const {
  buildContactMailOptions,
  validateContactPayload,
  logTransportPreview,
} = require("../../server/contact-mail.cjs");

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
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

  const validation = validateContactPayload(payload);
  if (validation.error) {
    return json(400, { error: validation.error });
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
      buildContactMailOptions(validation.data),
    );
    logTransportPreview(info);

    return json(200, { ok: true, messageId: info.messageId });
  } catch (error) {
    console.error("Email error:", error);
    return json(500, { error: "Failed to send email" });
  }
};
