const {
  buildContactMailOptions,
  getTransporter,
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

  try {
    const transporter = await getTransporter();
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
