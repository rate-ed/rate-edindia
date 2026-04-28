import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const pass = await bcrypt.hash("password123", 10);

  // 1. Coding Teacher
  const u1 = await prisma.user.upsert({
    where: { email: "coding@test.com" },
    update: {},
    create: { 
      email: "coding@test.com", 
      password: pass, 
      name: "Arjun Mehta", 
      role: "TEACHER",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  await prisma.teacherProfile.upsert({
    where: { userId: u1.id },
    update: {},
    create: {
      userId: u1.id,
      bio: "Expert software engineer with 10 years of experience. I teach Coding, Robotics, and App Development to kids and teens.",
      qualifications: "B.Tech Computer Science, IIT Bombay",
      experience: 10,
      fees: 1200,
      subjects: "Coding,Robotics,Lego Robotics,App Dev,AI Tools",
      location: "Andheri",
      rating: 4.9,
      ratingCount: 15,
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 2. Academics Teacher
  const u2 = await prisma.user.upsert({
    where: { email: "math@test.com" },
    update: {},
    create: { 
      email: "math@test.com", 
      password: pass, 
      name: "Priya Sharma", 
      role: "TEACHER",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  await prisma.teacherProfile.upsert({
    where: { userId: u2.id },
    update: {},
    create: {
      userId: u2.id,
      bio: "Specialized in school-level mathematics and science. I make complex topics simple and easy to understand.",
      qualifications: "M.Sc Mathematics, B.Ed",
      experience: 6,
      fees: 800,
      subjects: "math,science,english",
      location: "Bandra",
      rating: 4.7,
      ratingCount: 8,
      approved: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  console.log("--- Teachers added successfully ---");
  await prisma.$disconnect();
  await pool.end();
}
main().catch(console.error);
