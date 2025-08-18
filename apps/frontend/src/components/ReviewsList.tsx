import React, { useEffect, useState } from 'react';
import { useReviewStore } from '@/stores/review.store';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Separator } from '@/components/ui/Separator';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User, Edit, Trash2 } from 'lucide-react';

interface ReviewsListProps {
  productId: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId }) => {
  const {
    reviews,
    getProductReviews,
    getAverageRating,
    updateReview,
    deleteReview,
    isLoading
  } = useReviewStore();
  const { user } = useAuthStore();

  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

  const productReviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);

  useEffect(() => {
    // This will trigger loading if reviews aren't already loaded
    if (productReviews.length === 0 && !isLoading) {
      // The store will handle loading product reviews
    }
  }, [productId, productReviews.length, isLoading]);

    const handleEditStart = (reviewId: number, comment: string, rating: number) => {
    setEditingReview(reviewId);
    setEditComment(comment);
    setEditRating(rating);
  };

  const handleEditCancel = () => {
    setEditingReview(null);
    setEditComment('');
    setEditRating(0);
  };

  const handleEditSubmit = async (reviewId: number) => {
    try {
      await updateReview(reviewId, {
        comment: editComment.trim(),
        rating: editRating
      });
      setEditingReview(null);
      setEditComment('');
      setEditRating(0);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const userHasReviewed = user && productReviews.some(review => review.userId === user.id);

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Customer Reviews
            </span>
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} readonly size="sm" />
              <span className="text-sm text-muted-foreground">
                ({productReviews.length} review{productReviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StarRating rating={averageRating} readonly />
                  <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    out of 5 stars
                  </span>
                </div>
                {user && !userHasReviewed && (
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(!showForm)}
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {/* Reviews List */}
      {productReviews.length > 0 && (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingReview === review.id ? (
                        <StarRating
                          rating={editRating}
                          onRatingChange={setEditRating}
                          size="sm"
                        />
                      ) : (
                        <StarRating rating={review.rating} readonly size="sm" />
                      )}
                      {user && user.id === review.userId && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStart(review.id, review.comment, review.rating)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {editingReview === review.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-2 border rounded-md resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditSubmit(review.id)}
                          disabled={editComment.trim().length < 10 || editRating === 0}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Show review form for users who haven't reviewed yet */}
      {user && !userHasReviewed && !showForm && productReviews.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Share your experience with this product
              </p>
              <Button onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
