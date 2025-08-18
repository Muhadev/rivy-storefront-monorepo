import React, { useEffect } from 'react';
import { useReviewStore } from '@/stores/review.store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Star, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminReviews() {
  const { reviews, fetchReviews, deleteReview, isLoading } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <Link to="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center">Loading...</div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center">No reviews found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map(review => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{review.product?.name || review.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{review.user?.name || review.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          <Star className="h-4 w-4 mr-1" />
                          {review.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{review.comment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => deleteReview(review.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* Optionally add edit functionality here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
