import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/trips — 여행 경로 생성 (traveler 자동 생성)
export async function POST(request) {
  const body = await request.json();
  const { name, email, title, date, stops, notes } = body;

  if (!name || !title || !stops) {
    return NextResponse.json(
      { error: "이름, 여행 제목, 경로(정거장)는 필수예요." },
      { status: 400 }
    );
  }

  const safeEmail = email || `${name}-${Date.now()}@guest.jalr`;
  const traveler = await prisma.user.upsert({
    where: { email: safeEmail },
    update: { name },
    create: { name, email: safeEmail, role: "traveler" },
  });

  const trip = await prisma.trip.create({
    data: {
      travelerId: traveler.id,
      title,
      date: date || "",
      stops: Array.isArray(stops) ? stops.join(",") : stops,
      notes: notes || "",
    },
  });

  return NextResponse.json(trip);
}

// GET /api/trips — 최근 여행 목록
export async function GET() {
  const trips = await prisma.trip.findMany({
    include: { traveler: true, matches: { include: { guide: { include: { user: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(trips);
}
