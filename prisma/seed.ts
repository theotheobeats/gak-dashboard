import { randomUUID } from "node:crypto";
import congregations from "../congregations.json";
import { runD1Sql, sqlDate, sqlString } from "./d1";

const remote = process.argv.includes("--remote");

function main() {
  console.log(
    `🌱 Seeding ${congregations.length} congregations into D1 (${remote ? "remote" : "local"})...`
  );

  const now = new Date().toISOString();
  const rows = congregations.map((c: (typeof congregations)[number]) => {
    const id = randomUUID();
    const birthday = c.birthday ? `${c.birthday}T00:00:00.000Z` : null;
    return `(${sqlString(id)}, ${sqlString(c.name)}, ${sqlString(c.title ?? null)}, ${sqlString(
      c.nameWithoutTitle ?? null
    )}, ${sqlDate(birthday)}, ${c.age ?? "NULL"}, ${sqlString(c.status ?? "active")}, ${sqlString(
      now
    )}, ${sqlString(now)})`;
  });

  const statements = [
    `INSERT INTO congregations (id, name, title, nameWithoutTitle, birthday, age, status, createdAt, updatedAt) VALUES\n${rows.join(
      ",\n"
    )};`,
  ];

  runD1Sql(statements, { remote });
  console.log(`✅ Seeded ${congregations.length} congregations`);
}

main();
