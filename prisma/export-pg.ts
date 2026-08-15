import { PrismaClient } from "../.export-client";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

// Exports all tables from the source Postgres database (via DATABASE_URL in .env)
// into data-export/<model>.json, preserving ids and ISO-8601 dates.
// Uses the isolated export client (prisma/export-schema.prisma) so the main
// sqlite/D1 setup is never touched.

const prisma = new PrismaClient();

const MODELS = [
  "user",
  "session",
  "account",
  "verification",
  "reflection",
  "tag",
  "reflectionTag",
  "album",
  "image",
  "contactSubmission",
  "congregation",
  "sermonSession",
  "attendance",
  "inventory",
  "inventoryInspection",
  "inventoryMaintenance",
] as const;

async function main() {
  const outDir = path.resolve(process.cwd(), "data-export");
  mkdirSync(outDir, { recursive: true });

  let total = 0;
  for (const model of MODELS) {
    const delegate = prisma[model] as unknown as {
      findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    };
    const rows = await delegate.findMany();
    writeFileSync(path.join(outDir, `${model}.json`), JSON.stringify(rows, null, 2));
    total += rows.length;
    console.log(`✅ ${model}: ${rows.length} rows`);
  }
  console.log(`\n📦 Exported ${total} total rows to ${outDir}`);
}

main()
  .catch((e) => {
    console.error("Export failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
