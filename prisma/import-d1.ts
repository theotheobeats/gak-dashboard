import { readFileSync } from "node:fs";
import path from "node:path";
import { runD1Sql, sqlString } from "./d1";

// Imports data-export/*.json (produced by prisma/export-pg.ts) into the
// gak-dashboard D1 database. Wipes all tables first, then inserts in
// foreign-key-safe order. Run with `--remote` to target production.

const remote = process.argv.includes("--remote");

// children first, so FK constraints / cascades never block the wipe
const WIPE_ORDER = [
  "session",
  "account",
  "verification",
  "reflectionTag",
  "reflection",
  "image",
  "album",
  "attendance",
  "inventoryInspection",
  "inventoryMaintenance",
  "inventory",
  "tag",
  "contactSubmission",
  "congregation",
  "sermonSession",
  "user",
];

// parents first, so every FK target exists before the row that references it
const INSERT_ORDER = [
  "user",
  "congregation",
  "sermonSession",
  "tag",
  "album",
  "image",
  "reflection",
  "reflectionTag",
  "attendance",
  "inventory",
  "inventoryInspection",
  "inventoryMaintenance",
  "contactSubmission",
  "session",
  "account",
  "verification",
] as const;

const TABLE_NAMES: Record<(typeof INSERT_ORDER)[number], string> = {
  user: "user",
  session: "session",
  account: "account",
  verification: "verification",
  reflection: "reflections",
  tag: "tags",
  reflectionTag: "reflection_tags",
  album: "albums",
  image: "images",
  contactSubmission: "contact_submissions",
  congregation: "congregations",
  sermonSession: "sermon_sessions",
  attendance: "attendances",
  inventory: "inventories",
  inventoryInspection: "inventory_inspections",
  inventoryMaintenance: "inventory_maintenances",
};

function sqlValue(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "1" : "0";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  return sqlString(String(v));
}

function buildInsert(table: string, rows: unknown[]): string[] {
  if (rows.length === 0) return [];
  const columns = Object.keys(rows[0] as Record<string, unknown>);
  const colSql = columns.map((c) => `"${c}"`).join(", ");
  const statements: string[] = [];
  // chunk to keep each INSERT well under D1's statement size limits
  const CHUNK = 200;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const values = chunk
      .map((row) => `(${columns.map((c) => sqlValue((row as Record<string, unknown>)[c])).join(", ")})`)
      .join(",\n");
    statements.push(`INSERT INTO "${table}" (${colSql}) VALUES\n${values};`);
  }
  return statements;
}

function main() {
  const dataDir = path.resolve(process.cwd(), "data-export");
  const statements: string[] = [];

  statements.push("-- wipe existing tables (children first)");
  for (const model of WIPE_ORDER) {
    statements.push(`DELETE FROM "${TABLE_NAMES[model as keyof typeof TABLE_NAMES]}";`);
  }

  let total = 0;
  for (const model of INSERT_ORDER) {
    const file = path.join(dataDir, `${model}.json`);
    let rows: unknown[];
    try {
      rows = JSON.parse(readFileSync(file, "utf8")) as unknown[];
    } catch {
      console.log(`⏭️  ${model}: no export file, skipping`);
      continue;
    }
    const table = TABLE_NAMES[model];
    const inserts = buildInsert(table, rows);
    if (inserts.length === 0) {
      console.log(`⏭️  ${model}: 0 rows, skipping`);
      continue;
    }
    statements.push(`-- ${model} (${rows.length} rows)`);
    statements.push(...inserts);
    total += rows.length;
    console.log(`✅ ${model}: ${rows.length} rows → ${table}`);
  }

  console.log(`\n📥 Applying ${total} total rows to D1 (${remote ? "remote" : "local"})...`);
  runD1Sql(statements, { remote });
  console.log("✅ Import complete");
}

main();
