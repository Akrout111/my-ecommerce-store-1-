import { NextResponse } from "next/server";
import { sampleCategories } from "@/lib/sample-data";

export async function GET() {
  return NextResponse.json({ categories: sampleCategories, total: sampleCategories.length });
}
