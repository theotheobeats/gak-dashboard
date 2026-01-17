import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding sermon sessions...");

  const sessions = [
    { name: "Session 1" },
    { name: "Session 2" },
  ];

  for (const session of sessions) {
    const existing = await prisma.sermonSession.findFirst({
      where: { name: session.name },
    });

    if (!existing) {
      await prisma.sermonSession.create({
        data: session,
      });
    }
  }

  console.log("✅ Seeded sermon sessions");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding sessions:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
