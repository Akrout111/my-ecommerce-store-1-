"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  Star,
} from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Sheet from "@radix-ui/react-dialog";

interface SearchFiltersProps {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  maxPrice: number;
  selectedCategories: string[];
  selectedBrands: string[];
  minRating: number;
  inStockOnly: boolean;
  onCategoryChange: (cats: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onInStockChange: (v: boolean) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

function CustomCheckbox({
  checked,
  onCheckedChange,
  label,
  count,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="flex h-4 w-4 items-center justify-center rounded border border-[#C9A96E] transition data-[state=checked]:bg-[#C9A96E]"
      >
        <Checkbox.Indicator>
          <Check size={12} className="text-[#0F0F0F]" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="flex-1 text-sm">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </label>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.div>
      </Collapsible.Trigger>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Collapsible.Root>
  );
}

export function SearchFilters({
  categories,
  brands,
  priceRange,
  maxPrice,
  selectedCategories,
  selectedBrands,
  minRating,
  inStockOnly,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onClearAll,
  activeFilterCount,
}: SearchFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsExpanded, setBrandsExpanded] = useState(false);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      onCategoryChange(selectedCategories.filter((c) => c !== cat));
    } else {
      onCategoryChange([...selectedCategories, cat]);
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const displayedBrands = brandsExpanded ? brands : brands.slice(0, 6);

  const FilterContent = () => (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#C9A96E] px-2 py-0.5 text-xs font-medium text-[#0F0F0F]">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-[#C9A96E] transition hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <hr className="border-border" />

      {/* Categories */}
      {categories.length > 1 && (
        <FilterSection title="Category">
          <div className="space-y-0.5">
            {categories.map((cat, idx) => (
              <CustomCheckbox
                key={cat}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
                label={cat}
                count={idx * 3 + 5}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <hr className="border-border" />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <p className="mb-3 text-sm font-medium">
            ${priceRange[0]} — ${priceRange[1]}
          </p>
          <Slider.Root
            value={priceRange}
            onValueChange={(v) => onPriceChange(v as [number, number])}
            max={maxPrice}
            step={5}
            minStepsBetweenThumbs={1}
            className="relative flex h-5 w-full touch-none items-center"
          >
            <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
              <Slider.Range className="absolute h-full bg-[#C9A96E]" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-5 w-5 rounded-full border-2 border-white bg-[#C9A96E] shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
              aria-label="Min price"
            />
            <Slider.Thumb
              className="block h-5 w-5 rounded-full border-2 border-white bg-[#C9A96E] shadow-md transition focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/50"
              aria-label="Max price"
            />
          </Slider.Root>
        </div>
      </FilterSection>

      <hr className="border-border" />

      {/* Brands */}
      <FilterSection title="Brands">
        <div className="space-y-0.5">
          {displayedBrands.map((brand, idx) => (
            <CustomCheckbox
              key={brand}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
              label={brand}
              count={idx * 2 + 8}
            />
          ))}
          {brands.length > 6 && (
            <button
              onClick={() => setBrandsExpanded(!brandsExpanded)}
              className="mt-1 text-xs text-[#C9A96E] transition hover:underline"
            >
              {brandsExpanded ? "Show less" : `Show more (${brands.length - 6})`}
            </button>
          )}
        </div>
      </FilterSection>

      <hr className="border-border" />

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? 0 : stars)}
              className={`flex w-full items-center gap-1 py-1 text-sm transition ${
                minRating === stars
                  ? "font-medium text-[#C9A96E]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-[#C9A96E]"
                    fill="currentColor"
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <hr className="border-border" />

      {/* Availability */}
      <FilterSection title="Availability">
        <button
          onClick={() => onInStockChange(!inStockOnly)}
          className="flex w-full items-center justify-between py-1"
        >
          <span className="text-sm">In Stock Only</span>
          <div
            className={`relative h-6 w-11 rounded-full transition-colors ${
              inStockOnly ? "bg-[#C9A96E]" : "bg-muted"
            }`}
          >
            <motion.div
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
              animate={{ left: inStockOnly ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </button>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-accent"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#C9A96E] px-1.5 py-0.5 text-xs font-medium text-[#0F0F0F]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <Sheet.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Sheet.Portal>
            <Sheet.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <Sheet.Content className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-background p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <Sheet.Close className="rounded-full p-1 transition hover:bg-muted">
                  <X size={20} />
                </Sheet.Close>
              </div>
              <FilterContent />
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet.Root>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start lg:w-[260px]">
        <FilterContent />
      </aside>
    </>
  );
}

export function ActiveFilterPills({
  selectedCategories,
  selectedBrands,
  priceRange,
  maxPrice,
  minRating,
  inStockOnly,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onRatingChange,
  onInStockChange,
  onClearAll,
}: {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onCategoryChange: (cats: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onInStockChange: (v: boolean) => void;
  onClearAll: () => void;
}) {
  const pills: { label: string; onRemove: () => void }[] = [];

  selectedCategories.forEach((cat) => {
    pills.push({
      label: cat,
      onRemove: () =>
        onCategoryChange(selectedCategories.filter((c) => c !== cat)),
    });
  });

  selectedBrands.forEach((brand) => {
    pills.push({
      label: brand,
      onRemove: () => onBrandChange(selectedBrands.filter((b) => b !== brand)),
    });
  });

  if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
    pills.push({
      label: `$${priceRange[0]} - $${priceRange[1]}`,
      onRemove: () => onPriceChange([0, maxPrice]),
    });
  }

  if (minRating > 0) {
    pills.push({
      label: `${minRating}+ Stars`,
      onRemove: () => onRatingChange(0),
    });
  }

  if (inStockOnly) {
    pills.push({
      label: "In Stock",
      onRemove: () => onInStockChange(false),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((pill, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 px-3 py-1 text-xs text-[#C9A96E]"
        >
          {pill.label}
          <button
            onClick={pill.onRemove}
            className="ml-0.5 rounded-full p-0.5 transition hover:bg-[#C9A96E]/20"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground underline-offset-2 transition hover:text-[#C9A96E] hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
