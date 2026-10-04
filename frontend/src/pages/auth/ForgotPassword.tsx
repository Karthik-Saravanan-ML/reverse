import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { Input, Button } from '../../components/common';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary-100 p-4 rounded-full mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check your inbox</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            We sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
          </p>
          
          <div className="flex flex-col space-y-4 w-full">
            <Button variant="outline" onClick={() => setIsSuccess(false)} className="w-full">
              Resend email
            </Button>
            <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to log in
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h1>
        <p className="text-gray-500">No worries, we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-status-danger text-sm border border-red-200">
            {error}
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
        />

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
        >
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
