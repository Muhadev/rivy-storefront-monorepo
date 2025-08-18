import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Product } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/utils/format';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart successfully!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl || 'https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleViewDetails}
            className="bg-white/90 hover:bg-white text-gray-900"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {!isOutOfStock && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2"
          >
            Out of Stock
          </Badge>
        )}
        {isLowStock && (
          <Badge
            variant="warning"
            className="absolute top-2 right-2"
          >
            Low Stock
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
          <Link to={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating & Reviews */}
        {product.averageRating && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.averageRating!)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-gray-500">
              {product.stock} in stock
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewDetails}
              className="text-xs px-2 py-1"
            >
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
            
            {!isOutOfStock && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddToCart}
                className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}