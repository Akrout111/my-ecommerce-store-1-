"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { ReviewForm } from "./ReviewForm";

interface ReviewListProps {
  productId: string;
  productRating: number;
  productReviewCount: number;
}

interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{ stars: number; count: number; percent: number }>;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  userName: string;
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const fill = Math.min(Math.max(rating - s + 1, 0), 1);
        return (
          <div key={s} style={{ width: size, height: size }} className="relative">
            <Star
              size={size}
              className="absolute text-muted-foreground/20"
              fill="currentColor"
            />
            <div
              className="absolute overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-[#C9A96E]"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RatingBar({
  stars,
  count,
  percent,
}: {
  stars: number;
  count: number;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-xs text-muted-foreground">{stars}</span>
      <Star size={12} className="text-[#C9A96E]" fill="currentColor" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[#C9A96E] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-12 text-right text-xs text-muted-foreground">
        {count} ({percent}%)
      </span>
    </div>
  );
}

export function ReviewList({
  productId,
  productRating,
  productReviewCount,
}: ReviewListProps) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const limit = 5;

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["review-summary", productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/reviews/summary`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      const json = await res.json();
      return json.data as ReviewSummary;
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading, refetch } = useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const json = await res.json();
      return {
        reviews: json.data.reviews as Review[],
        meta: json.meta as { page: number; limit: number; total: number; totalPages: number },
      };
    },
  });

  const summary = summaryData;
  const reviews = reviewsData?.reviews || [];
  const meta = reviewsData?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Rating Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        {summaryLoading ? (
          <div className="space-y-3">
            <div className="mx-auto h-10 w-16 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-5xl font-bold">
                {summary?.averageRating ?? productRating}
              </span>
              <p className="text-xs text-muted-foreground">out of 5</p>
              <div className="mt-1 flex justify-center">
                <StarRating
                  rating={summary?.averageRating ?? productRating}
                  size={20}
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on{" "}
                {summary?.totalReviews ?? productReviewCount} reviews
              </p>
            </div>
            <div className="mt-4 space-y-1.5">
              {(summary?.distribution || []).map((r) => (
                <RatingBar
                  key={r.stars}
                  stars={r.stars}
                  count={r.count}
                  percent={r.percent}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C9A96E]/10 text-sm font-bold text-[#C9A96E]">
                  {review.userName[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{review.userName}</span>
                      {review.isVerified && (
                        <span className="ml-2 text-[10px] text-green-500">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {review.title && (
                    <p className="mt-1 text-sm font-semibold">{review.title}</p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-full border p-2 transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-full border p-2 transition hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Write a Review Button / Form */}
        {showForm ? (
          <div className="rounded-xl border border-[#C9A96E]/30 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-bold">Write a Review</h4>
              <button
                onClick={() => setShowForm(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
            <ReviewForm
              productId={productId}
              onSuccess={() => {
                refetch();
                setShowForm(false);
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full border border-[#C9A96E] px-6 py-2.5 text-sm font-medium text-[#C9A96E] transition hover:bg-[#C9A96E] hover:text-[#0F0F0F]"
          >
            Write a Review
          </button>
        )}
      </div>
    </div>
  );
}
