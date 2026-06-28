import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/quick-help/:id/claim — 근처 한국인이 도움 요청을 수락
export async function POST(request, { params }) {
  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  const updated = await prisma.quickHelpRequest.update({
    where: { id },
    data: { status: "claimed", guideId: body.guideId ? Number(body.guideId) : null },
  });
  return NextResponse.json(updated);
}
