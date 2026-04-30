export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "pending-teachers") {
    const teachers = await prisma.teacherProfile.findMany({
      where: { approved: false },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(teachers);
  }

  if (action === "all-teachers") {
    const teachers = await prisma.teacherProfile.findMany({
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json(teachers);
  }

  if (action === "all-bookings") {
    const bookings = await prisma.booking.findMany({
      include: {
        parent: { select: { name: true, email: true } },
        teacher: { include: { user: { select: { name: true, email: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  }

  if (action === "all-payments") {
    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        booking: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { action } = data;

  if (action === "approve-teacher") {
    const profile = await prisma.teacherProfile.update({
      where: { id: data.teacherId },
      data: { approved: true },
    });
    return NextResponse.json(profile);
  }

  if (action === "reject-teacher") {
    const profile = await prisma.teacherProfile.update({
      where: { id: data.teacherId },
      data: { approved: false },
    });
    return NextResponse.json(profile);
  }

  if (action === "add-teacher") {
    const hashed = await bcrypt.hash(data.password || "teacher123", 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: "TEACHER",
      },
    });
    const profile = await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        bio: data.bio,
        qualifications: data.qualifications,
        experience: data.experience ? parseInt(data.experience) : null,
        fees: data.fees ? parseFloat(data.fees) : null,
        subjects: data.subjects,
        location: data.location || "",
        approved: true,
      },
    });
    return NextResponse.json({ user, profile });
  }

  if (action === "refund") {
    const payment = await prisma.payment.update({
      where: { id: data.paymentId },
      data: { refundStatus: "REFUNDED", status: "REFUNDED" },
    });
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json(payment);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
