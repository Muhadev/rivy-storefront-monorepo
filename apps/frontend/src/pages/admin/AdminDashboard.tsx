import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle, Star, Settings, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminApi } from '@/repositories/admin.repository';

export function AdminDashboard() {
  const location = useLocation();

  // Pagination state for recent orders
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 5;

  // Pagination state for low stock products
  const [stockPage, setStockPage] = useState(1);
  const stockPerPage = 5;

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardSummary,
  });

  // Fix stats to use correct dashboardData fields
  const stats = [
    {
      name: 'Total Products',
      value: dashboardData?.stats?.totalProducts ?? 0,
      icon: Package,
    },
    {
      name: 'Total Orders',
      value: dashboardData?.stats?.totalOrders ?? 0,
      icon: ShoppingCart,
    },
    {
      name: 'Total Customers',
      value: dashboardData?.stats?.totalCustomers ?? 0,
      icon: Users,
    },
    {
      name: 'Discounts',
      value: dashboardData?.stats?.totalDiscounts ?? 0,
      icon: DollarSign,
    },
    {
      name: 'Reviews',
      value: dashboardData?.stats?.totalReviews ?? 0,
      icon: Star,
    },
  ];

  // Use correct data fields for recent orders and low stock products
  const recentOrders = dashboardData?.recentOrders ?? [];
  const lowStockProducts = dashboardData?.lowStockProducts ?? [];

  // Pagination logic for orders
  const paginatedOrders = recentOrders.slice((orderPage - 1) * ordersPerPage, orderPage * ordersPerPage);
  const orderTotalPages = Math.ceil(recentOrders.length / ordersPerPage);

  // Pagination logic for low stock products
  const paginatedStock = lowStockProducts.slice((stockPage - 1) * stockPerPage, stockPage * stockPerPage);
  const stockTotalPages = Math.ceil(lowStockProducts.length / stockPerPage);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading dashboard: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {/* Stats Grid - responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +5%
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/orders">
              {/* <Button variant="outline" size="sm">
                View All
              </Button> */}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedOrders.map((order: any) => (
                <div key={order.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">Order No{order.id}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                    <p className="text-xs text-gray-500">{order.createdAt}</p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="font-medium text-gray-900">${order.total}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination for orders */}
            {orderTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage === 1}
                  onClick={() => setOrderPage(orderPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {orderPage} of {orderTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={orderPage === orderTotalPages}
                  onClick={() => setOrderPage(orderPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alert
            </CardTitle>
            <Link to="/products">
              {/* <Button variant="outline" size="sm">
                Manage Stock
              </Button> */}
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedStock.map((item: any) => (
                <div key={item.product?.id || item.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name ?? item.name}</p>
                    <p className="text-sm text-gray-600">Threshold: 5 units</p>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {item.product?.stock ?? item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination for low stock products */}
            {stockTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={stockPage === 1}
                  onClick={() => setStockPage(stockPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {stockPage} of {stockTotalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={stockPage === stockTotalPages}
                  onClick={() => setStockPage(stockPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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