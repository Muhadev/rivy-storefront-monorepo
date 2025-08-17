/**
 * Delete Confirmation Modal
 * Reusable confirmation modal for delete operations
 */

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  warning?: string; // Additional warning message
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  itemName,
  itemType = 'item',
  warning,
}: DeleteConfirmModalProps) {
  
  const defaultTitle = title || `Delete ${itemType}`;
  const defaultDescription = description || (
    itemName 
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
  );

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Delete confirmation error:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultTitle}
      size="sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {defaultDescription}
          </p>
          
          {warning && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> {warning}
              </p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirm}
              loading={loading}
              className="min-w-[80px]"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
