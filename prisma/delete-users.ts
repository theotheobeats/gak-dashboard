import { runD1Sql } from "./d1";

const remote = process.argv.includes("--remote");

function main() {
  console.log(`🗑️  Deleting all users from D1 (${remote ? "remote" : "local"})...`);
  runD1Sql(["DELETE FROM session;", "DELETE FROM account;", "DELETE FROM user;"], { remote });
  console.log("✅ Deleted all users");
}

main();
