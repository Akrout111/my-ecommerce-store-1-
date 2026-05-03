"use client";

import { useState } from "react";
import { Star, Loader2, Check, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Please sign in to write a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "CONFLICT") {
          setError("You have already reviewed this product");
        } else if (data.details) {
          setError("Please check your input and try again");
        } else {
          setError(data.error || "Failed to submit review");
        }
        return;
      }

      setSuccess(true);
      setRating(0);
      setTitle("");
      setComment("");
      onSuccess?.();

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 text-center">
        <Check size={24} className="mx-auto mb-2 text-green-500" />
        <p className="text-sm font-medium text-green-600">
          Review submitted successfully!
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Thank you for sharing your experience.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition hover:scale-110"
            >
              <Star
                size={28}
                className={
                  s <= (hoverRating || rating)
                    ? "text-[#C9A96E]"
                    : "text-muted-foreground/30"
                }
                fill={
                  s <= (hoverRating || rating) ? "currentColor" : "none"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Title <span className="text-xs text-muted-foreground">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
          placeholder="Summarize your experience"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A96E]"
          placeholder="Share your experience with this product..."
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {comment.length}/1000
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full rounded-full bg-[#C9A96E] py-3 font-semibold text-[#0F0F0F] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
