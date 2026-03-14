import { isValidMenu, json, parseBody, readMenu, writeMenu } from "./_shared.js";

export const handler = async (event) => {
  if (event.httpMethod === "GET") {
    try {
      const menu = await readMenu();
      return json(200, { ok: true, menu });
    } catch (err) {
      console.error("Netlify menu load error:", err);
      return json(500, { error: "Failed to load menu" });
    }
  }

  if (event.httpMethod === "PUT") {
    const { menu } = parseBody(event.body);

    if (!isValidMenu(menu)) {
      return json(400, { error: "Invalid menu payload" });
    }

    try {
      const savedMenu = await writeMenu(menu);
      return json(200, { ok: true, menu: savedMenu });
    } catch (err) {
      console.error("Netlify menu save error:", err);
      return json(500, { error: "Failed to save menu" });
    }
  }

  return json(405, { error: "Method not allowed" });
};
