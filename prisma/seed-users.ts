import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { runD1Sql, sqlString } from "./d1";

const remote = process.argv.includes("--remote");

// Mirrors better-auth's default password hashing (see better-auth/dist/crypto/password.mjs):
// scrypt with N=16384, r=16, p=1, dkLen=64, stored as `${hexSalt}:${hexKey}` where the salt
// fed to scrypt is the hex string itself (UTF-8 bytes), and the password is NFKC-normalized.
function betterAuthHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password.normalize("NFKC"), salt, 64, {
    N: 16384,
    r: 16,
    p: 1,
    maxmem: 128 * 16384 * 16 * 2,
  }).toString("hex");
  return `${salt}:${key}`;
}

const users = [
  { name: "Dkn. Novianti", email: "novianti@gak.org", password: "gaknovianti" },
  { name: "Pnt. Anita Susanto", email: "anitasusanto@gak.org", password: "gakanitasusanto" },
  { name: "Pnt. Victoria", email: "victoria@gak.org", password: "gakvictoria" },
  { name: "Pdt. Daniel Ferry", email: "daniel@gak.org", password: "gakdaniel" },
  { name: "Pdt. Maya Siringoringo", email: "maya@gak.org", password: "gakmaya" },
  { name: "Ev. Onliwan", email: "onliwan@gak.org", password: "gakonliwan" },
  { name: "Dkn. Sandy Chandra", email: "sandy@gak.org", password: "gaksandy" },
  { name: "Dkn. Theo", email: "theo@gak.org", password: "gaktheo" },
  { name: "Dkn. Herlina", email: "herlina@gak.org", password: "gakherlina" },
  { name: "Niko Sulistyo", email: "niko@gak.org", password: "gakniko" },
  { name: "Guantoro", email: "guan@gak.org", password: "gakguan" },
  { name: "Yehuda", email: "yehuda@gak.org", password: "gakguan" },
  { name: "Valent", email: "valent@gak.org", password: "gakvalent" },
  { name: "Marvin", email: "marvin@gak.org", password: "gakmarvin" },
];

function main() {
  console.log(`🌱 Seeding ${users.length} users into D1 (${remote ? "remote" : "local"})...`);

  const now = new Date().toISOString();
  const userRows: string[] = [];
  const accountRows: string[] = [];

  for (const user of users) {
    const id = randomUUID();
    const hash = betterAuthHash(user.password);
    userRows.push(
      `(${sqlString(id)}, ${sqlString(user.name)}, ${sqlString(user.email)}, 0, NULL, ${sqlString(
        now
      )}, ${sqlString(now)})`
    );
    // Better Auth stores the credential password in the account table
    accountRows.push(
      `(${sqlString(randomUUID())}, ${sqlString(user.email)}, 'credential', ${sqlString(
        id
      )}, NULL, NULL, NULL, NULL, NULL, NULL, ${sqlString(hash)}, ${sqlString(now)}, ${sqlString(now)})`
    );
  }

  runD1Sql(
    [
      `INSERT INTO user (id, name, email, emailVerified, image, createdAt, updatedAt) VALUES\n${userRows.join(
        ",\n"
      )};`,
      `INSERT INTO account (id, accountId, providerId, userId, accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt) VALUES\n${accountRows.join(
        ",\n"
      )};`,
    ],
    { remote }
  );
  console.log(`✅ Seeded ${users.length} users`);
}

main();
