import React from 'react';
import { Star, ShoppingCart, X } from 'lucide-react';
import { Product, Review } from '@/types/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/utils/format';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import ReviewsList from '@/components/ReviewsList';
import { toast } from 'react-hot-toast';

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsModal({ product, open, onOpenChange }: ProductDetailsModalProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      className="max-w-4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-50">
          <img
            src={product.imageUrl || 'https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          {/* Category */}
          {product.category && (
            <Badge variant="secondary">
              {product.category.name}
            </Badge>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900">
            {product.name}
          </h2>

          {/* Rating & Reviews */}
          {product.averageRating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating!)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageRating.toFixed(1)} ({product.reviewCount || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            
            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="warning">Only {product.stock} left</Badge>
              ) : (
                <Badge variant="success">{product.stock} in stock</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="pt-4">
            {!isOutOfStock ? (
              <Button
                onClick={handleAddToCart}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            ) : (
              <Button disabled className="w-full" size="lg">
                Out of Stock
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <ReviewsList productId={product.id} />
      </div>
    </Modal>
  );
}