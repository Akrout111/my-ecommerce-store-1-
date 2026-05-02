# 🛍️ Persona E-Commerce — Full Audit Report & GLM Agent 5.1 Prompt Suite

> **Prepared by:** Claude Sonnet 4.6  
> **Target Agent:** GLM Full Stack Agent 5.1 (+ Kimi k2.6 for generative tasks)  
> **Project:** `my-ecommerce-store-1--main` — "Persona" Fashion E-Commerce  
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Prisma/SQLite · Zustand · Framer Motion · next-intl (EN/AR)

---

## 📊 SCORECARD — Current State

| Category | Score | Notes |
|---|---|---|
| **Visual Design & Branding** | 62/100 | Nice palette (gold/rose/cream), but zero real product images |
| **Frontend Architecture** | 63/100 | Good component structure; bugs in price logic, broken search |
| **Backend / API Layer** | 28/100 | All APIs return hardcoded `sampleProducts` — Prisma is unused |
| **Feature Completeness** | 32/100 | No product pages, no checkout, no auth UI, no payment |
| **Performance** | 45/100 | No image optimization, no caching, `reactStrictMode: false` |
| **Security** | 22/100 | `ignoreBuildErrors: true`, no input validation on APIs, no CSRF |
| **Accessibility (a11y)** | 58/100 | Skip-link present, some ARIA labels, but many gaps remain |
| **SEO** | 38/100 | No dynamic metadata, no sitemap, no structured data (JSON-LD) |
| **i18n / RTL (AR/EN)** | 71/100 | Best part of the codebase; solid bilingual foundation |
| **Code Quality** | 55/100 | Bugs: coupon noop, price calc error, emoji placeholders as images |
| **OVERALL** | **47/100** | Solid scaffolding, but far from production-ready |

---

## 🔍 CRITICAL BUGS FOUND

### Bug 1 — Price Calculation Error in `ProductCard.tsx`
```typescript
// WRONG (line ~57): same value regardless of condition
price: product.salePrice ? product.price : product.price,
```
The sale price is never applied to cart items. The correct logic should use `product.salePrice ?? product.price`.

### Bug 2 — Coupon Code System is a No-Op
`applyCoupon()` sets the code in state but `calculateTotals()` never reads it — `discount` is always hardcoded to `0`.

### Bug 3 — Search Does Nothing
`handleSearch` in `Header.tsx` closes the search bar but does not navigate or filter — `router.push` is never called.

### Bug 4 — Prisma Schema Exists but All APIs Use `sampleProducts`
The `Product`, `Category`, `Deal`, and `CartItem` models are defined in `schema.prisma` with SQLite, but every API route imports from `@/lib/sample-data` instead of using `prisma.product.findMany(...)`.

### Bug 5 — Build Config Red Flags in `next.config.ts`
```typescript
typescript: { ignoreBuildErrors: true },  // hides real errors
reactStrictMode: false,                    // disables double-render checks
```

---

## 🏗️ ARCHITECTURE GAPS

1. **No product detail page** — `/products/[slug]` route does not exist
2. **No checkout flow** — Cart exists in Zustand but there is no checkout page, address form, or payment step
3. **No user authentication UI** — `next-auth` is installed but no `/login`, `/register`, or `/account` pages exist
4. **No wishlist page** — Wishlist Zustand store exists but has no route
5. **No order management** — No `Order` model in Prisma, no order history
6. **No admin dashboard** — No way to manage products, orders, or inventory
7. **No payment integration** — No Stripe, PayPal, or any payment gateway
8. **No email system** — No order confirmation or password reset emails
9. **No image system** — Product images are emoji placeholders; no upload/CDN flow
10. **No real search** — `full-text search` not wired to any backend

---

## ✅ WHAT IS DONE WELL

- **Brand identity** is coherent: gold `#C9A96E`, rose `#E8A0BF`, cream `#FAF8F5`, dark `#0F0F0F`
- **RTL/LTR bilingual** architecture with `next-intl` and `dir` attribute handling
- **Framer Motion** animations are tasteful and performant (`viewport: { once: true }`)
- **Glassmorphism** CSS utilities and shimmer/skeleton animations are pre-built
- **Cart state** persists via Zustand `persist` middleware (localStorage)
- **Accessibility foundations**: skip-to-content link, `aria-label`s on icon buttons, `prefers-reduced-motion` media query
- **Bento grid** CSS layout utilities ready for use
- **Dark mode** fully themed via CSS variables

---

---

# 🤖 GLM FULL STACK AGENT 5.1 — MASTER PROMPT SUITE

> **Instructions for Agent:** Execute these prompts in the order listed. Each prompt is self-contained. Use the existing codebase at the project root as context. Maintain all existing brand colors, RTL support, and component patterns unless explicitly instructed to change them.

---

## PROMPT 1 — Fix Critical Bugs & Harden Config

```markdown
# TASK: Fix Critical Bugs and Harden Next.js Config

## Context
You are working on a Next.js 16 + TypeScript e-commerce project called "Persona" (fashion store).
Project root is `./`. The tech stack is: Next.js 16, Tailwind CSS v4, shadcn/ui, Prisma, Zustand, Framer Motion, next-intl.
Brand colors: gold=#C9A96E, rose=#E8A0BF, cream=#FAF8F5, dark=#0F0F0F.

## Fixes Required

### Fix 1 — next.config.ts
Edit `next.config.ts`:
- Set `typescript.ignoreBuildErrors` to `false`
- Set `reactStrictMode` to `true`
- Add `images.domains` array with common CDN domains: `['images.unsplash.com', 'cdn.persona.fashion', 'res.cloudinary.com']`

### Fix 2 — src/components/products/ProductCard.tsx
Find the `handleAddToCart` function. The price fields are wrong:
```
// CURRENT (wrong):
price: product.salePrice ? product.price : product.price,
totalPrice: product.salePrice ? product.price : product.price,

// REPLACE WITH (correct):
price: product.salePrice ?? product.price,
totalPrice: product.salePrice ?? product.price,
```

### Fix 3 — src/store/cart-store.ts
In the `calculateTotals` function, replace the hardcoded `discount: 0` with real coupon logic.
Add a `couponCode` parameter to `calculateTotals` and apply a 10% discount when code is "PERSONA10", 15% for "SAVE15", 20% for "WELCOME20":
```typescript
function calculateTotals(items: CartItem[], couponCode?: string | null) {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  
  const COUPONS: Record<string, number> = {
    PERSONA10: 0.10,
    SAVE15: 0.15,
    WELCOME20: 0.20,
  };
  const discountRate = couponCode ? (COUPONS[couponCode.toUpperCase()] ?? 0) : 0;
  const discount = subtotal * discountRate;
  const total = subtotal + shipping + tax - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, shipping, tax, discount, total, itemCount };
}
```
Update all `calculateTotals(newItems)` calls to `calculateTotals(newItems, get().couponCode)`.

### Fix 4 — src/components/layout/Header.tsx
Wire the search form to actually navigate:
1. Add `import { useRouter } from 'next/navigation';` at top
2. Inside the `Header` component, add: `const router = useRouter();`
3. In `handleSearch`, replace the body with:
```typescript
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  }
};
```

## Validation
After all fixes, run `bun run lint` and confirm zero TypeScript errors.
```

---

## PROMPT 2 — Wire Prisma to All API Routes

```markdown
# TASK: Replace sampleProducts with Real Prisma Database Queries

## Context
Project: Persona e-commerce (Next.js 16, Prisma with SQLite at `./db/dev.db`).
All API routes currently import from `@/lib/sample-data` — replace every occurrence with real Prisma queries.
DATABASE_URL is already set in `.env`.

## Step 1 — Create Prisma Client Singleton
Create `src/lib/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Step 2 — Rewrite src/app/api/products/route.ts
Replace the entire file with a real Prisma implementation:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') === 'true';
  const isNew = searchParams.get('new') === 'true';
  const bestSeller = searchParams.get('bestSeller') === 'true';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 12;

  try {
    const where: any = {};
    if (category) where.category = category;
    if (featured) where.isFeatured = true;
    if (isNew) where.isNew = true;
    if (bestSeller) where.isBestSeller = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const orderBy: any =
      sort === 'price-asc' ? { price: 'asc' }
      : sort === 'price-desc' ? { price: 'desc' }
      : sort === 'best-selling' ? { reviewCount: 'desc' }
      : sort === 'rating' ? { rating: 'desc' }
      : { createdAt: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Parse JSON string fields
    const parsed = products.map((p) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      colors: JSON.parse(p.colors || '[]'),
      tags: JSON.parse(p.tags || '[]'),
    }));

    return NextResponse.json({ products: parsed, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Step 3 — Rewrite src/app/api/categories/route.ts
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Step 4 — Rewrite src/app/api/deals/route.ts
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const now = new Date();
    const deals = await prisma.deal.findMany({
      where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      include: {
        product: {
          select: {
            id: true, name: true, nameAr: true, price: true, salePrice: true,
            brand: true, images: true, category: true, rating: true, reviewCount: true,
            sizes: true, colors: true, inStock: true, isNew: true, isBestSeller: true,
          },
        },
      },
      orderBy: { endsAt: 'asc' },
    });
    return NextResponse.json({ deals });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Step 5 — Create a Database Seed Script
Create `prisma/seed.ts` that populates the database with 30 diverse fashion products across all categories (women, men, kids, accessories, shoes, beauty), 6 categories, and 5 active deals. Use realistic product names, prices ($15–$450), Arabic translations for all name/description fields, and placeholder image paths like `/images/products/product-1.jpg`.

Run: `bun run db:push && bun prisma db seed`
```

---

## PROMPT 3 — Build Product Detail Page with Advanced Gallery

```markdown
# TASK: Create Full Product Detail Page at /[locale]/products/[slug]

## Context
Next.js 16 App Router project. Brand: gold=#C9A96E, rose=#E8A0BF. Supports EN/AR with RTL.
Uses Framer Motion, shadcn/ui, Tailwind CSS v4, Zustand cart store, Prisma.

## Files to Create

### 1. src/app/[locale]/products/[slug]/page.tsx
Server component that:
- Fetches product from Prisma by slug/id
- Renders metadata with `generateMetadata` (title, description, og:image)
- Passes data to `ProductDetailClient` client component
- Returns 404 if product not found

### 2. src/components/products/ProductDetailClient.tsx
Rich client component with these sections:

**A) Image Gallery**
- Large main image with Framer Motion zoom on hover
- Row of 4 thumbnail images below
- Clicking thumbnail swaps main image with smooth crossfade animation
- "360° View" badge overlay in corner (visual only)
- Fullscreen lightbox modal on main image click (use Radix Dialog)

**B) Product Info Panel**
- Brand name (small, muted)
- Product name (large h1, 2.5rem, bold)
- Arabic name shown below if `isRTL` is true
- Star rating display (filled/half/empty stars)
- Review count as a clickable link scrolling to reviews section
- Price display: current price in gold color, original strikethrough if on sale, discount % badge in rose
- "In Stock" / "Only X left" / "Out of Stock" indicator with color coding
- Color selector: circular swatches (actual CSS colors, not just text), selected state with gold ring
- Size selector: pill buttons, selected state filled gold, "Size Guide" link opening a Radix Sheet with a size table
- Quantity selector: minus/number/plus with min=1, max=stockCount
- "Add to Cart" button: full width, gold background, icon, hover scale animation, loading state
- "Add to Wishlist" button: outlined, rose heart icon, toggle fill on click
- "Buy Now" button: dark background, direct checkout redirect
- Trust badges row: Free Shipping icon, Easy Returns icon, Secure Payment icon
- Product description accordion (Radix Accordion)
- Share buttons: copy link, Twitter, WhatsApp

**C) Product Details Tabs** (Radix Tabs)
- Tab 1: Description (full text, supports markdown via `react-markdown`)
- Tab 2: Size & Fit (static content table)
- Tab 3: Shipping & Returns (policy text)
- Tab 4: Reviews (see section D below)

**D) Reviews Section**
- Summary: average rating (large number), breakdown bars per star (1–5)
- List of mock reviews with avatar, name, date, star rating, comment text
- "Write a Review" button opening a Radix Dialog form (rating stars + comment textarea + submit)

**E) Related Products Row**
- Horizontal scrollable row of 6 ProductCard components from same category
- Title: "You Might Also Like" / "قد يعجبك أيضاً"

## Routing
Update `src/components/products/ProductCard.tsx`:
- Wrap the card in a `<Link href={`/products/${product.id}`}>` — make the image and title clickable
- Keep the "Add to Cart" button as a separate non-link button (use `e.stopPropagation()`)

## Animation Requirements
- Page entry: stagger children with `delayChildren: 0.1, staggerChildren: 0.05`
- Image gallery: crossfade via `AnimatePresence` with `mode="wait"`
- Color/size selection: scale bounce on click via `whileTap={{ scale: 0.9 }}`
- Add to cart: button shrinks then grows, then cart icon animates flying to cart count in header
```

---

## PROMPT 4 — Full Authentication System (Register / Login / Profile)

```markdown
# TASK: Implement Complete User Authentication with next-auth + Prisma

## Context
Project already has `next-auth@4` installed and `src/app/api/auth/[...nextauth]/route.ts` exists (minimal).
Prisma schema has no User model yet. SQLite database.

## Step 1 — Extend Prisma Schema
Add to `prisma/schema.prisma`:
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String    @default("customer")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts    Account[]
  sessions    Session[]
  orders      Order[]
  wishlistItems WishlistItem[]
  reviews     Review[]
  addresses   Address[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@unique([userId, productId])
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  label      String  @default("Home")
  firstName  String
  lastName   String
  street     String
  city       String
  state      String?
  postalCode String
  country    String
  phone      String?
  isDefault  Boolean @default(false)
  user       User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
Run `bun run db:push && bun run db:generate`.

## Step 2 — Configure NextAuth
Rewrite `src/app/api/auth/[...nextauth]/route.ts`:
- Use PrismaAdapter from `@auth/prisma-adapter`
- Enable Credentials provider (email + password with bcrypt)
- Enable Google provider (reads `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` from env)
- Set `session.strategy = 'jwt'`
- Add `callbacks.session` to include `user.id` and `user.role`
- Add `NEXTAUTH_SECRET` to `.env.example`

Install `bcryptjs @types/bcryptjs @auth/prisma-adapter`.

## Step 3 — Auth API Routes
Create `src/app/api/auth/register/route.ts`:
- POST accepts `{ name, email, password }`
- Validate with Zod: email format, password min 8 chars
- Hash password with `bcrypt.hash(password, 12)`
- Create user via Prisma (handle unique constraint error → 409)
- Return `{ success: true }`

## Step 4 — Auth Pages
Create these pages under `src/app/[locale]/`:

### `auth/login/page.tsx`
Beautiful centered card layout (max-w-md, glass card):
- Logo at top
- "Sign In" / "تسجيل الدخول" heading
- Email + Password inputs with `react-hook-form` + Zod validation
- "Forgot password?" link
- Submit button (gold, full width, loading spinner)
- Divider "or continue with"
- Google Sign In button
- Link to register
- Error message display for wrong credentials

### `auth/register/page.tsx`
Same card layout:
- Name + Email + Password + Confirm Password
- Password strength indicator (weak/medium/strong with color bar)
- Terms checkbox
- Submit button
- Link to login

### `account/page.tsx` (protected route)
User profile dashboard with tabs:
- **Profile**: edit name, email, avatar upload placeholder
- **Orders**: list of past orders (empty state with illustration if none)
- **Wishlist**: grid of wishlisted products
- **Addresses**: list of saved addresses with add/edit/delete
- **Security**: change password form

## Step 5 — Route Protection
Create `src/middleware.ts`:
```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/account')) {
          return !!token;
        }
        if (req.nextUrl.pathname.startsWith('/checkout')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = { matcher: ['/account/:path*', '/checkout/:path*'] };
```

## Step 6 — Update Header
In `src/components/layout/Header.tsx`:
- Import `useSession` from `next-auth/react`
- Replace static "Wishlist" icon with: if logged in show user avatar + dropdown (My Account, Orders, Sign Out); if not logged in show "Sign In" link
- Add `SessionProvider` wrapper in `src/app/[locale]/layout.tsx`
```

---

## PROMPT 5 — Checkout Flow with Stripe Payment

```markdown
# TASK: Build Complete Multi-Step Checkout with Stripe

## Context
Cart state is managed by Zustand (`useCartStore`). User auth via next-auth.
Install: `stripe @stripe/stripe-js @stripe/react-stripe-js`.
Add `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` to `.env`.

## Step 1 — Order Model in Prisma
Add to `prisma/schema.prisma`:
```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  userId          String?
  guestEmail      String?
  status          String      @default("pending")
  items           OrderItem[]
  shippingAddress Json
  billingAddress  Json?
  subtotal        Float
  shipping        Float
  tax             Float
  discount        Float       @default(0)
  total           Float
  couponCode      String?
  stripePaymentIntentId String? @unique
  stripeChargeId  String?
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  user            User?       @relation(fields: [userId], references: [id])
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  name      String
  brand     String
  image     String
  price     Float
  quantity  Int
  size      String?
  color     String?
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```
Run `bun run db:push`.

## Step 2 — Stripe Payment Intent API
Create `src/app/api/checkout/create-payment-intent/route.ts`:
- POST accepts cart items + coupon code + shipping address
- Validates items against database (price verification — never trust client prices)
- Creates Stripe PaymentIntent with exact calculated amount
- Returns `{ clientSecret, orderId }`

Create `src/app/api/checkout/webhook/route.ts`:
- Handles `payment_intent.succeeded` → update order status to "paid", reduce stock counts
- Handles `payment_intent.payment_failed` → update order status to "failed"
- Always verify Stripe webhook signature

## Step 3 — Checkout Page: src/app/[locale]/checkout/page.tsx
Multi-step checkout with progress indicator (3 steps):

**Step 1 — Information**
- Order summary sidebar (sticky on desktop, collapsed accordion on mobile)
  - Each cart item: image, name, size, color, quantity, price
  - Subtotal, shipping, tax, coupon input, total
- Contact: email field (pre-filled if logged in)
- Shipping address form (first name, last name, address, city, state, zip, country, phone)
- "Continue to Payment" button

**Step 2 — Shipping Method**
- Radio cards for shipping options:
  - Standard (5–7 days) — Free over $50, else $5.99
  - Express (2–3 days) — $12.99
  - Next Day — $24.99
- "Back" + "Continue to Payment" buttons

**Step 3 — Payment**
- Stripe Elements `PaymentElement` (card, Apple Pay, Google Pay)
- Billing address toggle (same as shipping / different)
- "Place Order" button with loading spinner
- Trust badges: SSL Secure, 30-day Returns, 24/7 Support
- On success: redirect to `/order-confirmation/[orderId]`

## Step 4 — Order Confirmation Page
Create `src/app/[locale]/order-confirmation/[orderId]/page.tsx`:
- Animated checkmark (Framer Motion draw animation)
- "Thank you, [Name]!" heading
- Order number display
- Summary of ordered items
- Estimated delivery date
- "Continue Shopping" button + "Track Order" button
- Email confirmation note

## Step 5 — Cart Sheet Enhancement
In `src/components/cart/CartSheet.tsx`:
- Add "Proceed to Checkout" button that routes to `/checkout`
- Show coupon field at bottom of cart
- Disable checkout button if cart is empty
- Add "You're $X away from free shipping" progress bar
```

---

## PROMPT 6 — Admin Dashboard

```markdown
# TASK: Build Admin Dashboard at /admin

## Context
Next.js 16 App Router. Prisma/SQLite. next-auth with role-based access (role: "admin").
Use shadcn/ui components: DataTable, Charts (recharts already installed), Dialogs, Sheets.

## Step 1 — Admin Route Protection
In `src/middleware.ts`, add:
- `/admin/*` routes require `token.role === 'admin'`
- Redirect unauthorized users to `/`

## Step 2 — Admin Layout: src/app/[locale]/admin/layout.tsx
- Fixed left sidebar (240px wide) with:
  - Logo at top
  - Navigation links: Dashboard, Products, Orders, Customers, Deals, Analytics, Settings
  - Collapsed mobile variant
- Main content area with topbar showing logged-in admin name + logout button

## Step 3 — Dashboard Overview: src/app/[locale]/admin/page.tsx
Stat cards row (4 cards):
- Total Revenue (this month) with % change vs last month
- Total Orders (this month) with trend
- Active Products count
- New Customers (this month)

Charts section:
- Revenue chart (line chart, last 30 days, using recharts)
- Orders by category (bar chart, using recharts)
- Top 5 products table (name, category, sales, revenue)
- Recent orders table (last 10 orders)

## Step 4 — Products Management: src/app/[locale]/admin/products/page.tsx
Full CRUD product management:
- Search + filter bar (by category, status, price range)
- DataTable with columns: image, name, category, price, stock, status, actions
- "Add Product" button opens a Sheet with full product form:
  - Name (EN + AR), Description (EN + AR with MDX editor)
  - Category dropdown, Subcategory
  - Price, Sale Price
  - Stock count, Sizes (multi-select chips), Colors (color picker)
  - Images upload (drag-drop zone, max 6 images, preview grid)
  - Flags: isFeatured, isNew, isBestSeller
  - Save button (calls POST /api/admin/products)
- Edit: click row → same Sheet prefilled
- Delete: confirmation dialog
- Bulk actions: delete selected, toggle featured

## Step 5 — Orders Management: src/app/[locale]/admin/orders/page.tsx
- Filter by status: All, Pending, Paid, Shipped, Delivered, Cancelled
- Search by order number or customer email
- DataTable: order #, customer, date, items count, total, status badge, actions
- Click order → full order detail Sheet:
  - Items list with images
  - Customer info + shipping address
  - Payment info (last 4 digits of card)
  - Status update dropdown (with confirmation)
  - Tracking number input field
  - Internal notes textarea

## Step 6 — Analytics Page: src/app/[locale]/admin/analytics/page.tsx
- Date range picker (last 7d, 30d, 90d, custom)
- Revenue over time (area chart)
- Conversion funnel (visits → added to cart → checkout → purchased)
- Top categories by revenue (donut chart)
- Geographic heatmap placeholder (world map SVG colored by order volume)
- Export to CSV button

## Step 7 — Admin API Routes
Create these under `src/app/api/admin/`:
- `products/route.ts` — GET (list with filters), POST (create)
- `products/[id]/route.ts` — PUT (update), DELETE
- `orders/route.ts` — GET (list with filters)
- `orders/[id]/route.ts` — GET (detail), PATCH (update status/tracking)
- `analytics/route.ts` — GET (aggregate stats from Prisma)

All admin routes must verify `session.user.role === 'admin'` before executing.
```

---

## PROMPT 7 — Advanced UI: 3D Hero, Animations & Visual Overhaul

```markdown
# TASK: Redesign Hero Section + Product Cards with Advanced Animations

## Context
Current HeroSection has only gradient backgrounds with text — no product images.
Brand: gold=#C9A96E, rose=#E8A0BF, cream=#FAF8F5, dark=#0F0F0F.
Framer Motion is already installed. Three.js can be added.

## Step 1 — Install Dependencies
```bash
bun add @react-three/fiber @react-three/drei three @types/three lenis
```

## Step 2 — Smooth Scroll with Lenis
Create `src/components/providers/LenisProvider.tsx`:
```typescript
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
}
```
Wrap `src/app/[locale]/layout.tsx` content with `<LenisProvider>`.

## Step 3 — Redesigned HeroSection
Completely rewrite `src/components/home/HeroSection.tsx` with:

**Layout**: Full-viewport (100vh) split layout:
- Left 55%: Text content with staggered text animations
- Right 45%: 3D floating product showcase (Three.js canvas)

**Left Side Content**:
- Small animated pill badge: "✨ New Collection 2026"
- Main headline: Large serif font (use `font-playfair` class — add Playfair Display via next/font/google)
  - Line 1: "Fashion" — slides in from left
  - Line 2: "Reimagined" — slides in from right, gold color
  - Use `motion.span` with `initial={{ x: -100, opacity: 0 }}` and viewport trigger
- Subtitle paragraph with fade-up delay
- Two CTA buttons side by side:
  - Primary: "Shop Now" — gold background, rounded-full, `whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(201,169,110,0.5)" }}`
  - Secondary: "View Lookbook" — outlined, hover fill
- Small trust row: "Free shipping · Easy returns · 50k+ customers"
- Animated scroll indicator (bouncing arrow) at bottom

**Right Side — 3D Canvas** (`@react-three/fiber`):
Create `src/components/home/HeroCanvas.tsx`:
- Render 3 floating geometric shapes (icosahedron, torus, box) in brand colors
- Auto-rotate with `useFrame`
- `OrbitControls` with `enableZoom={false}` and gentle auto-rotation
- Soft point lights in gold and rose colors
- Particle field in background (500 random points, gold color, small size)
- Canvas is `position: absolute, inset-0, pointer-events: none`
- Fallback: `<Suspense fallback={<div className="animate-shimmer rounded-2xl" />}>`

**Slide Progression**:
- Keep the 3 slides (general, men's, sale)
- Instead of just gradient changes, animate:
  - Slide 1: Gold particles
  - Slide 2: Dark masculine theme, navy accent
  - Slide 3: Sale — rose particles, % counter animation

## Step 4 — Enhanced ProductCard
Rewrite `src/components/products/ProductCard.tsx` image section:

Replace the emoji placeholder with:
```tsx
<div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/60 rounded-t-2xl">
  <Image
    src={product.images[0] || '/images/placeholder-product.jpg'}
    alt={displayName}
    fill
    className="object-cover transition-transform duration-700 group-hover:scale-110"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  />
  {/* Second image on hover */}
  {product.images[1] && (
    <Image
      src={product.images[1]}
      alt={`${displayName} alternate view`}
      fill
      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      sizes="(max-width: 640px) 100vw, 25vw"
    />
  )}
</div>
```

Add a "Quick View" button (eye icon) that appears on hover and opens a `ProductQuickView` modal.

## Step 5 — Page Scroll Animations
Create `src/hooks/useScrollReveal.ts`:
```typescript
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return { ref, isInView };
}
```

Apply to all section headings and card grids:
- Section titles: `initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}`
- Card grids: stagger each card with `transition={{ delay: index * 0.08 }}`

## Step 6 — Create a Placeholder Product Image
Create `public/images/placeholder-product.jpg`:
- Generate using a CSS gradient canvas element (script):
```bash
node -e "
const {createCanvas} = require('canvas');
const c = createCanvas(600,800);
const ctx = c.getContext('2d');
const g = ctx.createLinearGradient(0,0,600,800);
g.addColorStop(0,'#F5F0EB');
g.addColorStop(1,'#E8DCC8');
ctx.fillStyle=g;
ctx.fillRect(0,0,600,800);
require('fs').writeFileSync('public/images/placeholder-product.jpg', c.toBuffer('image/jpeg'));
"
```
If `canvas` npm package is not available, create an SVG placeholder at `public/images/placeholder-product.svg` with the Persona logo centered on a cream gradient background.
```

---

## PROMPT 8 — SEO, Performance & PWA

```markdown
# TASK: Implement SEO, Performance Optimizations & PWA Support

## Step 1 — Dynamic Metadata per Page
In `src/app/[locale]/layout.tsx`, set root metadata:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://persona.fashion'),
  title: { default: 'Persona — Fashion Reimagined', template: '%s | Persona' },
  description: 'Discover premium fashion for women, men, and kids. Free shipping over $50.',
  keywords: ['fashion', 'clothing', 'style', 'persona', 'luxury fashion'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://persona.fashion',
    siteName: 'Persona Fashion',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Persona Fashion' }],
  },
  twitter: { card: 'summary_large_image', creator: '@personafashion' },
  robots: { index: true, follow: true },
  verification: { google: 'your-google-site-verification' },
};
```

In `src/app/[locale]/products/[slug]/page.tsx`, use `generateMetadata`:
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { id: params.slug } });
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: [{ url: JSON.parse(product.images)[0] || '/og-image.jpg' }],
    },
  };
}
```

## Step 2 — JSON-LD Structured Data
Create `src/components/seo/ProductStructuredData.tsx`:
```typescript
export function ProductStructuredData({ product }: { product: Product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.salePrice ?? product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
    image: JSON.parse(product.images)[0],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
```

## Step 3 — Sitemap
Create `src/app/sitemap.ts`:
```typescript
import { prisma } from '@/lib/db';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
  const categories = ['women', 'men', 'kids', 'shoes', 'accessories', 'beauty'];

  return [
    { url: 'https://persona.fashion', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...categories.map(cat => ({ url: `https://persona.fashion/category/${cat}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...products.map(p => ({ url: `https://persona.fashion/products/${p.id}`, lastModified: p.updatedAt, changeFrequency: 'weekly' as const, priority: 0.6 })),
  ];
}
```

## Step 4 — PWA Manifest & Service Worker
Create `public/manifest.json`:
```json
{
  "name": "Persona Fashion",
  "short_name": "Persona",
  "description": "Fashion Reimagined",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF8F5",
  "theme_color": "#C9A96E",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```
Add `<link rel="manifest" href="/manifest.json" />` to root layout.

## Step 5 — Performance Optimizations
In `next.config.ts`, add:
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 86400,
    domains: ['images.unsplash.com', 'cdn.persona.fashion', 'res.cloudinary.com'],
  },
  compress: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
    {
      source: '/images/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ],
};
```

## Step 6 — Bundle Analysis
Install `@next/bundle-analyzer`. Add to `next.config.ts`:
```typescript
import withBundleAnalyzer from '@next/bundle-analyzer';
const bundleAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default bundleAnalyzer(nextConfig);
```
Add script to `package.json`: `"analyze": "ANALYZE=true bun run build"`

## Step 7 — Lazy Loading Strategy
Audit all heavy components and add dynamic imports:
```typescript
// In src/app/[locale]/page.tsx, lazy load below-fold sections:
const DepartmentHub = dynamic(() => import('@/components/home/DepartmentHub').then(m => ({ default: m.DepartmentHub })), { ssr: false });
const NewsletterSection = dynamic(() => import('@/components/home/NewsletterSection').then(m => ({ default: m.NewsletterSection })));
// Lazy load the 3D hero canvas:
const HeroCanvas = dynamic(() => import('@/components/home/HeroCanvas'), { ssr: false });
```
```

---

## PROMPT 9 — AI-Powered Features (Using Kimi k2.6 / LLM)

> **Note:** This prompt targets AI features to be built using the LLM skill available in the project (`skills/LLM/SKILL.md`). Read that skill file before implementing.

```markdown
# TASK: Implement AI-Powered Features using the LLM Skill

## Context
The project has an LLM skill at `skills/LLM/SKILL.md`. Read it first.
Brand: Persona fashion store. Uses Next.js 16 API routes. Zustand for state.

## Feature 1 — AI Style Assistant Chatbot
Create `src/components/ai/StyleAssistant.tsx`:

A floating chat bubble (bottom-right corner, z-50) that expands into a chat panel:
- Bubble: gold gradient circle with sparkle icon, subtle pulse animation
- Panel: 380px wide, 520px tall, glass card design with blur backdrop
- Header: "Persona Style AI" with avatar, online indicator, close button
- Messages area: scrollable, user messages on right (gold bg), AI on left (card bg)
- Input: text field + send button + voice input button placeholder
- Typing indicator: three animated dots while AI responds

API Route: Create `src/app/api/ai/style-assistant/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { messages, cartItems, currentPage } = await request.json();

  const systemPrompt = `You are Persona AI, the personal style assistant for Persona fashion store.
You are knowledgeable, friendly, and have an elegant, sophisticated tone.
You help customers find the perfect outfit, suggest size guides, explain return policies,
answer product questions, and create outfit combinations.
Current context: The customer is on ${currentPage}.
If asked about products, suggest they browse our categories: Women, Men, Kids, Accessories, Shoes, Beauty.
Keep responses concise (2-3 sentences max) and fashion-forward.
Always respond in the same language the customer uses (support Arabic and English).`;

  // Use the LLM skill pattern to call the configured AI model
  const response = await fetch(process.env.LLM_API_URL || 'http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.LLM_API_KEY}` },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || 'kimi-k2',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      stream: false,
    }),
  });

  const data = await response.json();
  return NextResponse.json({ message: data.choices?.[0]?.message?.content || data.message?.content });
}
```

## Feature 2 — AI Product Description Generator (Admin)
In the admin product form (from Prompt 6), add an "✨ Generate with AI" button next to the description field:
- On click, send `{ productName, brand, category, colors, tags }` to `POST /api/ai/generate-description`
- Display loading spinner in button
- On response, fill the description textarea with the generated text
- Allow manual editing after generation
- Generate both English and Arabic descriptions simultaneously

API route `src/app/api/ai/generate-description/route.ts`:
- Prompt: "Write a compelling, SEO-optimized product description for an e-commerce fashion product. Product: [details]. Write 2-3 sentences. Highlight key features and appeal to fashion-conscious shoppers. Then write the Arabic translation."
- Parse response to extract EN and AR descriptions
- Return `{ descriptionEn, descriptionAr }`

## Feature 3 — AI Size Recommendation
Create `src/components/products/SizeRecommender.tsx`:
- Small "Find My Size" button on product detail page
- Opens a dialog with a simple questionnaire:
  - Height (cm or ft/in toggle)
  - Weight (kg or lbs toggle)
  - Typical fit preference (Slim, Regular, Loose)
  - Body shape (optional)
- Calls `POST /api/ai/recommend-size` with product category + user measurements
- Returns recommended size with confidence level and fit notes
- Display as: "We recommend **M** — Based on your measurements, this should fit comfortably in the shoulders and chest."

## Feature 4 — Smart Search with AI Reranking
Enhance `src/app/api/search/route.ts`:
- When a search query is vague (e.g., "something for a beach wedding"), call the AI to expand the query into specific product attributes before running the database search
- Store recent AI-expanded queries in a simple in-memory cache (Map with TTL)
- Return `{ products, aiSuggestion }` where `aiSuggestion` is a one-line AI tip like "Showing flowy maxi dresses and linen blazers for beach wedding vibes 🌊"
```

---

## PROMPT 10 — Search Page, Category Pages & Filters

```markdown
# TASK: Build Functional Search Results & Category Listing Pages

## Step 1 — Search Page: src/app/[locale]/search/page.tsx
Server component that reads `?q=` from searchParams and fetches matching products from Prisma.

Layout:
- Header bar: "Search results for '[query]'" with result count
- Refinement sidebar (left, collapsible on mobile):
  - Category checkboxes
  - Price range slider (Radix Slider, min/max from query results)
  - Brand checkboxes (extracted from results)
  - Rating filter (1–5 stars)
  - In Stock only toggle
  - "Clear all filters" link
- Product grid (right): same ProductCard grid
- Sort dropdown (top right): Newest, Price Low–High, Price High–Low, Best Rated, Best Selling
- Pagination (bottom)
- Empty state: "No results for '[query]'" with suggested categories and "Try searching for…" links

## Step 2 — Category Page: src/app/[locale]/category/[slug]/page.tsx
- Hero banner at top: category name, breadcrumb (Home > Women), product count
- Same filter sidebar + sort + product grid layout as search page
- "Load More" button with infinite scroll (use IntersectionObserver)
- Subcategory tabs below hero: e.g., for Women → Dresses | Tops | Jeans | Activewear

## Step 3 — Filter State Management
Create `src/store/filter-store.ts` using Zustand:
```typescript
interface FilterState {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: string;
  // actions...
  setFilter: (key: string, value: any) => void;
  clearFilters: () => void;
}
```
Use URL search params as the source of truth (sync filters to URL with `useRouter.push`).

## Step 4 — Wishlist Page: src/app/[locale]/wishlist/page.tsx
- If not logged in: show prompt to sign in with description "Save items for later"
- If logged in: show grid of wishlisted products
- Each card has an X button to remove from wishlist
- "Move to Cart" button on each card
- Empty state with illustration and "Start Browsing" button

## Step 5 — Update Header Wishlist Link
In `Header.tsx`, change the wishlist href from `"/"` to `"/wishlist"`.
```

---

## 🧪 FINAL INTEGRATION & TESTING CHECKLIST

> Provide this checklist to the GLM agent after all prompts are executed.

```markdown
# TASK: Final QA & Integration Testing Checklist

After implementing all previous prompts, verify the following:

## Functional Tests
- [ ] Homepage loads with real products from Prisma (not sampleProducts)
- [ ] Hero slider auto-advances and manual navigation works
- [ ] Clicking a ProductCard navigates to `/products/[id]`
- [ ] "Add to Cart" updates cart count in header
- [ ] Cart persists on page refresh (localStorage via Zustand persist)
- [ ] Coupon code "PERSONA10" applies 10% discount in cart
- [ ] Search bar navigates to `/search?q=...`
- [ ] Search results page renders with filters working
- [ ] `/auth/register` creates a new user in the database
- [ ] `/auth/login` authenticates and redirects to homepage
- [ ] `/account` redirects to login if not authenticated
- [ ] Checkout page shows correct cart total
- [ ] Stripe test payment (card: 4242 4242 4242 4242) completes successfully
- [ ] Order appears in `/admin/orders` after payment
- [ ] Admin dashboard stat cards show real numbers
- [ ] AR language switch changes layout to RTL direction
- [ ] Dark mode toggle works on all pages

## Performance Checks
- [ ] Run `bun run build` — zero TypeScript errors
- [ ] Run `bun run lint` — zero ESLint errors
- [ ] Lighthouse score on homepage > 85 (Performance), > 90 (Accessibility)
- [ ] No console errors in browser DevTools
- [ ] Images use Next.js `<Image>` with proper `sizes` props

## Security Checks
- [ ] Admin routes return 403 for non-admin users
- [ ] `/checkout` Stripe server route re-validates prices from database
- [ ] Webhook endpoint verifies Stripe signature
- [ ] All form inputs validated with Zod before database writes
- [ ] No `.env` variables exposed in client-side bundle
```

---

## 📌 ENVIRONMENT VARIABLES NEEDED

Add to `.env`:
```env
# Database
DATABASE_URL="file:./db/dev.db"

# NextAuth
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AI (for style assistant)
LLM_API_URL="https://api.kimi.moonshot.cn/v1/chat/completions"
LLM_API_KEY=""
LLM_MODEL="kimi-k2"

# Cloudinary (for product images)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

---

*Document generated by Claude Sonnet 4.6 | May 2026*
