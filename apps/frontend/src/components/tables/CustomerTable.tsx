/**
 * Customer Table Component
 * Enterprise-grade customer data table with actions and filtering
 */

import React, { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import { User } from '../../types';

interface CustomerTableProps {
  customers: User[];
  loading?: boolean;
  onView?: (customer: User) => void;
  onEdit?: (customer: User) => void;
  onDelete?: (customer: User) => void;
  onSelectionChange?: (customers: User[]) => void;
}

export function CustomerTable({
  customers,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onSelectionChange,
}: CustomerTableProps) {
  
  const getRoleBadgeProps = (role: string) => {
    const configs = {
      admin: { variant: 'error' as const, label: 'Admin', icon: ShieldCheckIcon },
      customer: { variant: 'primary' as const, label: 'Customer', icon: UserCircleIcon },
    } as const;
    
    return configs[role as keyof typeof configs] || configs.customer;
  };

  const columns = useMemo<ColumnDef<User>[]>(
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
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {row.original.name}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <EnvelopeIcon className="h-3 w-3" />
                {row.original.email}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 120,
        cell: ({ row }) => {
          const config = getRoleBadgeProps(row.original.role);
          const Icon = config.icon;
          return (
            <Badge variant={config.variant} className="gap-1">
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Joined',
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
                title="View customer details"
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
                title="Edit customer"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
            {onDelete && row.original.role !== 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(row.original)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete customer"
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
      data={customers}
      loading={loading}
      searchable
      searchPlaceholder="Search customers..."
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
