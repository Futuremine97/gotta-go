import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/trips/:id — 여행 상세 + 매칭된 가이드
export async function GET(_request, { params }) {
  const id = Number(params.id);
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      traveler: true,
      matches: { include: { guide: { include: { user: true } } }, orderBy: { id: "asc" } },
    },
  });
  if (!trip) return NextResponse.json({ error: "여행을 찾을 수 없어요." }, { status: 404 });
  return NextResponse.json(trip);
}
