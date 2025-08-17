/**
 * Admin Dashboard
 * Main dashboard with analytics and overview
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { PageLoading } from '../../components/ui/Loading';
import { 
  ShoppingBagIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { adminText } from '../../config/admin';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { useDashboardData } from '../../hooks/useDashboard';

export function AdminDashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <PageLoading message={adminText.common.loading} />;
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{adminText.common.error}</p>
      </div>
    );
  }

  const { stats, recentOrders, topProducts } = dashboardData;

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <span className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {adminText.dashboard.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {adminText.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={adminText.dashboard.stats.products}
          value={stats.totalProducts}
          icon={ShoppingBagIcon}
          change={12}
        />
        <StatCard
          title={adminText.dashboard.stats.customers}
          value={stats.totalCustomers.toLocaleString()}
          icon={UsersIcon}
          change={8}
        />
        <StatCard
          title={adminText.dashboard.stats.orders}
          value={stats.totalOrders}
          icon={ClipboardDocumentListIcon}
          change={-3}
        />
        <StatCard
          title={adminText.dashboard.stats.revenue}
          value={formatCurrency(stats.totalRevenue)}
          icon={CurrencyDollarIcon}
          change={15}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle level={3}>{adminText.dashboard.sections.recentOrders}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.amount)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatRelativeTime(new Date(order.date))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {adminText.common.noData}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle level={3}>{adminText.dashboard.sections.topProducts}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sales</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  {adminText.common.noData}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
