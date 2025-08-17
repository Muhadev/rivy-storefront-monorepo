/**
 * Form Component
 * Enterprise-grade form wrapper with validation and error handling
 */

import React, { ReactNode } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '../../lib/utils';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  form?: UseFormReturn<any>;
  onSubmit?: (data: any) => void | Promise<void>;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export function Form({ 
  form, 
  onSubmit, 
  loading = false, 
  children, 
  className,
  ...props 
}: FormProps) {
  const handleSubmit = form?.handleSubmit ? form.handleSubmit(onSubmit || (() => {})) : undefined;

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      <fieldset disabled={loading} className="space-y-6">
        {children}
      </fieldset>
    </form>
  );
}

interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  description, 
  error, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn('flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}
