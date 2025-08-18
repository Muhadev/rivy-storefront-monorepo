import React, { useState, useEffect } from 'react';
import { useReviewStore } from '@/stores/review.store';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export function AdminReviewForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { reviews, createReview, updateReview, fetchReviews, isLoading } = useReviewStore();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    productId: '',
    rating: '',
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
    if (isEdit && id) {
      const review = reviews.find(r => r.id === Number(id));
      if (review) {
        setForm({
          productId: String(review.productId),
          rating: String(review.rating),
          comment: review.comment || '',
        });
      }
    }
  }, [isEdit, id, reviews, fetchReviews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await updateReview(Number(id), {
          rating: Number(form.rating),
          comment: form.comment,
        });
        toast.success('Review updated');
      } else {
        await createReview({
          productId: Number(form.productId),
          rating: Number(form.rating),
          comment: form.comment,
        });
        toast.success('Review created');
      }
      navigate('/admin/reviews');
    } catch (err) {
      toast.error('Failed to save review');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Review' : 'Add Review'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Product ID" name="productId" value={form.productId} onChange={handleChange} required />
            <Input label="Rating" name="rating" type="number" min={1} max={5} value={form.rating} onChange={handleChange} required />
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <Textarea name="comment" value={form.comment} onChange={handleChange} required />
            <div className="flex gap-4 mt-6">
              <Button type="submit" loading={isLoading}>{isEdit ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/reviews')}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
