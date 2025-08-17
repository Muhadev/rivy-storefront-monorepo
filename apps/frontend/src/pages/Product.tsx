import React from 'react';
import { useParams } from 'react-router-dom';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg">
          {/* Product image placeholder */}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Product {id}</h2>
          <p className="text-gray-600 mb-6">Product details will be implemented here...</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
