/**
 * DiscountForm Component
 * Enterprise-grade form for creating and editing discounts
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '../ui/Form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Discount } from '../../types';

// Form validation schema
const discountSchema = z.object({
  code: z.string()
    .min(1, 'Code is required')
    .max(50, 'Code must be 50 characters or less'),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  minOrderAmount: z.number().min(0, 'Minimum order amount cannot be negative').optional(),
  maxUses: z.number().int().positive('Max uses must be a positive integer').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true)
});

type DiscountFormData = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  discount?: Discount | null;
  loading?: boolean;
  onSubmit: (data: DiscountFormData) => void;
  onCancel?: () => void;
}

export function DiscountForm({ 
  discount, 
  loading = false, 
  onSubmit, 
  onCancel 
}: DiscountFormProps) {
  const isEditing = !!discount;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<DiscountFormData>({
    defaultValues: discount ? {
      code: discount.code,
      description: discount.description || '',
      type: discount.type,
      value: discount.value,
      minOrderAmount: discount.minOrderAmount || undefined,
      maxUses: discount.maxUses || undefined,
      startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
      endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
      isActive: discount.isActive
    } : {
      type: 'percentage',
      isActive: true
    },
    mode: 'onChange'
  });

  const watchedType = watch('type');
  const watchedValue = watch('value');

  // Preview discount value formatting
  const formatPreview = (type: string, value: number) => {
    if (!value) return '';
    if (type === 'percentage') {
      return `${value}% off`;
    } else {
      return `$${value.toFixed(2)} off`;
    }
  };

  return (
    <Form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Discount Code */}
          <div>
            <Input
              label="Discount Code"
              type="text"
              placeholder="SUMMER2024"
              {...register('code')}
              error={errors.code?.message}
              disabled={isEditing || loading} // Code cannot be changed when editing
              className="font-mono uppercase"
              hint={isEditing ? 'Discount codes cannot be modified' : 'Use uppercase letters, numbers, hyphens, and underscores'}
            />
          </div>

          {/* Description */}
          <div>
            <Input
              label="Description"
              type="text"
              placeholder="Summer sale discount"
              {...register('description')}
              error={errors.description?.message}
              disabled={loading}
              hint="Optional description for internal use"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  value="percentage"
                  {...register('type')}
                  disabled={loading}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Percentage</div>
                  <div className="text-xs text-gray-500">% off total</div>
                </div>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  value="fixed"
                  {...register('type')}
                  disabled={loading}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Fixed Amount</div>
                  <div className="text-xs text-gray-500">$ off total</div>
                </div>
              </label>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Discount Value */}
          <div>
            <Input
              label={watchedType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              type="number"
              step={watchedType === 'percentage' ? '1' : '0.01'}
              min="0"
              max={watchedType === 'percentage' ? '100' : undefined}
              placeholder={watchedType === 'percentage' ? '10' : '5.00'}
              {...register('value', { valueAsNumber: true })}
              error={errors.value?.message}
              disabled={loading}
              hint={watchedType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter dollar amount'}
            />
            {watchedValue && (
              <div className="mt-2">
                <Badge variant="info" size="sm">
                  Preview: {formatPreview(watchedType, watchedValue)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Minimum Order Amount */}
          <div>
            <Input
              label="Minimum Order Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              {...register('minOrderAmount', { valueAsNumber: true })}
              error={errors.minOrderAmount?.message}
              disabled={loading}
              hint="Optional minimum order amount to use this discount"
            />
          </div>

          {/* Maximum Uses */}
          <div>
            <Input
              label="Maximum Uses"
              type="number"
              min="1"
              placeholder="100"
              {...register('maxUses', { valueAsNumber: true })}
              error={errors.maxUses?.message}
              disabled={loading}
              hint="Leave empty for unlimited uses"
            />
          </div>

          {/* Start Date */}
          <div>
            <Input
              label="Start Date"
              type="datetime-local"
              {...register('startDate')}
              error={errors.startDate?.message}
              disabled={loading}
              hint="When the discount becomes valid (leave empty for immediate)"
            />
          </div>

          {/* End Date */}
          <div>
            <Input
              label="End Date"
              type="datetime-local"
              {...register('endDate')}
              error={errors.endDate?.message}
              disabled={loading}
              hint="When the discount expires (leave empty for no expiration)"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              disabled={loading}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
            <span className="ml-2 text-xs text-gray-500">
              Inactive discounts cannot be used
            </span>
          </div>
        </div>
      </div>

      {/* Usage Information for Editing */}
      {isEditing && discount && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Usage Statistics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Times Used:</span>
              <span className="ml-2 font-medium">{discount.usedCount}</span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2">{new Date(discount.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2">{new Date(discount.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !isValid || (!isDirty && isEditing)}
          className="min-w-[120px]"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Discount' : 'Create Discount'}
        </Button>
      </div>
    </Form>
  );
}
