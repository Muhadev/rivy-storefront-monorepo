import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '@/stores/order.store';
import { useAuthStore } from '@/stores/auth.store';
import { Package, Calendar, MapPin, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatPrice } from '@/utils/format';
import { Order } from '@/types/api';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'processing': return <Package className="h-4 w-4" />;
    case 'shipped': return <Truck className="h-4 w-4" />;
    case 'delivered': return <CheckCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'shipped': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
          <Button asChild>
            <Link to="/auth/login">Login</Link>
          </Button>
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              When you place your first order, it will appear here.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={`inline-flex items-center ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-1 capitalize">{order.status}</span>
          </Badge>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(order.total)}
            </div>
            <div className="text-sm text-gray-600">
              Order Total
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-600">
          <p className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Delivery Address: {order.address}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
          <Package className="h-4 w-4 mr-1" />
          Order ID: {order.id}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/orders/${order.id}`}>
              View Details
            </Link>
          </Button>
          
          {order.status === 'pending' && (
            <Button variant="destructive" size="sm">
              Cancel Order
            </Button>
          )}
          
          {order.status === 'delivered' && (
            <Button variant="outline" size="sm">
              Reorder
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
