# Persona Fashion

> **Fashion Reimagined — Your Style. Your Story. Your Persona.**

Persona Fashion is a luxury e-commerce store built with modern web technologies, featuring full English/Arabic RTL support, a real-time style assistant, and a seamless checkout experience powered by Stripe.

---

## Tech Stack

| Technology       | Version | Purpose                              |
| ---------------- | ------- | ------------------------------------ |
| Next.js          | 16      | React framework with App Router      |
| React            | 19      | UI library                           |
| TypeScript       | 5       | Type-safe JavaScript                 |
| Tailwind CSS     | 4       | Utility-first CSS framework          |
| shadcn/ui        | —       | Accessible component library         |
| Prisma           | 6       | ORM for SQLite (pluggable to others) |
| NextAuth.js      | 4       | Authentication (credentials + OAuth) |
| Stripe           | 22      | Payment processing                   |
| Zustand          | 5       | Client-side state management         |
| next-intl        | 4       | Internationalization (en/ar RTL)     |
| Vitest           | 4       | Testing framework                    |
| Framer Motion    | 12      | Animations & transitions             |
| Cloudinary       | 2       | Image upload & management            |
| Docker           | —       | Containerization                     |

---

## Prerequisites

- **Node.js** 20+
- **Bun** (recommended) or npm/yarn
- **SQLite** (included — no separate installation needed)

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Akrout111/my-ecommerce-store-1-.git
cd my-ecommerce-store-1-

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env   # Then fill in your values

# Initialize the database
bun run db:push
bun run db:generate

# Seed the database with sample data (optional)
bun run db:migrate

# Start the development server
bun run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable                            | Required | Description                                        |
| ----------------------------------- | -------- | -------------------------------------------------- |
| `DATABASE_URL`                      | Yes      | SQLite connection string (e.g. `file:./dev.db`)    |
| `NEXTAUTH_SECRET`                   | Yes      | Secret for NextAuth.js session encryption           |
| `NEXT_PUBLIC_APP_URL`               | Yes      | Public URL of the application                       |
| `GOOGLE_CLIENT_ID`                  | No       | Google OAuth client ID                              |
| `GOOGLE_CLIENT_SECRET`              | No       | Google OAuth client secret                          |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No       | Cloudinary cloud name for image uploads             |
| `CLOUDINARY_API_KEY`                | No       | Cloudinary API key                                  |
| `CLOUDINARY_API_SECRET`             | No       | Cloudinary API secret                               |
| `STRIPE_SECRET_KEY`                 | Yes      | Stripe secret key for payments                      |
| `STRIPE_WEBHOOK_SECRET`             | Yes      | Stripe webhook signing secret                       |
| `LLM_API_URL`                       | No       | LLM API endpoint for AI style assistant             |
| `LLM_API_KEY`                       | No       | API key for LLM service                             |
| `LLM_MODEL`                         | No       | LLM model name (default: `moonshot-v1-8k`)          |

---

## Project Structure

```
├── .github/workflows/     # CI/CD pipelines (GitHub Actions)
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample data seeder
├── public/
│   ├── categories/        # Category images
│   ├── images/            # Optimized product & hero images
│   ├── products/          # Product images
│   ├── icons/             # PWA icons
│   ├── logo.svg           # Brand logo
│   └── manifest.json      # PWA manifest
├── src/
│   ├── app/
│   │   ├── [locale]/      # Locale-aware pages (en, ar)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── layout.tsx       # Root layout with providers
│   │   │   ├── products/[id]/   # Product detail page
│   │   │   ├── search/          # Search & filter page
│   │   │   ├── checkout/        # Checkout flow
│   │   │   ├── wishlist/        # User wishlist
│   │   │   ├── account/         # Account dashboard
│   │   │   ├── auth/            # Login & register
│   │   │   └── admin/           # Admin panel
│   │   ├── api/
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── products/        # Product CRUD
│   │   │   ├── categories/      # Category listing
│   │   │   ├── deals/           # Deals & promotions
│   │   │   ├── cart/            # Server-side cart
│   │   │   ├── search/          # Search endpoint
│   │   │   ├── checkout/        # Stripe payment intents & webhooks
│   │   │   ├── coupons/         # Coupon validation
│   │   │   ├── health/          # Health check endpoints
│   │   │   ├── upload/          # Cloudinary image upload
│   │   │   └── admin/           # Admin-only endpoints
│   │   ├── globals.css          # Global styles & keyframes
│   │   ├── layout.tsx           # Root HTML layout
│   │   └── page.tsx             # Locale redirect
│   ├── components/
│   │   ├── home/          # Homepage sections (Hero, Categories, Products)
│   │   ├── products/      # Product cards, galleries, badges
│   │   ├── cart/          # Cart sheet, items, summary
│   │   ├── checkout/      # Multi-step checkout flow
│   │   ├── layout/        # Header, Navbar, Footer, SearchBar
│   │   ├── search/        # Search filters & results
│   │   ├── admin/         # Admin dashboard & management
│   │   ├── account/       # Account dashboard tabs
│   │   ├── auth/          # Login & register forms
│   │   ├── deals/         # Deal cards, countdown timers
│   │   ├── categories/    # Category navigation & cards
│   │   ├── ai/            # AI style assistant
│   │   ├── shared/        # Loading, error, skeleton components
│   │   ├── ecommerce/     # Language provider & legacy components
│   │   ├── seo/           # JSON-LD structured data
│   │   └── ui/            # shadcn/ui primitives
│   ├── hooks/             # Custom React hooks
│   ├── i18n/              # Internationalization config & translations
│   │   ├── config.ts            # Locale definitions
│   │   ├── get-dictionary.ts    # Server-side dictionary loader
│   │   └── locales/             # en & ar translation JSON files
│   ├── lib/               # Utilities & services
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # Prisma client singleton
│   │   ├── stripe.ts            # Stripe client
│   │   ├── cloudinary.ts        # Cloudinary upload utility
│   │   ├── rate-limit.ts        # IP-based rate limiter
│   │   ├── api-response.ts      # Standardized API responses
│   │   ├── coupon-service.ts    # Server-side coupon validation
│   │   ├── constants.ts         # App-wide constants
│   │   └── utils/               # JSON parsing & shared utilities
│   ├── store/             # Zustand state stores (cart, wishlist, language)
│   └── types/             # TypeScript type definitions
├── Dockerfile             # Multi-stage Docker build
├── docker-compose.yml     # Docker Compose configuration
├── vitest.config.ts       # Test configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Available Scripts

| Script              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `bun run dev`       | Start development server on port 3000           |
| `bun run build`     | Create production build (standalone output)     |
| `bun run start`     | Start production server                         |
| `bun run lint`      | Run ESLint to check code quality                |
| `bun run type-check`| Run TypeScript compiler for type checking       |
| `bun run test`      | Run all tests with Vitest                       |
| `bun run test:watch`| Run tests in watch mode                         |
| `bun run test:coverage` | Run tests with coverage report              |
| `bun run db:push`   | Push Prisma schema to database                  |
| `bun run db:generate`| Generate Prisma client                         |
| `bun run db:migrate`| Run database migrations (dev)                   |
| `bun run db:reset`  | Reset database and re-apply migrations          |
| `bun run db:migrate:dev`  | Create a new migration                    |
| `bun run db:migrate:prod` | Apply pending migrations in production   |
| `bun run db:seed:prod`    | Seed database in production                |
| `bun run docker:build`    | Build Docker image                        |
| `bun run docker:up`       | Start containers with Docker Compose     |

---

## API Overview

### Authentication

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| POST   | `/api/auth/register`           | Register a new user            |
| GET    | `/api/auth/[...nextauth]`      | NextAuth.js session            |
| POST   | `/api/auth/[...nextauth]`      | NextAuth.js sign in            |

### Products & Catalog

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| GET    | `/api/products`         | List products (filter, sort, paginate)   |
| GET    | `/api/categories`       | List all categories                      |
| GET    | `/api/deals`            | List active deals & promotions           |
| GET    | `/api/search`           | Full-text product search                 |
| GET    | `/api/cart`             | Get server-side cart                     |

### Admin (requires admin role)

| Method | Endpoint                     | Description                      |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/admin/products`        | List all products (admin)        |
| POST   | `/api/admin/products`        | Create a new product             |
| PUT    | `/api/admin/products/[id]`   | Update a product                 |
| DELETE | `/api/admin/products/[id]`   | Delete a product                 |
| GET    | `/api/admin/orders`          | List all orders                  |
| GET    | `/api/admin/orders/[id]`     | Get order details                |
| PATCH  | `/api/admin/orders/[id]`     | Update order status              |
| GET    | `/api/admin/analytics`       | Get store analytics data         |

### Checkout & Payments

| Method | Endpoint                                | Description                        |
| ------ | --------------------------------------- | ---------------------------------- |
| POST   | `/api/checkout/create-payment-intent`   | Create a Stripe payment intent     |
| POST   | `/api/checkout/webhook`                 | Stripe webhook handler             |
| POST   | `/api/coupons/validate`                 | Validate a coupon code             |

### Health & Monitoring

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| GET    | `/api/health`     | Application health check        |
| GET    | `/api/health/db`  | Database connectivity check     |

---

## Testing

The project uses **Vitest** with `@testing-library/react` and `jsdom`:

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Generate coverage report
bun run test:coverage
```

Test files are located in `src/__tests__/` and are organized by:
- `api/` — API route tests (auth, checkout, register)
- `lib/` — Utility tests (rate-limit)
- `store/` — Zustand store tests (cart-store)
- `infrastructure.test.ts` — Basic infrastructure validation

---

## Internationalization

Persona Fashion supports **English** and **Arabic (RTL)** using a dual-layer i18n approach:

1. **next-intl** — Server-side locale routing via middleware. URLs are prefixed with `/en` or `/ar`. The middleware handles redirects and locale detection.

2. **LanguageProvider** — Client-side context that wraps the app, providing:
   - `t(key)` — Translation function with dot-notation keys (e.g., `t("cart.title")`)
   - `isRTL` / `dir` — Direction awareness for layout switching
   - `formatCurrency()` / `formatNumber()` / `formatDate()` — Locale-aware formatters
   - `toggleLanguage()` — Switch between English and Arabic

3. **Zustand language-store** — Persists the user's language preference to localStorage, synced with the next-intl middleware.

Translation files are located at:
- `src/i18n/locales/en/translation.json`
- `src/i18n/locales/ar/translation.json`

Adding a new locale:
1. Add the locale to `src/i18n/config.ts` and `src/lib/constants.ts`
2. Create a new translation file in `src/i18n/locales/<locale>/translation.json`
3. Update the middleware matcher in `src/middleware.ts`

---

## Deployment

### Docker (Recommended)

```bash
# Build the Docker image
bun run docker:build

# Start the container
bun run docker:up
```

The Docker setup uses:
- **Multi-stage build** — Deps → Build → Runner (minimal final image)
- **Standalone output** — Next.js standalone server for smaller images
- **Non-root user** — Security best practice
- **Named volume** — Persistent SQLite database storage

### Manual Deployment

1. Build the application: `bun run build`
2. Run database migrations: `bun run db:migrate:prod`
3. Seed the database (first time): `bun run db:seed:prod`
4. Start the server: `bun run start`

### CI/CD

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR to `main`:
- **lint** — ESLint checks
- **type-check** — TypeScript compilation
- **test** — Vitest test suite
- **build** — Next.js production build (depends on lint + type-check passing)

---

## License

This project is licensed under the **MIT License**.
