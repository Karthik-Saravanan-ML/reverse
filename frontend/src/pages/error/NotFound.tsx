import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/common';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100">
          <Search className="w-10 h-10 text-primary-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-lg">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto gap-2" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              <Home className="w-4 h-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
