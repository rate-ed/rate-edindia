import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      await resend.emails.send({
        from: 'Rate-ED <onboarding@resend.dev>',
        to: email,
        subject: 'Reset Your Rate-ED Password',
        html: `
          <h1>Hello ${user.name || 'User'}!</h1>
          <p>We received a request to reset your password for your Rate-ED account.</p>
          <p>Since we are in MVP mode, you can log in directly to your profile here:</p>
          <a href="https://rate-edindia.vercel.app/login">Login to Rate-ED</a>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    }

    return NextResponse.json({ message: "Email processed" });
  } catch (error) {
    console.error("Email Error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
