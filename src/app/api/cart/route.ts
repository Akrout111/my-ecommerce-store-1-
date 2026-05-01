import { NextResponse } from "next/server";

// In-memory cart for demo purposes
let cartItems: unknown[] = [];

export async function GET() {
  return NextResponse.json({
    items: cartItems,
    itemCount: cartItems.length,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    currency: "USD",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    cartItems.push(body);
    return NextResponse.json({ success: true, item: body });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (itemId) {
      cartItems = cartItems.filter((item: unknown) => (item as { id: string }).id !== itemId);
      return NextResponse.json({ success: true });
    }

    // Clear entire cart
    cartItems = [];
    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
