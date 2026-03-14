import { cloneDefaultMenu, defaultMenu } from "./defaultMenu.js";

const MENU_API_PATH = "/api/menu";
const MENU_CACHE_KEY = "boldbrew_menu_cache";
const MENU_REQUEST_TIMEOUT_MS = 5000;

function cloneMenu(menu) {
  return JSON.parse(JSON.stringify(menu));
}

function hasMenuContent(menu) {
  return Array.isArray(menu) && menu.length > 0;
}

function getCachedMenu() {
  try {
    const cached = localStorage.getItem(MENU_CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return hasMenuContent(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function setCachedMenu(menu) {
  try {
    if (hasMenuContent(menu)) {
      localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(menu));
    }
  } catch {
    // Ignore cache write failures.
  }
}

export function getInitialMenu() {
  return cloneMenu(getCachedMenu() ?? defaultMenu);
}

export async function getMenu() {
  try {
    const response = await fetchWithTimeout(MENU_API_PATH);
    if (!response.ok) throw new Error("Failed to load menu");
    const payload = await response.json();
    const menu = hasMenuContent(payload.menu) ? payload.menu : defaultMenu;
    setCachedMenu(menu);
    return cloneMenu(menu);
  } catch {
    return cloneMenu(getCachedMenu() ?? defaultMenu);
  }
}

export async function saveMenu(data) {
  const response = await fetchWithTimeout(MENU_API_PATH, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu: data }),
  });

  if (!response.ok) {
    throw new Error("Failed to save menu");
  }

  const payload = await response.json();
  const menu = hasMenuContent(payload.menu) ? payload.menu : data;
  setCachedMenu(menu);
  return cloneMenu(menu);
}

export function resetMenu() {
  try {
    localStorage.removeItem(MENU_CACHE_KEY);
  } catch {
    // Ignore cache delete failures.
  }
  return cloneDefaultMenu();
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MENU_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export { defaultMenu };
