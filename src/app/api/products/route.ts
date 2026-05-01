import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sample-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let products = [...sampleProducts];

  // Filter by category
  const category = searchParams.get("category");
  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase() || p.categoryId === category
    );
  }

  // Filter by search term
  const search = searchParams.get("search");
  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.nameAr.includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }

  // Filter featured
  const featured = searchParams.get("featured");
  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }

  // Filter new arrivals
  const isNew = searchParams.get("isNew");
  if (isNew === "true") {
    products = products.filter((p) => p.isNew);
  }

  // Filter best sellers
  const isBestSeller = searchParams.get("isBestSeller");
  if (isBestSeller === "true") {
    products = products.filter((p) => p.isBestSeller);
  }

  return NextResponse.json({ products, total: products.length });
}
