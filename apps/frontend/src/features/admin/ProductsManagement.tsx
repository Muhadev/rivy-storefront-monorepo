/**
 * Products Management Page
 * Complete product CRUD interface with professional table and forms
 */

import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProductTable } from '../../components/tables/ProductTable';
import { ProductModal } from '../../components/modals/ProductModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';

export function ProductsManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Data fetching
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Handlers
  const handleCreate = async (data: any) => {
    await createProduct.mutateAsync(data);
    setShowCreateModal(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (data: any) => {
    if (editingProduct) {
      await updateProduct.mutateAsync({ 
        id: editingProduct.id, 
        data 
      });
      setEditingProduct(null);
    }
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const confirmDelete = async () => {
    if (deletingProduct) {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const handleView = (product: Product) => {
    // TODO: Implement product view modal or navigate to detail page
    console.log('View product:', product);
  };

  const loading = createProduct.isPending || updateProduct.isPending || deleteProduct.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product catalog
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
          disabled={loadingCategories}
        >
          <PlusIcon className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle level={3}>All Products ({Array.isArray(products) ? products.length : products?.pagination?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={Array.isArray(products) ? products : products?.data || []}
            loading={loadingProducts}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <ProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        loading={loading}
        onSubmit={handleCreate}
      />

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        categories={categories}
        loading={loading}
        onSubmit={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={confirmDelete}
        loading={loading}
        itemName={deletingProduct?.name}
        itemType="product"
      />
    </div>
  );
}
