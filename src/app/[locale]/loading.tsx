import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';

function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full animate-pulse bg-muted/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-12 w-80 rounded bg-muted" />
        <div className="h-5 w-64 rounded bg-muted" />
        <div className="h-12 w-36 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function CategoryGridSkeleton() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductSectionSkeleton() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DealsSkeleton() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BannerSkeleton() {
  return (
    <div className="h-32 w-full animate-pulse bg-muted/20" />
  );
}

function NewsletterSkeleton() {
  return (
    <div className="h-48 w-full animate-pulse bg-muted/20" />
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <CategoryGridSkeleton />
      <ProductSectionSkeleton />
      <DealsSkeleton />
      <BannerSkeleton />
      <ProductSectionSkeleton />
      <BannerSkeleton />
      <ProductSectionSkeleton />
      <BannerSkeleton />
      <NewsletterSkeleton />
    </div>
  );
}
