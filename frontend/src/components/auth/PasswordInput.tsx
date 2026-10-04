import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from '../common/Input';
import { cn } from '../../utils/cn';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
