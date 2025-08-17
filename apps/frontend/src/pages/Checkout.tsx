import React from 'react';

const Checkout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="text-gray-500">
            Checkout form coming soon...
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="text-gray-500">
            Order summary coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
