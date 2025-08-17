import React from 'react';
import { useParams } from 'react-router-dom';

const Confirm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order ID is: <strong>{id}</strong>
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            You will receive a confirmation email shortly with your order details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
