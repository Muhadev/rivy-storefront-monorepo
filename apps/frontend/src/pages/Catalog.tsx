import React from 'react';

const Catalog: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Product grid will be implemented here */}
        <div className="text-center text-gray-500 col-span-full">
          Product catalog coming soon...
        </div>
      </div>
    </div>
  );
};

export default Catalog;
