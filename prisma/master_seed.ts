import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const pass = await bcrypt.hash("admin123", 10);
  const teacherPass = await bcrypt.hash("password123", 10);

  // 1. Admin
  await prisma.user.upsert({
    where: { email: "admin@rate-ed.com" },
    update: {},
    create: { email: "admin@rate-ed.com", password: pass, name: "Admin", role: "ADMIN" }
  });

  // 2. Coding Teacher
  const t1 = await prisma.user.upsert({
    where: { email: "coding@test.com" },
    update: {},
    create: { email: "coding@test.com", password: teacherPass, name: "Arjun Mehta", role: "TEACHER" }
  });
  await prisma.teacherProfile.upsert({
    where: { userId: t1.id },
    update: {},
    create: {
      userId: t1.id,
      bio: "Expert software engineer. I teach Coding, Robotics, and App Development.",
      qualifications: "B.Tech Computer Science",
      experience: 10,
      fees: 1200,
      subjects: "Coding,Robotics,Lego Robotics,App Dev,AI Tools",
      location: "Online",
      approved: true
    }
  });

  // 3. Academics Teacher
  const t2 = await prisma.user.upsert({
    where: { email: "math@test.com" },
    update: {},
    create: { email: "math@test.com", password: teacherPass, name: "Priya Sharma", role: "TEACHER" }
  });
  await prisma.teacherProfile.upsert({
    where: { userId: t2.id },
    update: {},
    create: {
      userId: t2.id,
      bio: "Math and Science specialist with 6 years experience.",
      qualifications: "M.Sc Mathematics",
      experience: 6,
      fees: 800,
      subjects: "math,science,english",
      location: "Online",
      approved: true
    }
  });

  console.log("Master Seed Complete!");
  await prisma.$disconnect();
  await pool.end();
}
main().catch(console.error);
