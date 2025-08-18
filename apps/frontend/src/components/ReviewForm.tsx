import React, { useState } from 'react';
import { useReviewStore } from '@/stores/review.store';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
  const { createReview, isLoading } = useReviewStore();
  const { user } = useAuthStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to leave a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Review comment must be at least 10 characters long');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment: comment.trim()
      });
      setSuccess('Review submitted successfully');
      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Please log in to leave a review for this product.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Rating
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          <Button type="submit" disabled={isLoading || rating === 0}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
