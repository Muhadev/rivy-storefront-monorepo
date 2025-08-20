import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Leaf } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore, useCartTotalItems } from '@/stores/cart.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemCount = useCartTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            <Leaf className="h-6 w-6" />
            <span>Rivy</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search clean energy products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors text-sm"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 flex justify-between items-center px-4 py-2 shadow-lg">
          <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-green-600">
            <Leaf className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/products" className="flex flex-col items-center text-gray-700 hover:text-green-600">
            <Search className="h-6 w-6" />
            <span className="text-xs">Products</span>
          </Link>
          <Link to="/cart" className="relative flex flex-col items-center text-gray-700 hover:text-green-600">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-green-600">
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </Link>
          ) : (
            <Link to="/auth/login" className="flex flex-col items-center text-gray-700 hover:text-green-600">
              <User className="h-6 w-6" />
              <span className="text-xs">Login</span>
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex flex-col items-center text-blue-600 hover:text-blue-700">
              <Menu className="h-6 w-6" />
              <span className="text-xs">Admin</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}