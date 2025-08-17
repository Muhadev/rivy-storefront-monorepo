/**
 * Toast Notification Component
 * Enterprise-grade toast notifications with multiple variants
 */

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { toast as hotToast, Toaster, ToastOptions } from 'react-hot-toast';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/outline';

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const success = useCallback((message: string, options?: ToastOptions) => {
    hotToast.success(message, {
      duration: 4000,
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
      ...options,
    });
  }, []);

  const error = useCallback((message: string, options?: ToastOptions) => {
    hotToast.error(message, {
      duration: 6000,
      icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
      ...options,
    });
  }, []);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    hotToast(message, {
      duration: 5000,
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
      style: {
        background: '#fef3cd',
        color: '#856404',
        border: '1px solid #ffeaa7',
      },
      ...options,
    });
  }, []);

  const info = useCallback((message: string, options?: ToastOptions) => {
    hotToast(message, {
      duration: 4000,
      icon: <InformationCircleIcon className="w-5 h-5 text-blue-500" />,
      style: {
        background: '#d1ecf1',
        color: '#0c5460',
        border: '1px solid #bee5eb',
      },
      ...options,
    });
  }, []);

  const loading = useCallback((message: string, options?: ToastOptions) => {
    return hotToast.loading(message, {
      duration: Infinity,
      ...options,
    });
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    hotToast.dismiss(toastId);
  }, []);

  const value: ToastContextType = {
    success,
    error,
    warning,
    info,
    loading,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
