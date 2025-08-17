/**
 * Customer Management Modal
 * Enterprise-grade modal for creating and editing customers
 */

import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { CustomerForm } from '../forms/CustomerForm';
import { User } from '../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: User | null;
  loading?: boolean;
  onSubmit: (data: any) => void | Promise<void>;
}

export function CustomerModal({
  isOpen,
  onClose,
  customer,
  loading = false,
  onSubmit,
}: CustomerModalProps) {
  const isEdit = !!customer;
  const title = isEdit ? 'Edit Customer' : 'Create New Customer';
  const submitLabel = isEdit ? 'Update Customer' : 'Create Customer';

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Customer modal submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={
        isEdit 
          ? 'Update customer information and account settings.'
          : 'Create a new customer account with role and permissions.'
      }
      size="lg"
      className="max-w-4xl"
    >
      <CustomerForm
        initialData={customer || undefined}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel={submitLabel}
        isEdit={isEdit}
      />
    </Modal>
  );
}
