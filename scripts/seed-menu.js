import "dotenv/config";
import { MongoClient } from "mongodb";
import { cloneDefaultMenu } from "../src/data/defaultMenu.js";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "boldbrew";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "menus";
const MENU_DOCUMENT_ID = "main";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();

  const collection = client.db(MONGODB_DB).collection(MONGODB_COLLECTION);
  const menu = cloneDefaultMenu();

  await collection.updateOne(
    { _id: MENU_DOCUMENT_ID },
    {
      $set: {
        menu,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  console.log(
    `Seeded menu to ${MONGODB_DB}.${MONGODB_COLLECTION} with ${menu.length} categories.`,
  );
} catch (err) {
  console.error("Failed to seed menu:", err);
  process.exitCode = 1;
} finally {
  await client.close();
}
