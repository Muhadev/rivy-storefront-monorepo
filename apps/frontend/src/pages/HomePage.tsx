import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Zap, Shield, Award, Star, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productRepository } from '@/repositories/product.repository';
import { QUERY_KEYS } from '@/config/api';
import { ProductCard } from '@/components/common/ProductCard';
import { ProductDetailsModal } from '@/components/common/ProductDetailsModal';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types/api';

export function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch featured products
  const { data: featuredProducts } = useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS, 'featured'],
    queryFn: () => productRepository.getProducts({ limit: 8 }),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => productRepository.getCategories(),
  });

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const features = [
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable energy solutions that reduce your carbon footprint',
    },
    {
      icon: Zap,
      title: 'High Efficiency',
      description: 'Premium products with industry-leading efficiency ratings',
    },
    {
      icon: Shield,
      title: 'Reliable Quality',
      description: 'Durable products backed by comprehensive warranties',
    },
    {
      icon: Award,
      title: 'Expert Support',
      description: 'Professional installation and ongoing technical support',
    },
  ];

  const stats = [
    { label: 'Products Sold', value: '50K+', icon: TrendingUp },
    { label: 'Happy Customers', value: '25K+', icon: Star },
    { label: 'Years Experience', value: '15+', icon: Award },
    { label: 'Countries Served', value: '30+', icon: Leaf },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-green-100 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Power Your Future with{' '}
                  <span className="text-green-600">Clean Energy</span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Discover premium solar panels, batteries, inverters, and wind turbines. 
                  Join thousands who've made the switch to sustainable energy.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" variant="primary" className="bg-green-600 hover:bg-green-700">
                    Shop Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/9875416/pexels-photo-9875416.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Solar panels"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Clean Energy</div>
                    <div className="text-sm text-gray-600">Certified Products</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rivy?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the highest quality clean energy solutions 
              with exceptional service and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find the perfect clean energy solution for your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <span className="text-sm font-medium text-green-600 group-hover:underline">
                      View Products ({category.productCount || 0})
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.data && featuredProducts.data.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-lg text-gray-600">
                  Discover our most popular clean energy solutions
                </p>
              </div>
              <Link to="/products">
                <Button variant="outline">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts?.data?.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewProduct}
                />
              )) || []}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Go Green?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've made the switch to clean energy. 
            Get expert consultation and premium products delivered to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Get Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}