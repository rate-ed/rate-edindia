import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const docType = formData.get("docType") as string;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const uploadDir = path.join(process.cwd(), "uploads", session.user.id);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${docType}_${Date.now()}_${file.name}`;
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const relativePath = `/uploads/${session.user.id}/${filename}`;

  if (docType === "aadhar" || docType === "degree") {
    const updateData: any = {};
    if (docType === "aadhar") updateData.aadharDoc = relativePath;
    if (docType === "degree") updateData.degreeDoc = relativePath;

    await prisma.teacherProfile.update({
      where: { userId: session.user.id },
      data: updateData,
    });
  }

  if (docType === "photo") {
    await prisma.teacherProfile.update({
      where: { userId: session.user.id },
      data: { photo: relativePath },
    });
  }

  return NextResponse.json({ path: relativePath });
}
