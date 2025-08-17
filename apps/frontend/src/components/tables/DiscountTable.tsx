/**
 * DiscountTable Component
 * Professional discount management table with enterprise features
 */

import React, { useMemo } from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../ui/DataTable';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/format';
import { discountUtils } from '../../hooks/useDiscounts';
import type { Discount } from '../../types';

interface DiscountTableProps {
  discounts: Discount[];
  loading?: boolean;
  onView?: (discount: Discount) => void;
  onEdit?: (discount: Discount) => void;
  onDelete?: (discount: Discount) => void;
}

export function DiscountTable({ 
  discounts, 
  loading = false, 
  onView, 
  onEdit, 
  onDelete 
}: DiscountTableProps) {
  const columns: ColumnDef<Discount>[] = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }: { row: { original: Discount } }) => (
        <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
          {row.original.code}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: { row: { original: Discount } }) => (
        <Badge 
          variant={row.original.type === 'percentage' ? 'info' : 'primary'}
          size="sm"
        >
          {row.original.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </Badge>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }: { row: { original: Discount } }) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {discountUtils.formatValue(row.original)}
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: { row: { original: Discount } }) => (
        <div className="max-w-xs truncate text-gray-600 dark:text-gray-400">
          {row.original.description || '—'}
        </div>
      ),
    },
    {
      accessorKey: 'minOrderAmount',
      header: 'Min. Order',
      cell: ({ row }: { row: { original: Discount } }) => (
        <div className="text-gray-600 dark:text-gray-400">
          {row.original.minOrderAmount ? formatCurrency(row.original.minOrderAmount) : '—'}
        </div>
      ),
    },
    {
      accessorKey: 'usedCount',
      header: 'Usage',
      cell: ({ row }: { row: { original: Discount } }) => {
        const discount = row.original;
        const hasLimit = discount.maxUses;
        const percentage = hasLimit ? (discount.usedCount / discount.maxUses!) * 100 : 0;
        
        return (
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {discount.usedCount} {hasLimit ? `/ ${discount.maxUses}` : ''}
            </div>
            {hasLimit && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all ${
                    percentage >= 100 ? 'bg-red-500' : 
                    percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Valid Period',
      cell: ({ row }: { row: { original: Discount } }) => {
        const discount = row.original;
        if (!discount.startDate && !discount.endDate) {
          return <span className="text-gray-500">No expiration</span>;
        }
        
        return (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {discount.startDate && (
              <div>From: {formatDate(discount.startDate)}</div>
            )}
            {discount.endDate && (
              <div>Until: {formatDate(discount.endDate)}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: { row: { original: Discount } }) => {
        const status = discountUtils.getStatus(row.original);
        const color = discountUtils.getStatusColor(row.original);
        
        return (
          <Badge variant={color} size="sm">
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Discount } }) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(row.original)}
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              title="View discount details"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="text-gray-600 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400"
              title="Edit discount"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.original)}
              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
              title="Delete discount"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ], [onView, onEdit, onDelete]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const active = discounts.filter(d => discountUtils.getStatus(d) === 'Active').length;
    const expired = discounts.filter(d => discountUtils.getStatus(d) === 'Expired').length;
    const totalUsed = discounts.reduce((sum, d) => sum + d.usedCount, 0);
    
    return { active, expired, totalUsed };
  }, [discounts]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No discounts
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first discount code.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.active}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300">
            Active Discounts
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.expired}
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            Expired Discounts
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalUsed}
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Total Uses
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={discounts}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search discount codes..."
        pagination={{ pageSize: 10, showSizeSelector: true }}
      />
    </div>
  );
}
