export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  const session = await getServerSession(authOptions);
  let profileId = teacherId;

  if (!profileId && session?.user?.role === "TEACHER") {
    const profile = await prisma.teacherProfile.findUnique({ where: { userId: session.user.id } });
    profileId = profile?.id || null;
  }

  if (!profileId) return NextResponse.json([]);

  const availability = await prisma.availability.findMany({
    where: { teacherId: profileId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(availability);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.teacherProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 400 });

  const { slots } = await req.json();

  // Delete existing and replace
  await prisma.availability.deleteMany({ where: { teacherId: profile.id } });

  const created = await prisma.availability.createMany({
    data: slots.map((s: any) => ({
      teacherId: profile.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
  });

  return NextResponse.json({ count: created.count });
}
