import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../components/common';
import { Users, Lock, Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';

export default function AdminDashboard() {
  const { user } = useAuth();

  const quickLinks = [
    { label: 'Manage Users', href: '/admin/users', icon: Users, description: 'Create, edit, and manage user accounts and roles.', badge: null },
    { label: 'Roles & Permissions', href: '/admin/roles', icon: Lock, description: 'Configure role-based access controls per module.', badge: null },
    { label: 'Audit Log', href: '/admin/audit', icon: Activity, description: 'Review security events and admin activity.', badge: null },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
        {/* Greeting */}
        <div className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-2xl p-6 lg:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">ADMIN</Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mt-3">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
          <p className="text-primary-200 mt-1">You have full administrative access to the AI-Native CRM platform.</p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map(({ label, href, icon: Icon, description }) => (
              <Link key={href} to={href}>
                <Card className="group hover:border-primary-300 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-50 group-hover:bg-primary-100 transition-colors p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <CardTitle className="text-base">{label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-600" />
              <CardTitle>Your Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{user?.fullName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium text-gray-900 mt-0.5">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Role</dt>
                <dd className="mt-0.5"><Badge variant="primary">Admin</Badge></dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="mt-0.5"><Badge variant="success">Active</Badge></dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
