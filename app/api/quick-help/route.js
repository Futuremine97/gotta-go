import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/quick-help — 열려있는 빠른 도움 요청
export async function GET() {
  const requests = await prisma.quickHelpRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { guide: { include: { user: true } } },
  });
  return NextResponse.json(requests);
}

// POST /api/quick-help — 잠깐 도움/길찾기 요청 생성
export async function POST(request) {
  const body = await request.json();
  const { name, location, language, message } = body;
  if (!name || !location || !message) {
    return NextResponse.json({ error: "이름, 현재 위치, 도움 내용은 필수예요." }, { status: 400 });
  }
  const req = await prisma.quickHelpRequest.create({
    data: { name, location, language: language || "영어", message },
  });
  return NextResponse.json(req);
}
