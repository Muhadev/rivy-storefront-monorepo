/**
 * Sign Up Page
 * Professional registration form with validation and security
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Form, FormField, FormActions } from '../../components/ui/Form';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { LoadingOverlay, ButtonLoading } from '../../components/ui/Loading';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { error: showError, success } = useToast();
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const { formState: { errors }, watch } = form;
  const password = watch('password');

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        acceptTerms: data.acceptTerms,
      });
      
      success('Account created successfully! Please sign in to continue.');
      navigate('/signin');
    } catch (error: any) {
      showError(error.message || 'Failed to create account. Please try again.');
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
            Create your admin account
          </p>
        </div>

        <LoadingOverlay loading={loading}>
          <Card>
            <CardHeader>
              <CardTitle level={2}>Sign Up</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Form form={form} onSubmit={onSubmit} loading={loading}>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    error={errors.firstName?.message}
                    required
                  >
                    <Input
                      {...form.register('firstName')}
                      placeholder="First name"
                      autoComplete="given-name"
                      autoFocus
                    />
                  </FormField>

                  <FormField
                    label="Last Name"
                    error={errors.lastName?.message}
                    required
                  >
                    <Input
                      {...form.register('lastName')}
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </FormField>
                </div>

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
                      placeholder="Create a password"
                      autoComplete="new-password"
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
                  
                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>Password strength:</span>
                        <span className={passwordStrength >= 3 ? 'text-green-600' : 'text-yellow-600'}>
                          {strengthLabels[passwordStrength]}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${strengthColors[passwordStrength]}`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </FormField>

                <FormField
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                  required
                >
                  <div className="relative">
                    <Input
                      {...form.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </FormField>

                <FormField error={errors.acceptTerms?.message}>
                  <label className="flex items-start space-x-3">
                    <input
                      {...form.register('acceptTerms')}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </FormField>

                <FormActions>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    <ButtonLoading loading={loading}>
                      Create Account
                    </ButtonLoading>
                  </Button>
                </FormActions>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/signin"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:underline font-medium"
                  >
                    Sign in
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
