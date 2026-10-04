import React from 'react';
import { Shield } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-surface-light">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              AI-Native CRM
            </span>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Branding / Decorative */}
      <div className="hidden md:flex flex-col justify-center p-12 bg-primary-900 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950 opacity-90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 max-w-lg mx-auto text-white">
          <h2 className="text-4xl font-bold mb-6">Intelligent Project Memory System</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Secure, role-based access to your enterprise data. Streamline operations and collaborate efficiently across teams and clients with AI-powered insights.
          </p>
        </div>
      </div>
    </div>
  );
}
