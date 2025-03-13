import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  bookingId: string;
  technicianId: string;
  clientId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  technicianId,
  clientId,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Submit review to database
      const { error } = await supabase.from("reviews").insert({
        booking_id: bookingId,
        technician_id: technicianId,
        client_id: clientId,
        rating,
        comment: comment.trim() || null,
      });

      if (error) throw error;

      // Update technician's average rating
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("technician_id", technicianId);

      if (reviewsError) throw reviewsError;

      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const averageRating = totalRating / reviews.length;

        const { error: updateError } = await supabase
          .from("technicians")
          .update({
            rating: averageRating,
            review_count: reviews.length,
          })
          .eq("id", technicianId);

        if (updateError) throw updateError;
      }

      // Update booking status to reviewed
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ status: "reviewed" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setRating(0);
      setComment("");

      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Rate your experience</h3>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-8 w-8 ${(hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0
              ? rating === 1
                ? "Poor"
                : rating === 2
                  ? "Fair"
                  : rating === 3
                    ? "Good"
                    : rating === 4
                      ? "Very Good"
                      : "Excellent"
              : "Select a rating"}
          </span>
        </div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Your comments (optional)
        </label>
        <Textarea
          id="comment"
          placeholder="Share your experience with this service..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="h-32"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || rating === 0}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
