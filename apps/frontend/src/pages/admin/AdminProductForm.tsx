import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productRepository } from '@/repositories/product.repository';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { toast } from 'react-hot-toast';
import type { Category } from '@/types/api';
import { Product } from '@/types/api';

export default function AdminProductForm() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories for select
        const cats = await productRepository.getCategories();
        setCategories(cats);
        if (isEdit && id) {
          const prod = await productRepository.getProduct(Number(id));
          setProduct(prod || {});
        }
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === 'number' || name === 'price' || name === 'stock' || name === 'categoryId') {
      newValue = value === '' ? '' : Number(value);
    }
    setProduct({ ...product, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await productRepository.updateProduct(Number(id), product);
        toast.success('Product updated');
      } else {
        await productRepository.createProduct(product);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && !loading && (!product || !product.id)) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={product.name || ''}
          onChange={handleChange}
          required
        />
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={product.description || ''}
          onChange={handleChange}
          required
        />
        <Input
          label="Price"
          name="price"
          type="number"
          value={product.price || ''}
          onChange={handleChange}
          required
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          value={product.stock || ''}
          onChange={handleChange}
          required
        />
        <Select
          label="Category"
          name="categoryId"
          value={product.categoryId || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
        <Input
          label="Image URL"
          name="imageUrl"
          value={product.imageUrl || ''}
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <Button type="submit" loading={loading}>
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
