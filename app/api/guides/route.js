import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/guides?neighborhood=홍대&language=영어&q=카페&priceType=free
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const neighborhood = (searchParams.get("neighborhood") || "").trim();
  const language = (searchParams.get("language") || "").trim();
  const q = (searchParams.get("q") || "").trim();
  const priceType = (searchParams.get("priceType") || "").trim();

  const where = {};
  if (neighborhood) where.neighborhoods = { contains: neighborhood };
  if (language) where.languages = { contains: language };
  if (priceType) where.priceType = priceType;
  if (q) {
    where.OR = [
      { bio: { contains: q } },
      { interests: { contains: q } },
      { neighborhoods: { contains: q } },
    ];
  }

  const guides = await prisma.guide.findMany({
    where,
    include: { user: true },
    orderBy: { rating: "desc" },
  });
  return NextResponse.json(guides);
}

// POST /api/guides — 누구나 가이드 등록 (User 자동 생성/연결)
export async function POST(request) {
  const body = await request.json();
  const { name, email, neighborhoods, languages, bio, interests, priceType, isLocal } = body;

  if (!name || !email || !neighborhoods || !languages) {
    return NextResponse.json(
      { error: "이름, 이메일, 활동 동네, 가능 언어는 필수예요." },
      { status: 400 }
    );
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role: "guide" },
    create: { name, email, role: "guide" },
  });

  const existing = await prisma.guide.findUnique({ where: { userId: user.id } });
  if (existing) {
    const updated = await prisma.guide.update({
      where: { userId: user.id },
      data: { neighborhoods, languages, bio: bio || "", interests: interests || "", priceType: priceType || "free", isLocal: isLocal !== false },
      include: { user: true },
    });
    return NextResponse.json(updated);
  }

  const guide = await prisma.guide.create({
    data: {
      userId: user.id,
      neighborhoods,
      languages,
      bio: bio || "",
      interests: interests || "",
      priceType: priceType || "free",
      isLocal: isLocal !== false,
      rating: 5.0,
    },
    include: { user: true },
  });
  return NextResponse.json(guide);
}
