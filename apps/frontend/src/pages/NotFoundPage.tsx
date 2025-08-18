import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-6xl font-bold text-green-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="primary" className="flex items-center bg-green-600 hover:bg-green-700">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4">
            <Link 
              to="/products"
              className="inline-flex items-center text-green-600 hover:text-green-700 text-sm"
            >
              <Search className="h-4 w-4 mr-1" />
              Browse Products
            </Link>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-500">
          <p>Error Code: 404</p>
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  );
}