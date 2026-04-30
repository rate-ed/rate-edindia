export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId, amount } = await req.json();

  // In test mode, create a mock Razorpay order
  const orderId = "order_" + Date.now();
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      bookingId,
      amount,
      razorpayOrderId: orderId,
      status: "CREATED",
    },
  });

  return NextResponse.json({
    payment,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    orderId,
    amount: amount * 100,
    currency: "INR",
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paymentId, razorpayPaymentId, status } = await req.json();
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      razorpayPaymentId,
      status: status || "PAID",
    },
  });

  if (payment.status === "PAID") {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    });
  }

  return NextResponse.json(payment);
}
