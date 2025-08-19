
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertCircle, Plus, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminApi } from '@/repositories/admin.repository';

export function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.getDashboardData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Stats
  const stats = [
    {
      name: 'Total Products',
      value: dashboardData?.stats.totalProducts || 0,
      icon: Package,
    },
    {
      name: 'Total Orders',
      value: dashboardData?.stats.totalOrders || 0,
      icon: ShoppingCart,
    },
    {
      name: 'Total Customers',
      value: dashboardData?.stats.totalCustomers || 0,
      icon: Users,
    },
    {
      name: 'Discounts',
      value: dashboardData?.stats.totalDiscounts || 0,
      icon: DollarSign,
    },
    {
      name: 'Reviews',
      value: dashboardData?.stats.totalReviews || 0,
      icon: Star,
    },
  ];

  // Recent Orders
  const recentOrders = dashboardData?.recentOrders || [];

  // Low Stock Products
  const lowStockProducts = dashboardData?.lowStockProducts || [];

  // Stats queries (products and orders)
  // Optional: you can hydrate separate charts
  // const { data: productStats } = useQuery({ queryKey: ['admin-product-stats'], queryFn: adminApi.getProductStats });
  // const { data: orderStats } = useQuery({ queryKey: ['admin-order-stats'], queryFn: adminApi.getOrderStats });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Button>
          </Link>
          <Link to="/admin/reviews">
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </Button>
          </Link>
          <Link to="/admin/discounts">
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Discounts
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                        {/* For demo, show +% */}
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
            <Link to="/admin/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.address}</p>
                    <p className="text-xs text-gray-500">{order.createdAt}</p>
                  </div>
                  <div className="text-right">
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
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alert
            </CardTitle>
            <Link to="/admin/products">
              <Button variant="outline" size="sm">
                Manage Stock
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((item) => (
                <div key={item.product?.id || item.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                    <p className="text-sm text-gray-600">Threshold: 5 units</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {item.product?.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
