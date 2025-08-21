import React, { useEffect } from 'react';
import { useOrderStore } from '@/stores/order.store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/format';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function AdminOrders() {
  const { orders, fetchOrders, isLoading, confirmOrder, cancelOrder } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <Link to="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map(order => {
                    const StatusIcon = statusIcons[order.status];
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{order.userId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}> 
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">View (comingg soon)</Button>
                          </Link>
                          {order.status === 'pending' && (
                            <Button variant="destructive" size="sm" className="ml-2" onClick={() => cancelOrder(order.id)}>
                              Cancel (coming soon)
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button variant="default" size="sm" className="ml-2" onClick={() => confirmOrder(order.id)}>
                              Confirm
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
