import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: { 
        user: { select: { name: true, email: true, image: true } }, 
        availability: true 
      }
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const profile = await prisma.teacherProfile.update({
    where: { userId: data.userId },
    data: {
      bio: data.bio,
      qualifications: data.qualifications,
      experience: data.experience ? parseInt(data.experience) : undefined,
      fees: data.fees ? parseFloat(data.fees) : undefined,
      subjects: data.subjects,
      location: data.location,
      photo: data.photo,
    },
  });
  return NextResponse.json(profile);
}
