/**
 * Discounts Management Page
 * Complete discount CRUD interface with professional table and forms
 */

import React, { useState } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DiscountTable } from '../../components/tables/DiscountTable';
import { DiscountModal } from '../../components/modals/DiscountModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { useDiscounts, useCreateDiscount, useUpdateDiscount, useDeleteDiscount, discountUtils } from '../../hooks/useDiscounts';
import type { Discount } from '../../types';

export function DiscountsManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [deletingDiscount, setDeletingDiscount] = useState<Discount | null>(null);

  // Data fetching
  const { data: discounts = [], isLoading: loadingDiscounts } = useDiscounts();

  // Mutations
  const createDiscount = useCreateDiscount();
  const updateDiscount = useUpdateDiscount();
  const deleteDiscount = useDeleteDiscount();

  // Handlers
  const handleCreate = async (data: any) => {
    await createDiscount.mutateAsync(data);
    setShowCreateModal(false);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
  };

  const handleUpdate = async (data: any) => {
    if (editingDiscount) {
      await updateDiscount.mutateAsync({ 
        id: editingDiscount.id, 
        data 
      });
      setEditingDiscount(null);
    }
  };

  const handleDelete = (discount: Discount) => {
    setDeletingDiscount(discount);
  };

  const confirmDelete = async () => {
    if (deletingDiscount) {
      await deleteDiscount.mutateAsync(deletingDiscount.id);
      setDeletingDiscount(null);
    }
  };

  const handleView = (discount: Discount) => {
    // TODO: Implement discount detail view modal
    console.log('View discount:', discount);
  };

  const loading = createDiscount.isPending || updateDiscount.isPending || deleteDiscount.isPending;

  // Calculate statistics
  const activeDiscounts = discounts.filter((d: Discount) => discountUtils.getStatus(d) === 'Active').length;
  const totalUsage = discounts.reduce((sum: number, d: Discount) => sum + d.usedCount, 0);
  const expiredDiscounts = discounts.filter((d: Discount) => discountUtils.getStatus(d) === 'Expired').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage discount codes and promotional offers
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <TagIcon className="h-4 w-4" />
          Create Discount
        </Button>
      </div>

      {/* Discount Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {discounts.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Discounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activeDiscounts}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Discounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {totalUsage}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Uses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {expiredDiscounts}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Expired
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>All Discount Codes ({discounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DiscountTable
            discounts={discounts}
            loading={loadingDiscounts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Create Discount Modal */}
      <DiscountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        loading={loading}
        onSubmit={handleCreate}
      />

      {/* Edit Discount Modal */}
      <DiscountModal
        isOpen={!!editingDiscount}
        onClose={() => setEditingDiscount(null)}
        discount={editingDiscount}
        loading={loading}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingDiscount}
        onClose={() => setDeletingDiscount(null)}
        onConfirm={confirmDelete}
        loading={loading}
        itemName={deletingDiscount?.code}
        itemType="discount code"
        warning={
          deletingDiscount?.usedCount && deletingDiscount.usedCount > 0
            ? `This discount has been used ${deletingDiscount.usedCount} times. Deleting it may affect historical order data.`
            : undefined
        }
      />
    </div>
  );
}
