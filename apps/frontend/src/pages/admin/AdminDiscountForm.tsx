import React, { useState, useEffect } from 'react';
import { useDiscountStore } from '@/stores/discount.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function AdminDiscountForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { discounts, fetchDiscounts, isLoading } = useDiscountStore();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxUses: '',
    isActive: true,
  });

  useEffect(() => {
    fetchDiscounts();
    if (isEdit && id) {
      const discount = discounts.find(d => d.id === Number(id));
      if (discount) {
        setForm({
          code: discount.code,
          type: discount.type,
          value: String(discount.value),
          minOrderAmount: String(discount.minOrderAmount || ''),
          maxUses: String(discount.maxUses || ''),
          isActive: discount.isActive,
        });
      }
    }
  }, [isEdit, id, discounts, fetchDiscounts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Integrate with backend create/update endpoints
      toast.success(isEdit ? 'Discount updated' : 'Discount created');
      navigate('/admin/discounts');
    } catch (err) {
      toast.error('Failed to save discount');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Discount' : 'Add Discount'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Code" name="code" value={form.code} onChange={handleChange} required />
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            <Input label="Value" name="value" type="number" value={form.value} onChange={handleChange} required />
            <Input label="Min Order Amount" name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={handleChange} />
            <Input label="Max Uses" name="maxUses" type="number" value={form.maxUses} onChange={handleChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              Active
            </label>
            <div className="flex gap-4 mt-6">
              <Button type="submit" loading={isLoading}>{isEdit ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/discounts')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
