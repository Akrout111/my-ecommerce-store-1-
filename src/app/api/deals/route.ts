import { NextResponse } from "next/server";
import { sampleDeals } from "@/lib/sample-data";
import { sampleProducts } from "@/lib/sample-data";

export async function GET() {
  const dealsWithProducts = sampleDeals.map((deal) => ({
    ...deal,
    product: sampleProducts.find((p) => p.id === deal.productId),
  }));

  return NextResponse.json({
    deals: dealsWithProducts.filter((d) => d.isActive),
  });
}
