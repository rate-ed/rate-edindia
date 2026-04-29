import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: { 
        user: { select: { name: true, email: true, image: true } }, 
        availability: true 
      },
      orderBy: { rating: "desc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of erroring to prevent page hang
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const profile = await prisma.teacherProfile.update({
    where: { userId: session.user.id },
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
