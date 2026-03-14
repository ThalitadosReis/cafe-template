import { cloneDefaultMenu, defaultMenu } from "./defaultMenu.js";
import { apiUrl } from "../lib/api.js";

const MENU_API_PATH = apiUrl("/api/menu");

function hasMenuContent(menu) {
  return Array.isArray(menu) && menu.length > 0;
}

function cloneMenu(menu) {
  return JSON.parse(JSON.stringify(menu));
}

export function getInitialMenu() {
  return cloneDefaultMenu();
}

export async function getMenu() {
  try {
    const response = await fetch(MENU_API_PATH);
    if (!response.ok) throw new Error("Failed to load menu");
    const payload = await response.json();
    const menu = hasMenuContent(payload.menu) ? payload.menu : defaultMenu;
    return cloneMenu(menu);
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
  const menu = hasMenuContent(payload.menu) ? payload.menu : data;
  return cloneMenu(menu);
}

export function resetMenu() {
  return cloneDefaultMenu();
}
