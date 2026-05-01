import { NextRequest, NextResponse } from "next/server";
import { sampleProducts } from "@/lib/sample-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const featured = searchParams.get("featured") === "true";
  const isNew = searchParams.get("new") === "true";
  const bestSeller = searchParams.get("bestSeller") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  let products = [...sampleProducts];

  // Filter
  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  if (featured) {
    products = products.filter((p) => p.isFeatured);
  }
  if (isNew) {
    products = products.filter((p) => p.isNew);
  }
  if (bestSeller) {
    products = products.filter((p) => p.isBestSeller);
  }

  // Sort
  switch (sort) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "best-selling":
      products.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
    default:
      products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  // Pagination
  const total = products.length;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return NextResponse.json({
    products: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
