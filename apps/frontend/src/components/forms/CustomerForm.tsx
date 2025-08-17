/**
 * Customer Form Comp  role: z.enum(['customer', 'admin'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),nt  
 * Enterprise-grade customer creation and editing form with validation
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Form, FormField, FormActions } from '../../components/ui/Form';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User } from '../../types';

// Validation schema for customer form
const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['customer', 'admin'], {
    message: 'Please select a role',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  initialData?: Partial<User>;
  loading?: boolean;
  onSubmit: (data: CustomerFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isEdit?: boolean;
}

export function CustomerForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
  submitLabel = 'Save Customer',
  isEdit = false,
}: CustomerFormProps) {
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'customer',
      password: '',
      ...initialData,
    },
  });

  const { handleSubmit, formState: { errors }, reset } = form;

  // Reset form when initial data changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'customer',
        password: '', // Never pre-fill password
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    try {
      // For edit mode, don't send password if it's empty
      const submitData = { ...data };
      if (isEdit && !data.password) {
        delete submitData.password;
      }
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form form={form} onSubmit={handleFormSubmit} loading={loading} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            
            <FormField
              label="Full Name"
              error={errors.name?.message}
              required
            >
              <Input
                {...form.register('name')}
                type="text"
                placeholder="Enter full name"
                leftIcon={<UserIcon className="h-4 w-4" />}
                error={errors.name?.message}
                disabled={loading}
              />
            </FormField>

            <FormField
              label="Email Address"
              error={errors.email?.message}
              required
            >
              <Input
                {...form.register('email')}
                type="email"
                placeholder="Enter email address"
                leftIcon={<EnvelopeIcon className="h-4 w-4" />}
                error={errors.email?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Account Settings */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Account Settings
            </h3>
            
            <FormField
              label="Role"
              error={errors.role?.message}
              required
            >
              <div className="relative">
                <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...form.register('role')}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </FormField>

            <FormField
              label={isEdit ? "New Password (optional)" : "Password"}
              error={errors.password?.message}
              required={!isEdit}
              description={isEdit ? "Leave blank to keep current password" : undefined}
            >
              <Input
                {...form.register('password')}
                type="password"
                placeholder={isEdit ? "Enter new password" : "Enter password"}
                leftIcon={<LockClosedIcon className="h-4 w-4" />}
                error={errors.password?.message}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Security Notice for Admin Role */}
      <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Security Notice
            </h3>
            <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              <p>
                Administrator accounts have full access to manage all aspects of the system. 
                Only grant admin privileges to trusted users.
              </p>
            </div>
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
