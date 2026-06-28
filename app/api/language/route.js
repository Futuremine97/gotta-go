import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/language?kind=learn&language=한국어
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kind = (searchParams.get("kind") || "").trim();
  const language = (searchParams.get("language") || "").trim();
  const where = {};
  if (kind) where.kind = kind;
  if (language) where.language = { contains: language };

  const offers = await prisma.languageOffer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(offers);
}

// POST /api/language — 어학 수요/공급 등록
export async function POST(request) {
  const body = await request.json();
  const { name, email, kind, language, level, note } = body;
  if (!name || !kind || !language) {
    return NextResponse.json({ error: "이름, 종류(가르치기/배우기), 언어는 필수예요." }, { status: 400 });
  }
  const safeEmail = email || `${name}-${Date.now()}@guest.jalr`;
  const user = await prisma.user.upsert({
    where: { email: safeEmail },
    update: { name },
    create: { name, email: safeEmail, role: "both" },
  });
  const offer = await prisma.languageOffer.create({
    data: { userId: user.id, name, kind, language, level: level || "초급", note: note || "" },
  });
  return NextResponse.json(offer);
}
