import React, { useEffect, useState } from 'react';
import { useDiscountStore } from '@/stores/discount.store';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DollarSign, Trash2, Edit, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDiscounts() {
  const { discounts, fetchDiscounts, removeDiscount, isLoading } = useDiscountStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // Remove discount by id
  const handleRemove = (id: number) => {
    if (window.confirm('Delete this discount code?')) {
      removeDiscount(); // This resets appliedDiscount, not the list. You may want to call backend delete here.
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Discounts</h1>
        <Link to="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Discounts</CardTitle>
          <Link to="/admin/discounts/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Discount
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center">Loading...</div>
          ) : discounts.length === 0 ? (
            <div className="py-12 text-center">No discounts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discounts.map(discount => (
                    <tr key={discount.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{discount.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{discount.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{discount.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{discount.isActive ? 'Yes' : 'No'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleRemove(discount.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {/* Optionally add edit functionality here */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
