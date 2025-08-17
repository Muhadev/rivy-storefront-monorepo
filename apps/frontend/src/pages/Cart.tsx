import React from 'react';

const Cart: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="text-center text-gray-500 py-8">
            Your cart is empty
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="text-center text-gray-500">
            Cart functionality coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
