import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  let bookings;

  if (role === "ADMIN") {
    bookings = await prisma.booking.findMany({
      include: {
        parent: { select: { name: true, email: true } },
        teacher: { include: { user: { select: { name: true, email: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "TEACHER") {
    const profile = await prisma.teacherProfile.findUnique({ where: { userId: session.user.id } });
    if (!profile) return NextResponse.json([]);
    bookings = await prisma.booking.findMany({
      where: { teacherId: profile.id },
      include: {
        parent: { select: { name: true, email: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    bookings = await prisma.booking.findMany({
      where: { parentId: session.user.id },
      include: {
        teacher: { include: { user: { select: { name: true, email: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { teacherId, date, time, subject, notes } = await req.json();
  const booking = await prisma.booking.create({
    data: {
      parentId: session.user.id,
      teacherId,
      date,
      time,
      subject,
      notes,
      status: "PENDING",
    },
  });

  return NextResponse.json(booking);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId, status } = await req.json();
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  return NextResponse.json(booking);
}
