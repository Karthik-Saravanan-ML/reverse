import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import { userService } from '../../services/user.service';
import type { Role, User } from '../../types/auth';
import { Card, CardContent, Button, Input } from '../../components/common';
import { AdminLayout } from '../../components/layout/AdminLayout';

type FormErrors = Partial<Record<'fullName' | 'email', string>>;

export default function CreateUser() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'COMPANY_EMPLOYEE' as Role,
    department: '',
    status: 'ACTIVE' as User['status'],
    sendEmail: true,
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await userService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
      });
      // TODO: if sendEmail is true, trigger POST /api/auth/invite from backend
      navigate('/admin/users');
    } catch (error) {
      console.error('Failed to create user', error);
      setIsSubmitting(false);
    }
  };

  const roles: Array<{ value: Role; label: string; description: string; color: string }> = [
    { value: 'ADMIN', label: 'Admin', description: 'Full system administration and platform configuration.', color: 'border-primary-500 bg-primary-50 text-primary-900' },
    { value: 'COMPANY_EMPLOYEE', label: 'Company Employee', description: 'CRM and project operations per assigned permissions.', color: 'border-violet-500 bg-violet-50 text-violet-900' },
    { value: 'CLIENT', label: 'Client', description: 'Access to assigned projects and permitted information only.', color: 'border-gray-400 bg-gray-50 text-gray-900' },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/admin/users">
            <Button variant="ghost" size="sm" className="px-2 text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary-600" />
              Create New User
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">Add a new user and assign them a role on the platform.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Card>
            <CardContent className="p-6 lg:p-8 space-y-6">
              {/* Personal Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Jane Smith"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    error={errors.fullName}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 555 000 0000 (optional)"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Department"
                    placeholder="e.g. Sales, Engineering"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Role Selection */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Role Assignment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {roles.map(({ value, label, description, color }) => (
                    <label
                      key={value}
                      className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.role === value ? color : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        className="sr-only"
                        checked={formData.role === value}
                        onChange={() => setFormData({ ...formData, role: value })}
                      />
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm">{label}</span>
                        {formData.role === value && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-gray-500 leading-relaxed">{description}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Account Settings */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Account Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Status</label>
                    <select
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as User['status'] })}
                    >
                      <option value="ACTIVE">Active — Immediate Access</option>
                      <option value="PENDING">Pending — Requires Activation</option>
                      <option value="INACTIVE">Inactive — Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Invitation Option */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                  checked={formData.sendEmail}
                  onChange={e => setFormData({ ...formData, sendEmail: e.target.checked })}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Send invitation email</span>
                  <p className="text-xs text-gray-500 mt-0.5">The user will receive an email with login instructions and a temporary setup link.</p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <Link to="/admin/users">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" isLoading={isSubmitting}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
