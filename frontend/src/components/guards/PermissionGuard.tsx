import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Permission, UserWithPermissions } from '../../types/auth';

interface PermissionGuardProps {
  requiredPermissions: Permission[];
  requireAll?: boolean; // If true, user needs all permissions. If false, needs at least one.
  children?: React.ReactNode;
}

export function PermissionGuard({ requiredPermissions, requireAll = true, children }: PermissionGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Return nothing while loading to avoid flash
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admins bypass permission checks
  if (user.role === 'ADMIN') {
    return children ? <>{children}</> : <Outlet />;
  }

  const userWithPerms = user as UserWithPermissions;
  const userPermissions = userWithPerms.permissions || [];

  const hasPermission = requireAll
    ? requiredPermissions.every(p => userPermissions.includes(p))
    : requiredPermissions.some(p => userPermissions.includes(p));

  if (!hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
