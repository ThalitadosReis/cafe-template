import {
  buildContactMailOptions,
  getTransporter,
  logTransportPreview,
  validateContactPayload,
} from "./_shared-email.js";
import { json, parseBody } from "./_shared-http.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const validation = validateContactPayload(parseBody(event.body));
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
  } catch (err) {
    console.error("Netlify contact error:", err);
    return json(500, { error: "Failed to send email" });
  }
};
