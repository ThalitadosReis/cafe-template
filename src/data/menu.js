import { cloneDefaultMenu, defaultMenu } from "./defaultMenu.js";

const MENU_API_PATH = "/api/menu";

function cloneMenu(menu) {
  return JSON.parse(JSON.stringify(menu));
}

export async function getMenu() {
  try {
    const response = await fetch(MENU_API_PATH);
    if (!response.ok) throw new Error("Failed to load menu");
    const payload = await response.json();
    return cloneMenu(payload.menu ?? defaultMenu);
  } catch {
    return cloneDefaultMenu();
  }
}

export async function saveMenu(data) {
  const response = await fetch(MENU_API_PATH, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu: data }),
  });

  if (!response.ok) {
    throw new Error("Failed to save menu");
  }

  const payload = await response.json();
  return cloneMenu(payload.menu ?? data);
}

export function resetMenu() {
  return cloneDefaultMenu();
}

export { defaultMenu };
