import { MongoClient } from "mongodb";
import { cloneDefaultMenu } from "../../src/data/defaultMenu.js";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "boldbrew";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "menus";
const MENU_DOCUMENT_ID = "main";

let menuCollectionPromise;

export function isValidMenu(menu) {
  return Array.isArray(menu);
}

export async function getMenuCollection() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!menuCollectionPromise) {
    menuCollectionPromise = (async () => {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      return client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
    })().catch((err) => {
      menuCollectionPromise = null;
      throw err;
    });
  }

  return menuCollectionPromise;
}

export async function readMenu() {
  const collection = await getMenuCollection();
  const doc = await collection.findOne({ _id: MENU_DOCUMENT_ID });
  if (!doc?.menu || !isValidMenu(doc.menu)) {
    const menu = cloneDefaultMenu();
    await collection.updateOne(
      { _id: MENU_DOCUMENT_ID },
      { $set: { menu, updatedAt: new Date() } },
      { upsert: true },
    );
    return menu;
  }

  return doc.menu;
}

export async function writeMenu(menu) {
  if (!isValidMenu(menu)) {
    throw new Error("Invalid menu payload");
  }

  const collection = await getMenuCollection();
  await collection.updateOne(
    { _id: MENU_DOCUMENT_ID },
    { $set: { menu, updatedAt: new Date() } },
    { upsert: true },
  );

  return menu;
}
