/**
 * Orders Table Component
 * Professional table for order management with actions and status updates
 */

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../lib/utils';
import { DataTable } from '../ui/DataTable';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Order } from '../../types';
import { useOrders, useDeleteOrder, useConfirmOrder } from '../../hooks/useOrders';

interface OrdersTableProps {
  filters?: any;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedOrders: Order[]) => void;
}

export function OrdersTable({ 
  filters, 
  onView, 
  onEdit, 
  selectable = false,
  onSelectionChange 
}: OrdersTableProps) {
  const { data: orders = [], isLoading } = useOrders(filters);
  const deleteOrderMutation = useDeleteOrder();
  const confirmOrderMutation = useConfirmOrder();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'warning' as const, label: 'Pending' },
      confirmed: { variant: 'info' as const, label: 'Confirmed' },
      processing: { variant: 'info' as const, label: 'Processing' },
      shipped: { variant: 'success' as const, label: 'Shipped' },
      delivered: { variant: 'success' as const, label: 'Delivered' },
      cancelled: { variant: 'error' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'neutral' as const, 
      label: status 
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
          <span className="font-mono text-sm">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'user',
        header: 'Customer',
        cell: ({ row }) => {
          const user = row.original.user;
          return user ? (
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Unknown</span>
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: 'itemsCount',
        header: 'Items',
        cell: ({ row }) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {row.original.items?.length || 0} items
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const order = row.original;
          const canConfirm = order.status === 'pending';
          const canEdit = ['pending', 'confirmed'].includes(order.status);

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView?.(order)}
                className="h-8 w-8 p-0"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              
              {canEdit && onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(order)}
                  className="h-8 w-8 p-0"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}

              {canConfirm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmOrderMutation.mutate(order.id)}
                  disabled={confirmOrderMutation.isPending}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <CheckIcon className="h-4 w-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this order?')) {
                    deleteOrderMutation.mutate(order.id);
                  }
                }}
                disabled={deleteOrderMutation.isPending}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, deleteOrderMutation, confirmOrderMutation]
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      loading={isLoading}
      searchable
      searchPlaceholder="Search orders..."
      selectable={selectable}
      onSelectionChange={onSelectionChange}
      pagination={{
        pageSize: 10,
        showSizeSelector: true,
      }}
    />
  );
}
