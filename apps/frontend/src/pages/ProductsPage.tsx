import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';
import { productRepository } from '@/repositories/product.repository';
import { QUERY_KEYS } from '@/config/api';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductDetailsModal } from '@/components/common/ProductDetailsModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Product, Category } from '@/types/api';
import { formatPrice } from '@/utils/format';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
  });
  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
  );
  
  const itemsPerPage = 12;

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => productRepository.getCategories(),
  });

  // Fetch products for category counts (without filters)
  const { data: allProductsData } = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, 'category-counts'],
    queryFn: () => productRepository.getProducts({ limit: 1000 }), // Get all products to count by category
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Calculate product counts per category
  const categoryProductCounts = useMemo(() => {
    if (!allProductsData?.data) return {};
    
    const counts: Record<number, number> = {};
    allProductsData.data.forEach(product => {
      if (product.categoryId) {
        counts[product.categoryId] = (counts[product.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [allProductsData?.data]);

  // Fetch products with filters
  const { data: productsData, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, { 
      q: searchQuery, 
      category: selectedCategory, 
      minPrice: priceRange.min, 
      maxPrice: priceRange.max, 
      page: currentPage,
      limit: itemsPerPage 
    }],
    queryFn: () => productRepository.getProducts({
      q: searchQuery,
      category: selectedCategory,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      page: currentPage,
      limit: itemsPerPage,
    }),
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory.toString());
    if (priceRange.min) params.set('minPrice', priceRange.min.toString());
    if (priceRange.max) params.set('maxPrice', priceRange.max.toString());
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, priceRange, currentPage, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setPriceRange({ min: undefined, max: undefined });
    setCurrentPage(1);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const hasActiveFilters = searchQuery || selectedCategory || priceRange.min || priceRange.max;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't load the products. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Clean Energy Products</h1>
          <p className="text-gray-600 max-w-2xl">
            Discover our complete range of sustainable energy solutions including solar panels, 
            batteries, inverters, and wind turbines.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Make it sticky */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:sticky lg:top-4">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </Button>
              </div>

              <div className={`space-y-6 ${!isFilterOpen ? 'hidden lg:block' : ''}`}>
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    Search Products
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </form>
                </div>

                {/* Categories */}
                {categories && categories.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-900 block mb-2">
                      Category
                    </label>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(undefined)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          !selectedCategory
                            ? 'bg-green-100 text-green-800'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-green-100 text-green-800'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {category.name} ({categoryProductCounts[category.id] || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min price"
                      value={priceRange.min || ''}
                      onChange={(e) => setPriceRange(prev => ({ 
                        ...prev, 
                        min: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max price"
                      value={priceRange.max || ''}
                      onChange={(e) => setPriceRange(prev => ({ 
                        ...prev, 
                        max: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar - Make it sticky */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 sticky top-4 z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Active Filters */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge variant="secondary">
                          Search: {searchQuery}
                        </Badge>
                      )}
                      {selectedCategory && categories && (
                        <Badge variant="secondary">
                          Category: {categories.find(c => c.id === selectedCategory)?.name}
                        </Badge>
                      )}
                      {priceRange.min && (
                        <Badge variant="secondary">
                          Min: {formatPrice(priceRange.min)}
                        </Badge>
                      )}
                      {priceRange.max && (
                        <Badge variant="secondary">
                          Max: {formatPrice(priceRange.max)}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {productsData && (
                    <span className="text-sm text-gray-600">
                      {productsData.pagination.total} products found
                    </span>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : !productsData || !productsData.data || productsData.data.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all products.
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }>
                  {productsData?.data?.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={handleViewProduct}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {productsData?.pagination?.totalPages && productsData.pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={!productsData?.pagination?.hasPrev}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, productsData?.pagination?.totalPages || 1) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'ghost'}
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-10 h-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={!productsData?.pagination?.hasNext}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}