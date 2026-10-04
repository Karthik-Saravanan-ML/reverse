import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Shield, Users, Lock, Activity, Home,
  LogOut, ChevronRight, Menu, User
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: Home },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Roles & Permissions', href: '/admin/roles', icon: Lock },
  { label: 'Audit Log', href: '/admin/audit', icon: Activity },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-primary-950 text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-primary-800">
        <div className="bg-primary-600 p-1.5 rounded-md">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">AI-Native CRM</span>
      </div>

      {/* Admin Badge */}
      <div className="px-6 py-3 bg-primary-900/50 border-b border-primary-800">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">Admin Console</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/admin/dashboard' && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-300 hover:bg-primary-800 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-primary-800 p-4">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
            {user?.fullName?.charAt(0) ?? 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-primary-400 truncate">{user?.email}</p>
          </div>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors mb-1"
        >
          <User className="w-4 h-4" />
          Profile Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-primary-300 hover:text-white hover:bg-primary-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-surface-light overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 flex">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="font-semibold text-gray-900 text-sm">AI-Native CRM</span>
          </div>
          <div className="w-9" /> {/* spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-surface-light">
          {children}
        </main>
      </div>
    </div>
  );
}
