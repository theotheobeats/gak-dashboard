import { PrismaClient } from "@prisma/client";
import { auth } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding users...");

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

  for (const user of users) {
    const existing = await prisma.user.findFirst({
      where: { email: user.email },
    });

    if (!existing) {
      await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
        },
      });

      console.log(`✅ Created user: ${user.name}`);
    } else {
      console.log(`⏭️  User already exists: ${user.name}`);
    }
  }

  console.log("✅ Seeded users");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
