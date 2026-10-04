import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';

// Profile
import Profile from './pages/profile/Profile';

// Admin Pages
import UserManagement from './pages/admin/UserManagement';
import CreateUser from './pages/admin/CreateUser';
import RolesPermissions from './pages/admin/RolesPermissions';
import AuditLog from './pages/admin/AuditLog';

// Error Pages
import Unauthorized from './pages/error/Unauthorized';
import NotFound from './pages/error/NotFound';

// Guards
import { ProtectedRoute } from './components/guards/ProtectedRoute';
import { RoleGuard } from './components/guards/RoleGuard';
import { DashboardRedirect } from './components/guards/DashboardRedirect';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public Auth Routes ───────────────────────────── */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" replace />} />

      {/* ── Smart Role-based Dashboard Redirect ──────────── */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Admin-Only Routes (ADMIN role required) ───────── */}
      <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/roles" element={<RolesPermissions />} />
        <Route path="/admin/audit" element={<AuditLog />} />
      </Route>

      {/* ── Employee Routes ───────────────────────────────── */}
      <Route element={<RoleGuard allowedRoles={['COMPANY_EMPLOYEE', 'ADMIN']} />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      </Route>

      {/* ── Client Routes ─────────────────────────────────── */}
      <Route element={<RoleGuard allowedRoles={['CLIENT']} />}>
        <Route path="/client/dashboard" element={<ClientDashboard />} />
      </Route>

      {/* ── Common Protected Routes ───────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ── Error / Fallback Routes ───────────────────────── */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
