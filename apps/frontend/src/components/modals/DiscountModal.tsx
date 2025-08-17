/**
 * DiscountModal Component
 * Modal wrapper for discount creation and editing
 */

import React from 'react';
import { Modal } from '../ui/Modal';
import { DiscountForm } from '../forms/DiscountForm';
import type { Discount } from '../../types';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  discount?: Discount | null;
  loading?: boolean;
  onSubmit: (data: any) => void;
}

export function DiscountModal({ 
  isOpen, 
  onClose, 
  discount, 
  loading = false, 
  onSubmit 
}: DiscountModalProps) {
  const isEditing = !!discount;

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Discount' : 'Create New Discount'}
      size="xl"
    >
      <DiscountForm
        discount={discount}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
