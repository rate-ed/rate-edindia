import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const location = searchParams.get("location");
  const query = searchParams.get("q");

  const where: any = { approved: true };
  if (subject) {
    where.subjects = { contains: subject };
  }
  if (location) {
    where.location = { contains: location };
  }
  if (query) {
    where.OR = [
      { subjects: { contains: query } },
      { bio: { contains: query } },
      { location: { contains: query } },
      { user: { name: { contains: query } } },
    ];
    delete where.approved;
    where.AND = [{ approved: true }];
  }

  const teachers = await prisma.teacherProfile.findMany({
    where,
    include: { user: { select: { name: true, email: true, image: true } }, availability: true },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json(teachers);
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
