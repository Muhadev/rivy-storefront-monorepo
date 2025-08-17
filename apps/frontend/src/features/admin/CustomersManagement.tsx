/**
 * Customers Management Page
 * Complete customer CRUD interface with role management
 */

import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CustomerTable } from '../../components/tables/CustomerTable';
import { CustomerModal } from '../../components/modals/CustomerModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../../hooks/useCustomers';
import type { User } from '../../types';

export function CustomersManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<User | null>(null);

  // Data fetching
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();

  // Mutations
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  // Handlers
  const handleCreate = async (data: any) => {
    await createCustomer.mutateAsync(data);
    setShowCreateModal(false);
  };

  const handleEdit = (customer: User) => {
    setEditingCustomer(customer);
  };

  const handleUpdate = async (data: any) => {
    if (editingCustomer) {
      await updateCustomer.mutateAsync({ 
        id: editingCustomer.id, 
        data 
      });
      setEditingCustomer(null);
    }
  };

  const handleDelete = (customer: User) => {
    setDeletingCustomer(customer);
  };

  const confirmDelete = async () => {
    if (deletingCustomer) {
      await deleteCustomer.mutateAsync(deletingCustomer.id);
      setDeletingCustomer(null);
    }
  };

  const handleView = (customer: User) => {
    // TODO: Implement customer detail view or orders history modal
    console.log('View customer:', customer);
  };

  const loading = createCustomer.isPending || updateCustomer.isPending || deleteCustomer.isPending;

  // Customer stats
  const adminCount = customers.filter(c => c.role === 'admin').length;
  const customerCount = customers.filter(c => c.role === 'customer').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer accounts and permissions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlusIcon className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {customers.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {customerCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Regular Customers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {adminCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Admin Users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>All Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTable
            customers={customers}
            loading={loadingCustomers}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Create Customer Modal */}
      <CustomerModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        loading={loading}
        onSubmit={handleCreate}
      />

      {/* Edit Customer Modal */}
      <CustomerModal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        customer={editingCustomer}
        loading={loading}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={confirmDelete}
        loading={loading}
        itemName={deletingCustomer?.name}
        itemType="customer"
        warning={deletingCustomer?.role === 'admin' ? 'This user has admin privileges. Deleting will remove all admin access.' : undefined}
      />
    </div>
  );
}
