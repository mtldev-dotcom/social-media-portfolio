/**
 * new-entry.mjs — interactive script to create a new content entry.
 *
 * Usage: node scripts/new-entry.mjs
 *
 * Prompts for type, slug, and locale, then creates a JSON file
 * from the entry template with timestamps pre-filled.
 */

import fs from "fs/promises";
import path from "path";
import readline from "readline";

const TYPES = ["POST", "NOTE", "PROJECT", "EXPERIMENT", "STORY", "ACTIVITY"];
const LOCALES = ["en", "fr"];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n--- New Content Entry ---\n");

  /* Type */
  console.log("Types:", TYPES.join(", "));
  const type = (await ask("Type: ")).trim().toUpperCase();
  if (!TYPES.includes(type)) {
    console.error(`Invalid type: "${type}"`);
    process.exit(1);
  }

  /* Slug */
  const slug = (await ask("Slug (a-z, 0-9, hyphens): ")).trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`Invalid slug: "${slug}"`);
    process.exit(1);
  }

  /* Locale */
  const locale = (await ask(`Locale (${LOCALES.join("/")}): `)).trim().toLowerCase();
  if (!LOCALES.includes(locale)) {
    console.error(`Invalid locale: "${locale}"`);
    process.exit(1);
  }

  /* Build entry */
  const now = new Date().toISOString();
  const id = `${slug}-${Date.now().toString(36)}`;

  const entry = {
    id,
    type,
    variant: "default",
    slug,
    locale,
    status: "draft",
    publishedAt: now,
    title: "",
    summary: "",
    body: "",
    tags: [],
    meta: {
      time: "",
    },
  };

  /* Write file */
  const filename = `${slug}.${type.toLowerCase()}.json`;
  const outDir = path.join(process.cwd(), "content", "entries", locale);
  const outPath = path.join(outDir, filename);

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(entry, null, 2) + "\n", "utf-8");

  console.log(`\nCreated: content/entries/${locale}/${filename}`);
  console.log(`ID: ${id}`);
  console.log(`Status: draft (set to "published" when ready)\n`);

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
