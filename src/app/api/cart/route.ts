import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { safeJsonParse } from "@/lib/utils/json";

// In-memory cart store (simple implementation)
let cartItems: Array<{
  id: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}> = [];

export async function GET() {
  const productIds = cartItems.map((item) => item.productId);
  const products = productIds.length > 0
    ? await prisma.product.findMany({ where: { id: { in: productIds } } })
    : [];

  const productMap = new Map(products.map((p) => [p.id, {
    ...p,
    images: safeJsonParse(p.images, []) as string[],
    sizes: safeJsonParse(p.sizes, []) as string[],
    colors: safeJsonParse(p.colors, []) as string[],
    tags: safeJsonParse(p.tags ?? '[]', []) as string[],
  }]));

  const itemsWithProducts = cartItems.map((item) => ({
    ...item,
    product: productMap.get(item.productId) || null,
  }));

  return NextResponse.json({ items: itemsWithProducts });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId, quantity = 1, size, color } = body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = cartItems.find(
    (i) => i.productId === productId && i.size === size && i.color === color
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({
      id: `cart-${Date.now()}`,
      productId,
      quantity,
      size,
      color,
    });
  }

  return NextResponse.json({ success: true, items: cartItems });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { itemId, quantity } = body;

  const item = cartItems.find((i) => i.id === itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  if (quantity <= 0) {
    cartItems = cartItems.filter((i) => i.id !== itemId);
  } else {
    item.quantity = quantity;
  }

  return NextResponse.json({ success: true, items: cartItems });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  cartItems = cartItems.filter((i) => i.id !== itemId);

  return NextResponse.json({ success: true, items: cartItems });
}
