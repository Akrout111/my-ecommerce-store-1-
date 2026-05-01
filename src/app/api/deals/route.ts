import { NextResponse } from "next/server";
import { sampleDeals } from "@/lib/sample-data";

export async function GET() {
  const activeDeals = sampleDeals.filter((d) => d.isActive);
  return NextResponse.json({ deals: activeDeals, total: activeDeals.length });
}
