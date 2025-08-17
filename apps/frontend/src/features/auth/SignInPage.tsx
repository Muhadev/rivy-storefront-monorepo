/**
 * Sign In Page
 * Professional authentication form with security best practices
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Form, FormField, FormActions } from '../../components/ui/Form';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingOverlay, ButtonLoading } from '../../components/ui/Loading';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { error: showError, success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { formState: { errors } } = form;

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoading(true);
      await login(data);
      success('Welcome back! You have been signed in successfully.');
      
      // Redirect to intended page or admin dashboard
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (error: any) {
      showError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Rivy Admin
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <LoadingOverlay loading={loading}>
          <Card>
            <CardHeader>
              <CardTitle level={2}>Sign In</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Form form={form} onSubmit={onSubmit} loading={loading}>
                <FormField
                  label="Email Address"
                  error={errors.email?.message}
                  required
                >
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                  />
                </FormField>

                <FormField
                  label="Password"
                  error={errors.password?.message}
                  required
                >
                  <div className="relative">
                    <Input
                      {...form.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </FormField>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      {...form.register('rememberMe')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <FormActions>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    <ButtonLoading loading={loading}>
                      Sign In
                    </ButtonLoading>
                  </Button>
                </FormActions>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </LoadingOverlay>
      </div>
    </div>
  );
}
