'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters, ActiveFilterPills } from './SearchFilters';
import { ProductCard } from '@/components/products/ProductCard';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { Product } from '@/types/product';

interface SearchPageClientProps {
  query: string;
  initialProducts: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const ALL_CATEGORIES = ['Women', 'Men', 'Kids', 'Shoes', 'Accessories', 'Beauty'];
const ALL_BRANDS = ['Zara', 'H&M', 'Hugo Boss', 'Ralph Lauren', 'Nike', 'Mango', 'Aldo', 'Fossil', 'Michael Kors', 'The Ordinary', 'Fenty Beauty', 'Gap'];
const MAX_PRICE = 500;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'best-selling', label: 'Best Selling' },
];

export function SearchPageClient({ query, initialProducts, total, currentPage, totalPages }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const currentSort = searchParams.get('sort') || 'newest';

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[0] > 0 || priceRange[1] < MAX_PRICE ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const updateSort = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, MAX_PRICE]);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {query ? (
              <>
                Search results for &ldquo;{query}&rdquo;
              </>
            ) : (
              'All Products'
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <SearchFilters
            categories={ALL_CATEGORIES}
            brands={ALL_BRANDS}
            priceRange={priceRange}
            maxPrice={MAX_PRICE}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            minRating={minRating}
            inStockOnly={inStockOnly}
            onCategoryChange={setSelectedCategories}
            onBrandChange={setSelectedBrands}
            onPriceChange={setPriceRange}
            onRatingChange={setMinRating}
            onInStockChange={setInStockOnly}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort + Filter Pills */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <ActiveFilterPills
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                priceRange={priceRange}
                maxPrice={MAX_PRICE}
                minRating={minRating}
                inStockOnly={inStockOnly}
                onCategoryChange={setSelectedCategories}
                onBrandChange={setSelectedBrands}
                onPriceChange={setPriceRange}
                onRatingChange={setMinRating}
                onInStockChange={setInStockOnly}
                onClearAll={clearAllFilters}
              />
              <select
                value={currentSort}
                onChange={(e) => updateSort(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Product Grid */}
            {initialProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {initialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h2 className="text-lg font-semibold mb-2">No products found</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or browse our categories.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('category', cat.toLowerCase());
                        router.push(`/search?${params.toString()}`);
                      }}
                      className="rounded-full border border-[#C9A96E]/30 px-4 py-2 text-sm text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', String(currentPage - 1));
                    router.push(`/search?${params.toString()}`);
                  }}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-accent disabled:opacity-50"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('page', String(currentPage + 1));
                    router.push(`/search?${params.toString()}`);
                  }}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-accent disabled:opacity-50"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
