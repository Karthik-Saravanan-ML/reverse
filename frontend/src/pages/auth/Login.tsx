import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Input, Button } from '../../components/common';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500">Please enter your details to sign in.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-600">Remember for 30 days</span>
            </label>
            <Link 
              to="/forgot-password" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full mt-2" 
          isLoading={isSubmitting}
        >
          Sign in
        </Button>
      </form>

      {/* For development purposes - hint for mock data */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-200">
        <p className="font-semibold mb-1">Development Mock Accounts:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Admin: <span className="font-mono">admin@ainativecrm.com</span></li>
          <li>Employee: <span className="font-mono">employee@ainativecrm.com</span></li>
          <li>Client: <span className="font-mono">client@external.com</span></li>
        </ul>
      </div>
    </AuthLayout>
  );
}

