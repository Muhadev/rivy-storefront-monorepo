import React, { useState } from 'react';
import { useDiscountStore } from '@/stores/discount.store';
import { useCartStore } from '@/stores/cart.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Tag, X } from 'lucide-react';

interface DiscountSectionProps {
  cartTotal: number;
  onDiscountApplied?: (discount: any) => void;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  cartTotal,
  onDiscountApplied
}) => {
  const { appliedDiscount, applyDiscount, removeDiscount, validateDiscount, isLoading } = useDiscountStore();
  const { items } = useCartStore();

  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!discountCode.trim()) {
      setError('Please enter a discount code');
      return;
    }

    try {
      // First validate the discount code
      await validateDiscount(discountCode.trim());

      // Apply discount using backend API
      const result = await applyDiscount({
        code: discountCode.trim(),
        orderAmount: cartTotal
      });

      setSuccess(`Discount applied! You saved $${result.amount.toFixed(2)}`);
      setDiscountCode('');
      onDiscountApplied?.(result);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Invalid discount code');
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setSuccess('');
    setError('');
    onDiscountApplied?.(null);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <h3 className="font-medium">Discount Code</h3>
          </div>

          {appliedDiscount ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {appliedDiscount.discount.code}
                  </Badge>
                  <span className="text-sm text-green-700">
                    -{appliedDiscount.discount.type === 'percentage' 
                      ? `${appliedDiscount.discount.value}%` 
                      : `$${appliedDiscount.amount.toFixed(2)}`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveDiscount}
                  className="text-green-700 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  You saved: <span className="font-semibold text-green-600">
                    ${appliedDiscount.amount.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApplyDiscount} className="space-y-3">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={discountCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter discount code"
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !discountCode.trim()}>
                  {isLoading ? 'Applying...' : 'Apply'}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Have a promo code? Enter it above to save on your order.
              </p>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscountSection;
