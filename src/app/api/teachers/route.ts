import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");

  try {
    // Fetch ALL profiles to ensure nothing is missed by DB filters
    const teachers = await prisma.teacherProfile.findMany({
      include: { 
        user: { select: { name: true, email: true, image: true } }, 
        availability: true 
      }
    });

    // If a subject is requested, filter it here with extreme tolerance
    if (subject) {
      const lowerSub = subject.toLowerCase().trim();
      const filtered = teachers.filter(t => {
        if (!t.subjects) return false;
        const list = t.subjects.toLowerCase();
        return list.includes(lowerSub);
      });
      return NextResponse.json(filtered);
    }

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json({ error: "Database Connection Failed" }, { status: 500 });
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
