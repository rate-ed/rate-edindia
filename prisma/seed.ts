import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@rate-ed.com" },
    update: {},
    create: {
      email: "admin@rate-ed.com",
      password: adminPass,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Seed data created successfully!");
  console.log("Login credentials:");
  console.log("  Admin: admin@rate-ed.com / admin123");
  
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
