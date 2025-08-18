import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';

export function AdminProfile() {
  const { profile, fetchProfile, updateProfile, deleteAccount, isLoading } = useUserStore();
  const [form, setForm] = useState({
    name: '',
    email: '',
    // phone: '',
    // address: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        // phone: profile.phone || '',
        // address: profile.address || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteAccount();
        toast.success('Account deleted');
      } catch (err) {
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} required type="email" />
              {/* <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Input label="Address" name="address" value={form.address} onChange={handleChange} /> */}
              <div className="flex gap-4 mt-6">
                <Button type="submit" loading={isLoading}>Update Profile</Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>Delete Account</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
