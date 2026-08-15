import { randomUUID } from "node:crypto";
import { runD1Sql, sqlString } from "./d1";

const remote = process.argv.includes("--remote");

const sessions = [{ name: "Session 1" }, { name: "Session 2" }];

function main() {
  console.log(`🌱 Seeding ${sessions.length} sermon sessions into D1 (${remote ? "remote" : "local"})...`);

  const now = new Date().toISOString();
  const rows = sessions.map(
    (s) => `(${sqlString(randomUUID())}, ${sqlString(s.name)}, ${sqlString(now)}, ${sqlString(now)})`
  );

  runD1Sql(
    [`INSERT INTO sermon_sessions (id, name, createdAt, updatedAt) VALUES\n${rows.join(",\n")};`],
    { remote }
  );
  console.log("✅ Seeded sermon sessions");
}

main();
