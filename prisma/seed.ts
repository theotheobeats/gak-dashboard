import { PrismaClient } from "@prisma/client";
import congregations from "../congregations.json";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  for (const congregation of congregations) {
    await prisma.congregation.create({
      data: {
        name: congregation.name,
        title: congregation.title || null,
        nameWithoutTitle: congregation.nameWithoutTitle || null,
        birthday: congregation.birthday ? new Date(congregation.birthday) : null,
        age: congregation.age || null,
        status: congregation.status || "active",
      },
    });
  }

  console.log(`✅ Seeded ${congregations.length} congregations`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
