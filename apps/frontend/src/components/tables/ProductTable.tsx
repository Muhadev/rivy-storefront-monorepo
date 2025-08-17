/**
 * Product Table Component
 * Enterprise-grade product data table with inventory tracking and actions
 */

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  PhotoIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Product } from '../../types';

interface ProductTableProps {
  products: Product[];
  loading?: boolean;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onSelectionChange?: (products: Product[]) => void;
}

export function ProductTable({
  products,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSelectionChange,
}: ProductTableProps) {
  
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: 'error' as const, label: 'Out of Stock' };
    if (stock < 10) return { variant: 'warning' as const, label: 'Low Stock' };
    return { variant: 'success' as const, label: 'In Stock' };
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 80,
        cell: ({ row }) => (
          <span className="font-mono text-sm text-gray-500">
            #{row.original.id}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.imageUrl ? (
              <img 
                src={row.original.imageUrl} 
                alt={row.original.name}
                className="h-10 w-10 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <PhotoIcon 
              className={`h-10 w-10 text-gray-400 rounded-lg border-2 border-dashed border-gray-300 p-2 ${
                row.original.imageUrl ? 'hidden' : ''
              }`} 
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {row.original.name}
              </div>
              <div className="text-sm text-gray-500 line-clamp-1">
                {row.original.description}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        size: 140,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <TagIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm">
              {row.original.category?.name || 'Uncategorized'}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        size: 120,
        cell: ({ row }) => {
          const status = getStockStatus(row.original.stock);
          return (
            <div className="flex items-center gap-2">
              <CubeIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">
                {row.original.stock}
              </span>
              <Badge variant={status.variant} size="sm">
                {status.label}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        size: 140,
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="text-gray-900 dark:text-white">
              {formatDate(new Date(row.original.createdAt), {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
            <div className="text-gray-500">
              {formatDate(new Date(row.original.createdAt), {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(row.original)}
                className="h-8 w-8 p-0"
                title="View product details"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(row.original)}
                className="h-8 w-8 p-0"
                title="Edit product"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(row.original)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete product"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onView, onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      loading={loading}
      searchable
      searchPlaceholder="Search products..."
      selectable
      onSelectionChange={onSelectionChange}
      pagination={{
        pageSize: 10,
        showSizeSelector: true,
      }}
      className="rounded-lg border"
    />
  );
}
