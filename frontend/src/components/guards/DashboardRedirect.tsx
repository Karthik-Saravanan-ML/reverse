import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function DashboardRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'COMPANY_EMPLOYEE':
      return <Navigate to="/employee/dashboard" replace />;
    case 'CLIENT':
      return <Navigate to="/client/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}
