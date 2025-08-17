/**
 * Product Management Modal
 * Enterprise-grade modal for creating and editing products
 */

import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { ProductForm } from '../forms/ProductForm';
import { Product, Category } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  loading?: boolean;
  onSubmit: (data: any) => void | Promise<void>;
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  categories,
  loading = false,
  onSubmit,
}: ProductModalProps) {
  const isEdit = !!product;
  const title = isEdit ? 'Edit Product' : 'Create New Product';
  const submitLabel = isEdit ? 'Update Product' : 'Create Product';

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Product modal submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={
        isEdit 
          ? 'Update product information, pricing, and inventory.'
          : 'Add a new product to your catalog with complete details.'
      }
      size="lg"
      className="max-w-4xl"
    >
      <ProductForm
        initialData={product || undefined}
        categories={categories}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={submitLabel}
      />
    </Modal>
  );
}
