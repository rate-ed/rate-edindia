import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: { 
        user: { select: { name: true, email: true } }
      }
    });
    return NextResponse.json(teachers);
  } catch (error: any) {
    console.error("API_ERROR:", error.message);
    return NextResponse.json([]);
  }
}
