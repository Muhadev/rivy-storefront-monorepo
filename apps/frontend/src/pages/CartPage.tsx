import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useCartTotalPrice } from '@/stores/cart.store';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/utils/format';
import { useAuthStore } from '@/stores/auth.store';
import DiscountSection from '@/components/DiscountSection';
import { toast } from 'react-hot-toast';

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, fetchCart, updateCartItem, removeCartItem, clearCart } = useCartStore();
  const totalPrice = useCartTotalPrice();
  const [appliedDiscount, setAppliedDiscount] = React.useState<any>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeCartItem(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        toast.success('Cart cleared');
      } catch (error) {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Link to="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/products">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Add some products to get started.
            </p>
            <Link to="/products">
              <Button>
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                    {items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCart}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Cart
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 sm:p-6 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="h-20 w-20 sm:h-16 sm:w-16 flex-shrink-0 mb-2 sm:mb-0">
                          <img
                            src={item.product?.imageUrl || 'https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=200'}
                            alt={item.product?.name}
                            className="h-20 w-20 sm:h-16 sm:w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <div className="font-semibold text-gray-900 text-base sm:text-lg">{item.product?.name}</div>
                          <div className="text-gray-600 text-sm">{item.product?.description}</div>
                          <div className="text-lg font-semibold text-green-600">{formatPrice(item.product?.price || 0)}</div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-2 sm:mt-0">
                          <div className="flex items-center">
                            <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</Button>
                            <span className="mx-2 font-medium">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</Button>
                          </div>
                          <div className="text-right min-w-[5rem]">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatPrice((item.product?.price || 0) * item.quantity)}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleRemoveItem(item.productId)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Discount Section */}
              <DiscountSection 
                cartTotal={totalPrice}
                onDiscountApplied={setAppliedDiscount}
              />
              
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(appliedDiscount.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      {formatPrice((totalPrice - (appliedDiscount?.discountAmount || 0)) * 0.1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatPrice(
                          (totalPrice - (appliedDiscount?.discountAmount || 0)) * 1.1
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={isLoading || items.length === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-4 text-center">
                  <Link 
                    to="/products" 
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
