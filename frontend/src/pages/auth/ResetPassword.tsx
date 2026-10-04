import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { Button } from '../../components/common';
import { cn } from '../../utils/cn';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Requirements state
  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    { regex: /[a-z]/, text: "At least 1 lowercase letter" },
    { regex: /[0-9]/, text: "At least 1 number" },
    { regex: /[^A-Za-z0-9]/, text: "At least 1 special character" },
  ];

  const strengthScore = requirements.filter(req => req.regex.test(password)).length;
  const isMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    
    if (strengthScore < requirements.length) {
      setError("Please meet all password requirements.");
      return;
    }

    if (!isMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authService.resetPassword(password, token);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full mb-6 inline-flex">
            <XCircle className="w-8 h-8 text-status-danger" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-500 mb-6">The password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button className="w-full">Request new link</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="bg-green-100 p-4 rounded-full mb-6 inline-flex">
            <CheckCircle2 className="w-8 h-8 text-status-success" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password reset!</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link to="/login">
            <Button className="w-full">Continue to login</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set new password</h1>
        <p className="text-gray-500">Your new password must be different from previously used passwords.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-status-danger text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <PasswordInput
            label="New password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1 h-1.5 w-full">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "h-full w-full rounded-full transition-colors duration-300",
                      password.length === 0 ? "bg-gray-200" : 
                      level <= strengthScore ? (
                        strengthScore <= 2 ? "bg-status-danger" :
                        strengthScore <= 4 ? "bg-status-warning" : "bg-status-success"
                      ) : "bg-gray-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-right text-gray-500">
                {strengthScore <= 2 ? "Weak" : strengthScore <= 4 ? "Medium" : "Strong"}
              </p>
            </div>
          )}

          {/* Requirements List */}
          <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-2">Password requirements:</p>
            <ul className="space-y-1.5">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  {req.regex.test(password) ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
                  )}
                  <span className={req.regex.test(password) ? "text-gray-700" : "text-gray-500"}>
                    {req.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <PasswordInput
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
            required
            error={!isMatch && confirmPassword ? "Passwords do not match" : undefined}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isSubmitting}
          disabled={strengthScore < requirements.length || !isMatch}
        >
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}
