import { execSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 * Executes SQL statements against the gak-dashboard D1 database via wrangler.
 * Defaults to the local D1 instance; pass `--remote` to target production.
 */
export function runD1Sql(statements: string[], { remote = false }: { remote?: boolean } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), "gak-d1-"));
  const file = path.join(dir, "seed.sql");
  writeFileSync(file, statements.join("\n"));
  const flag = remote ? "--remote" : "--local";
  try {
    execSync(`npx wrangler d1 execute gak-dashboard ${flag} --file="${file}"`, {
      stdio: "inherit",
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function sqlString(value: string | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}

export function sqlDate(value: Date | string | null | undefined): string {
  if (!value) return "NULL";
  return sqlString(new Date(value).toISOString());
}
