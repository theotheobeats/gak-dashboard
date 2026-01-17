import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Deleting all users...");

  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Deleted all users");
}

main()
  .catch((e) => {
    console.error("❌ Error deleting users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
