import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const stats = [
  {
    name: 'Total Products',
    value: '128',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Package,
  },
  {
    name: 'Total Orders',
    value: '2,847',
    change: '+18%',
    changeType: 'positive' as const,
    icon: ShoppingCart,
  },
  {
    name: 'Total Customers',
    value: '1,429',
    change: '+8%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    name: 'Revenue',
    value: '$89,420',
    change: '+23%',
    changeType: 'positive' as const,
    icon: DollarSign,
  },
];

const recentOrders = [
  { id: '1001', customer: 'John Doe', amount: '$299.99', status: 'pending', date: '2025-08-18' },
  { id: '1002', customer: 'Jane Smith', amount: '$899.99', status: 'shipped', date: '2025-08-18' },
  { id: '1003', customer: 'Bob Johnson', amount: '$149.99', status: 'delivered', date: '2025-08-17' },
  { id: '1004', customer: 'Alice Brown', amount: '$599.99', status: 'pending', date: '2025-08-17' },
];

const lowStockProducts = [
  { id: 1, name: 'High-Efficiency Solar Panel', stock: 2, threshold: 10 },
  { id: 2, name: 'Lithium Battery Pack', stock: 1, threshold: 5 },
  { id: 3, name: 'Smart Inverter', stock: 3, threshold: 8 },
];

export function AdminDashboard() {
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
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        {stat.change}
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
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
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
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Threshold: {product.threshold} units</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {product.stock} left
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
