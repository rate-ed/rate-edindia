import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function main() {
  const connectionString = "postgresql://postgres.kdxwzarnzqpcnmrzbbff:Workandrich@2026@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres";
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: { user: true }
    });
    console.log('JSON_START');
    console.log(JSON.stringify(teachers));
    console.log('JSON_END');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
