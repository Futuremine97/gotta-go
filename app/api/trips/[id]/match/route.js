import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/trips/:id/match — 경로에 가이드 매칭 (멀티 매칭 지원)
// body: { guideId, stop } 또는 { matches: [{guideId, stop}, ...] }
export async function POST(request, { params }) {
  const tripId = Number(params.id);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return NextResponse.json({ error: "여행을 찾을 수 없어요." }, { status: 404 });

  const body = await request.json();
  const list = Array.isArray(body.matches)
    ? body.matches
    : [{ guideId: body.guideId, stop: body.stop }];

  const created = [];
  for (const m of list) {
    if (!m.guideId) continue;
    const match = await prisma.tripMatch.create({
      data: {
        tripId,
        guideId: Number(m.guideId),
        stop: m.stop || "",
        status: "requested",
      },
      include: { guide: { include: { user: true } } },
    });
    created.push(match);
  }

  return NextResponse.json({ ok: true, matches: created });
}
