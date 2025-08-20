import React, { useEffect } from 'react';
import { useReviewStore } from '@/stores/review.store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Star, Trash2, Edit } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, Settings, Home } from 'lucide-react';

export function AdminReviews() {
  const location = useLocation();
  const { reviews, fetchReviews, deleteReview, isLoading } = useReviewStore();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="space-y-6 pb-20">
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
      {/* Bottom Navigation Bar for Admin - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 flex justify-between items-center px-4 py-2 shadow-lg">
        <Link to="/admin" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname === '/admin' ? 'text-green-600' : ''}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs">Dashboard</span>
        </Link>
        <Link to="/admin/products" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname.startsWith('/admin/products') ? 'text-green-600' : ''}`}>
          <Package className="h-6 w-6" />
          <span className="text-xs">Products</span>
        </Link>
        <Link to="/admin/orders" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname.startsWith('/admin/orders') ? 'text-green-600' : ''}`}>
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs">Orders</span>
        </Link>
        <Link to="/admin/customers" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname.startsWith('/admin/customers') ? 'text-green-600' : ''}`}>
          <Users className="h-6 w-6" />
          <span className="text-xs">Customers</span>
        </Link>
        <Link to="/admin/discounts" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname.startsWith('/admin/discounts') ? 'text-green-600' : ''}`}>
          <DollarSign className="h-6 w-6" />
          <span className="text-xs">Discounts</span>
        </Link>
        <Link to="/admin/profile" className={`flex flex-col items-center text-gray-700 hover:text-green-600 ${location.pathname.startsWith('/admin/profile') ? 'text-green-600' : ''}`}>
          <Settings className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
