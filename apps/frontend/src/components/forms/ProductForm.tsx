/**
 * Product Form Component
 * Enterprise-grade product creation and editing form with validation
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ShoppingBagIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Form, FormField, FormActions } from '../../components/ui/Form';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Product, Category } from '../../types';

// Validation schema matching backend
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  price: z.number().positive('Price must be positive').max(999999, 'Price too high'),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<Product>;
  categories: Category[];
  loading?: boolean;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ProductForm({
  initialData,
  categories,
  loading = false,
  onSubmit,
  onCancel,
  submitLabel = 'Save Product',
}: ProductFormProps) {
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: undefined,
      imageUrl: '',
      ...initialData,
    },
  });

  const { handleSubmit, formState: { errors }, reset, watch } = form;

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        categoryId: initialData.categoryId || undefined,
        imageUrl: initialData.imageUrl || '',
      });
    }
  }, [initialData, reset]);

  const imageUrl = watch('imageUrl');

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      // Clean up empty strings to undefined for optional fields
      const cleanData = {
        ...data,
        categoryId: data.categoryId || undefined,
        imageUrl: data.imageUrl || undefined,
      };
      await onSubmit(cleanData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form form={form} onSubmit={handleFormSubmit} loading={loading} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            
            <FormField
              label="Product Name"
              error={errors.name?.message}
              required
            >
              <Input
                {...form.register('name')}
                placeholder="Enter product name"
                leftIcon={<ShoppingBagIcon className="h-4 w-4" />}
                error={errors.name?.message}
              />
            </FormField>

            <FormField
              label="Description"
              error={errors.description?.message}
              required
            >
              <textarea
                {...form.register('description')}
                placeholder="Describe your product..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </FormField>

            <FormField
              label="Category"
              error={errors.categoryId?.message}
            >
              <div className="relative">
                <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...form.register('categoryId', { 
                    setValueAs: (value: string) => value === '' ? undefined : parseInt(value, 10) 
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pricing & Inventory
            </h3>
            
            <FormField
              label="Price"
              error={errors.price?.message}
              required
            >
              <Input
                {...form.register('price', { 
                  setValueAs: (value: string) => parseFloat(value) || 0 
                })}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                leftIcon={<CurrencyDollarIcon className="h-4 w-4" />}
                error={errors.price?.message}
              />
            </FormField>

            <FormField
              label="Stock Quantity"
              error={errors.stock?.message}
              required
            >
              <Input
                {...form.register('stock', { 
                  setValueAs: (value: string) => parseInt(value, 10) || 0 
                })}
                type="number"
                min="0"
                placeholder="0"
                leftIcon={<CubeIcon className="h-4 w-4" />}
                error={errors.stock?.message}
              />
            </FormField>

            <FormField
              label="Image URL"
              error={errors.imageUrl?.message}
              description="Optional product image URL"
            >
              <Input
                {...form.register('imageUrl')}
                type="url"
                placeholder="https://example.com/image.jpg"
                leftIcon={<PhotoIcon className="h-4 w-4" />}
                error={errors.imageUrl?.message}
              />
            </FormField>

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image Preview
                </label>
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-gray-400 text-center">
                    <PhotoIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-xs">Invalid URL</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FormActions>
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
          loading={loading}
          className="min-w-[120px]"
        >
          {submitLabel}
        </Button>
      </FormActions>
    </Form>
  );
}
