/**
 * Admin Layout
 * Main layout wrapper for admin dashboard with sidebar and main content area
 */

import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../sidebar/AdminSidebar';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { ToastProvider } from '../ui/Toast';

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            {/* Top bar for mobile spacing */}
            <div className="lg:hidden h-16" />
            
            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto">
                {children || <Outlet />}
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </ToastProvider>
  );
}
